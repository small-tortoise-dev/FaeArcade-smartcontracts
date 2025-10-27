// =======================================================
//  FAE Arcade Treasury Contract
//  Author: <you>
//  Network: TON Testnet
//  Purpose: Manage arcade rooms, entry fees, and rewards
// =======================================================

// -------------------------------
// Struct Definitions
// -------------------------------

// Room data structure (top-level in Tact)
struct RoomData {
    entry_fee: Int;
    winners_count: Int;
    status: Int;         // 0 = Closed, 1 = Open, 2 = Paid
    pool: Int;
    total_entries: Int;
    paid_hash: Int;
    created_at: Int;
    closed_at: Int;
}

// -------------------------------
// Opcode-based Message Structures
// -------------------------------

message OpenRoom {
    room_key: Int as uint32;
    entry_fee: Int as coins;
    winners_count: Int as uint8;
}

message EnterRoom {
    room_key: Int as uint32;
    entry_fee: Int as coins;
}

message CloseRoom {
    room_key: Int as uint32;
}

message DistributePayouts {
    room_key: Int as uint32;
    winners_count: Int as uint8;
    winners: map<Int, Address>;  // index -> winner address
}

message ClaimReward {
    room_key: Int as uint32;
    winner_address: Address;
}

// -------------------------------
// Contract Definition
// -------------------------------
contract Treasury {

    // Persistent State
    owner: Address;
    upgrade_authority: Address;

    // Treasury pools and bookkeeping
    airdrop_pool: Int;
    airdrop_id: Int;

    // Multi-room data
    rooms: map<Int, RoomData>;
    current_room_id: Int;

    // Winner tracking (pull-based)
    winner_rewards: map<Address, Int>;  // Address -> reward amount
    claimed_rewards: map<Address, Int>; // Address -> total claimed

    // Constants
    HOUSE_FEE_BPS: Int = 250;        // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;

    // -------------------------------
    // Constructor
    // -------------------------------
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.airdrop_id = 0;
        self.current_room_id = 0;
        // Maps are auto-initialized empty
    }

    // =======================================================
    //  Room Management
    // =======================================================

    // -------------------------------
    // Open new room
    // -------------------------------
    receive(msg: OpenRoom) {
        // Parameter validation
        require(msg.entry_fee > 0, "Entry fee must be positive");
        require(msg.winners_count > 0, "Winners count must be positive");
        require(msg.winners_count <= 1000, "Too many winners");
        require(msg.room_key > 0, "Room key must be positive");

        // Prevent duplicate room
        let existing_room: RoomData? = self.rooms.get(msg.room_key);
        require(existing_room == null, "Room already exists");

        // Create and save room
        let new_room: RoomData = RoomData{
            entry_fee: msg.entry_fee,
            winners_count: msg.winners_count,
            status: 1, // Open
            pool: 0,
            total_entries: 0,
            paid_hash: 0,
            created_at: now(),
            closed_at: 0
        };

        self.rooms.set(msg.room_key, new_room);
        self.current_room_id = msg.room_key;
    }

    // -------------------------------
    // Enter an existing room
    // -------------------------------
    receive(msg: EnterRoom) {
        let room: RoomData? = self.rooms.get(msg.room_key);
        require(room != null, "Room does not exist");

        let room_data: RoomData = room!!;
        require(room_data.status == 1, "Room is not open");
        require(room_data.entry_fee == msg.entry_fee, "Entry fee mismatch");

        let actual_entry_fee: Int = room_data.entry_fee;
        let received: Int = context().value;

        // Must pay exact entry fee
        require(received == actual_entry_fee, "Entry fee must be exact amount");

        // Fee split
        let house_fee: Int = (actual_entry_fee * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        let pool_contribution: Int = actual_entry_fee - house_fee;

        // Update pool + entries
        room_data.pool += pool_contribution;
        room_data.total_entries += 1;
        self.rooms.set(msg.room_key, room_data);

        // Send house fee to owner
        if (house_fee > 0) {
            send(SendParameters{
                to: self.owner,
                value: house_fee,
                body: "House Fee".asComment(),
                bounce: false
            });
        }
    }

    // -------------------------------
    // Close room
    // -------------------------------
    receive(msg: CloseRoom) {
        let room: RoomData? = self.rooms.get(msg.room_key);
        require(room != null, "Room not found");

        let room_data: RoomData = room!!;
        require(room_data.status == 1, "Room is not open");

        room_data.status = 0;
        room_data.closed_at = now();
        self.rooms.set(msg.room_key, room_data);
    }

    // -------------------------------
    // Distribute payouts (linear weighting)
    // -------------------------------
    receive(msg: DistributePayouts) {
        let room: RoomData? = self.rooms.get(msg.room_key);
        require(room != null, "Room not found");

        let room_data: RoomData = room!!;
        require(room_data.status == 0, "Room is not closed");
        require(room_data.paid_hash == 0, "Room already paid");
        require(msg.winners_count == room_data.winners_count, "Winners count mismatch");

        let remaining_pool: Int = room_data.pool;
        let per_winner: Int = remaining_pool / msg.winners_count;

        // Store winners with equal split
        let i: Int = 0;
        repeat (msg.winners_count) {
            let winner_address: Address? = msg.winners.get(i);
            if (winner_address != null) {
                self.winner_rewards.set(winner_address!!, per_winner);
            }
            i += 1;
        }

        room_data.status = 2;
        room_data.paid_hash = now();
        self.rooms.set(msg.room_key, room_data);
    }

    // =======================================================
    //  Reward Claiming
    // =======================================================
    receive(msg: ClaimReward) {
        let room: RoomData? = self.rooms.get(msg.room_key);
        require(room != null, "Room not found");

        let room_data: RoomData = room!!;
        require(room_data.status == 2, "Room is not paid");

        let reward_amount: Int? = self.winner_rewards.get(msg.winner_address);
        require(reward_amount != null, "No reward for this address");

        let already_claimed: Int = 0;
        let claimed: Int? = self.claimed_rewards.get(msg.winner_address);
        if (claimed != null) {
            already_claimed = claimed!!;
        }

        let remaining: Int = reward_amount!! - already_claimed;
        require(remaining > 0, "No remaining reward to claim");

        send(SendParameters{
            to: msg.winner_address,
            value: remaining,
            body: "Reward Claim".asComment(),
            bounce: false
        });

        self.claimed_rewards.set(msg.winner_address, already_claimed + remaining);
    }

    // =======================================================
    //  Airdrop Logic
    // =======================================================

    // Default receive handler for empty messages (deployment, simple transfers)
    receive() {
        // Accept empty messages - this is needed for deployment
        // and simple TON transfers to the contract
    }

    // Fallback receiver for any text comment (accepts donations/transfers)
    receive(msg: String) {
        // Accept any text message as a donation to the contract
        // This prevents bounces when users send TON with comments
    }

    receive("fund_airdrop") {
        self.airdrop_pool += context().value;
    }

    receive("distribute_airdrop") {
        require(self.airdrop_pool > 0, "No airdrop pool available");

        self.airdrop_id += 1;
        let half_pool: Int = self.airdrop_pool / 2;

        let top_scorer_count: Int = 10;
        let streak_winner_count: Int = 5;

        let top_scorer_amount: Int = (top_scorer_count > 0) ? (half_pool / top_scorer_count) : 0;
        let streak_amount: Int = (streak_winner_count > 0) ? (half_pool / streak_winner_count) : 0;

        if (top_scorer_amount > 0) {
            send(SendParameters{
                to: context().sender,
                value: top_scorer_amount,
                body: "Top Scorer Airdrop".asComment(),
                bounce: false
            });
        }

        self.airdrop_pool = 0;
    }

    // =======================================================
    //  Getters
    // =======================================================
    get fun getOwner(): Address { return self.owner; }
    get fun getUpgradeAuthority(): Address { return self.upgrade_authority; }
    get fun getAirdropPool(): Int { return self.airdrop_pool; }
    get fun getAirdropId(): Int { return self.airdrop_id; }
    get fun getCurrentRoomId(): Int { return self.current_room_id; }
    get fun getHouseFeeBps(): Int { return self.HOUSE_FEE_BPS; }
    get fun getHouseFeeDenominator(): Int { return self.HOUSE_FEE_DENOMINATOR; }

    get fun getRoomData(room_key: Int): RoomData? {
        return self.rooms.get(room_key);
    }

    get fun getWinnerReward(_: Int, addr: Address): Int? {
        return self.winner_rewards.get(addr);
    }

    get fun getClaimedReward(_: Int, addr: Address): Int? {
        return self.claimed_rewards.get(addr);
    }
}
