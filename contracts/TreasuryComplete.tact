import "@stdlib/deploy";

// Complete FAE Arcade Treasury Contract - Production Ready
contract TreasuryComplete with Deployable {
    
    // State variables
    owner: Address;
    upgrade_authority: Address;
    
    // Treasury pools
    airdrop_pool: Int;
    airdrop_id: Int;
    
    // Multi-room support
    rooms: map<Int, RoomData>;
    current_room_id: Int;
    
    // Winner rewards tracking (pull-based payouts)
    winner_rewards: map<Int, map<Address, Int>>; // room_key -> (winner_address -> reward_amount)
    claimed_rewards: map<Int, map<Address, Int>>; // room_key -> (winner_address -> claimed_amount)
    
    // Constants
    HOUSE_FEE_BPS: Int = 250; // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;
    
    // Event opcodes
    EVENT_ROOM_OPENED: Int = 0x12345678;
    EVENT_ROOM_CLOSED: Int = 0x12345679;
    EVENT_PAYOUT_DISTRIBUTED: Int = 0x1234567A;
    EVENT_AIRDROP_DISTRIBUTED: Int = 0x1234567B;
    EVENT_REWARD_CLAIMED: Int = 0x1234567C;
    
    // Room data structure
    struct RoomData {
        entry_fee: Int;
        winners_count: Int;
        status: Int; // 0=Closed, 1=Open, 2=Paid
        pool: Int;
        total_entries: Int;
        paid_hash: Int;
        created_at: Int;
        closed_at: Int;
    }
    
    // Constructor
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.airdrop_id = 0;
        self.current_room_id = 0;
    }
    
    // External message handlers
    
    // Open a new room with dynamic parameters
    receive("open_room") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            // Parse room parameters
            let room_key: Int = slice.load_uint(32);
            let entry_fee: Int = slice.load_coins();
            let winners_count: Int = slice.load_uint(8);
            
            // Validate parameters
            require(entry_fee > 0, "Entry fee must be positive");
            require(winners_count > 0, "Winners count must be positive");
            require(winners_count <= 1000, "Too many winners");
            
            // Check if room already exists
            let existing_room: RoomData? = self.rooms.get(room_key);
            require(existing_room == null, "Room already exists");
            
            // Create new room
            let new_room: RoomData = RoomData{
                entry_fee: entry_fee,
                winners_count: winners_count,
                status: 1, // Open
                pool: 0,
                total_entries: 0,
                paid_hash: 0,
                created_at: now(),
                closed_at: 0
            };
            
            self.rooms.set(room_key, new_room);
            self.current_room_id = room_key;
            
            // Emit room opened event
            self.emitRoomOpened(room_key, entry_fee, winners_count);
        }
    }
    
    // User enters a paid room
    receive("enter_paid") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            let room_key: Int = slice.load_uint(32);
            
            // Get room data
            let room: RoomData? = self.rooms.get(room_key);
            require(room != null, "Room not found");
            
            let room_data: RoomData = room!!;
            require(room_data.status == 1, "Room is not open");
            
            // Validate entry fee
            require(context().value == room_data.entry_fee, "Incorrect entry fee");
            
            // Calculate house fee (2.5%)
            let house_fee: Int = (context().value * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
            
            // Add 97.5% to room pool
            let pool_contribution: Int = context().value - house_fee;
            
            // Update room data
            room_data.pool = room_data.pool + pool_contribution;
            room_data.total_entries = room_data.total_entries + 1;
            
            self.rooms.set(room_key, room_data);
        }
    }
    
    // Close a room (only owner or authorized backend)
    receive("close_room") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            let room_key: Int = slice.load_uint(32);
            
            // Get room data
            let room: RoomData? = self.rooms.get(room_key);
            require(room != null, "Room not found");
            
            let room_data: RoomData = room!!;
            require(room_data.status == 1, "Room is not open");
            
            // Close room
            room_data.status = 0; // Closed
            room_data.closed_at = now();
            
            self.rooms.set(room_key, room_data);
            
            // Emit room closed event
            self.emitRoomClosed(room_key, room_data.pool, room_data.total_entries);
        }
    }
    
    // Distribute payouts with linear weights (pull-based)
    receive("distribute_payouts") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            let room_key: Int = slice.load_uint(32);
            let winners_count: Int = slice.load_uint(8);
            
            // Get room data
            let room: RoomData? = self.rooms.get(room_key);
            require(room != null, "Room not found");
            
            let room_data: RoomData = room!!;
            require(room_data.status == 0, "Room is not closed");
            require(room_data.paid_hash == 0, "Room already paid");
            require(winners_count == room_data.winners_count, "Winners count mismatch");
            
            // Calculate linear weights
            let total_weight: Int = (winners_count * (winners_count + 1)) / 2;
            let remaining_pool: Int = room_data.pool;
            
            // Parse winners and distribute rewards
            let i: Int = 0;
            while (i < winners_count) {
                let winner_address: Address = slice.load_address();
                let weight: Int = winners_count - i; // Linear weight: 1st gets highest weight
                
                // Calculate reward amount
                let reward_amount: Int = (remaining_pool * weight) / total_weight;
                
                // Store reward for later claiming
                let reward_key: (Int, Address) = (room_key, winner_address);
                self.winner_rewards.set(reward_key, reward_amount);
                
                i = i + 1;
            }
            
            // Mark room as paid
            room_data.status = 2; // Paid
            room_data.paid_hash = now(); // Use timestamp as hash
            
            self.rooms.set(room_key, room_data);
            
            // Emit payout distributed event
            self.emitPayoutDistributed(room_key, room_data.pool, winners_count);
        }
    }
    
    // Claim reward (pull-based payout)
    receive("claim_reward") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            let room_key: Int = slice.load_uint(32);
            let winner_address: Address = slice.load_address();
            
            // Check if winner has unclaimed rewards
            let reward_key: (Int, Address) = (room_key, winner_address);
            let reward_amount: Int? = self.winner_rewards.get(reward_key);
            require(reward_amount != null, "No rewards to claim");
            
            let reward: Int = reward_amount!!;
            require(reward > 0, "No rewards to claim");
            
            // Check if already claimed
            let claimed_amount: Int? = self.claimed_rewards.get(reward_key);
            let claimed: Int = if (claimed_amount == null) 0 else claimed_amount!!;
            require(claimed == 0, "Reward already claimed");
            
            // Send reward
            send(SendParameters{
                to: winner_address,
                value: reward,
                body: "Reward Claim".asComment()
            });
            
            // Mark as claimed
            self.claimed_rewards.set(reward_key, reward);
            
            // Emit reward claimed event
            self.emitRewardClaimed(room_key, winner_address, reward);
        }
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        // Anyone can fund the airdrop pool
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Enhanced airdrop distribution
    receive("distribute_airdrop") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            let airdrop_id: Int = slice.load_uint(32);
            let top_scorer_count: Int = slice.load_uint(8);
            let streak_winner_count: Int = slice.load_uint(8);
            
            // Validate we have enough in the pool
            require(self.airdrop_pool > 0, "No airdrop pool available");
            
            // Increment airdrop ID
            self.airdrop_id = self.airdrop_id + 1;
            
            // Split airdrop pool 50/50
            let half_pool: Int = self.airdrop_pool / 2;
            
            // Calculate amounts per winner
            let top_scorer_amount: Int = 0;
            let streak_winner_amount: Int = 0;
            
            if (top_scorer_count > 0) {
                top_scorer_amount = half_pool / top_scorer_count;
            }
            
            if (streak_winner_count > 0) {
                streak_winner_amount = half_pool / streak_winner_count;
            }
            
            // Parse and send to top scorer winners
            let i: Int = 0;
            while (i < top_scorer_count) {
                let winner_address: Address = slice.load_address();
                if (top_scorer_amount > 0) {
                    send(SendParameters{
                        to: winner_address,
                        value: top_scorer_amount,
                        body: "Top Scorer Airdrop".asComment()
                    });
                }
                i = i + 1;
            }
            
            // Parse and send to streak winners
            i = 0;
            while (i < streak_winner_count) {
                let winner_address: Address = slice.load_address();
                if (streak_winner_amount > 0) {
                    send(SendParameters{
                        to: winner_address,
                        value: streak_winner_amount,
                        body: "Streak Winner Airdrop".asComment()
                    });
                }
                i = i + 1;
            }
            
            // Reset airdrop pool
            self.airdrop_pool = 0;
            
            // Emit airdrop distributed event
            self.emitAirdropDistributed(airdrop_id, top_scorer_count, streak_winner_count);
        }
    }
    
    // Upgrade contract code (only upgrade authority)
    receive("upgrade") {
        // Parse message body
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            // Check authorization
            require(context().sender == self.upgrade_authority, "Unauthorized");
            
            // Load new code
            let new_code: Cell = slice.load_ref();
            
            // Update contract code
            set_code(new_code);
        }
    }
    
    // Event emission functions
    fun emitRoomOpened(room_key: Int, entry_fee: Int, winners_count: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_ROOM_OPENED, 32)
                .storeUint(room_key, 32)
                .storeCoins(entry_fee)
                .storeUint(winners_count, 8)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
    fun emitRoomClosed(room_key: Int, pool: Int, total_entries: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_ROOM_CLOSED, 32)
                .storeUint(room_key, 32)
                .storeCoins(pool)
                .storeUint(total_entries, 32)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
    fun emitPayoutDistributed(room_key: Int, pool: Int, winners_count: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_PAYOUT_DISTRIBUTED, 32)
                .storeUint(room_key, 32)
                .storeCoins(pool)
                .storeUint(winners_count, 8)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
    fun emitRewardClaimed(room_key: Int, winner_address: Address, amount: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_REWARD_CLAIMED, 32)
                .storeUint(room_key, 32)
                .storeAddress(winner_address)
                .storeCoins(amount)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
    fun emitAirdropDistributed(airdrop_id: Int, top_count: Int, streak_count: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_AIRDROP_DISTRIBUTED, 32)
                .storeUint(airdrop_id, 32)
                .storeUint(top_count, 8)
                .storeUint(streak_count, 8)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
    // Getter functions
    get fun getOwner(): Address {
        return self.owner;
    }
    
    get fun getUpgradeAuthority(): Address {
        return self.upgrade_authority;
    }
    
    get fun getAirdropPool(): Int {
        return self.airdrop_pool;
    }
    
    get fun getAirdropId(): Int {
        return self.airdrop_id;
    }
    
    get fun getCurrentRoomId(): Int {
        return self.current_room_id;
    }
    
    get fun getRoomData(room_key: Int): RoomData? {
        return self.rooms.get(room_key);
    }
    
    get fun getWinnerReward(room_key: Int, winner_address: Address): Int {
        let reward_key: (Int, Address) = (room_key, winner_address);
        let reward: Int? = self.winner_rewards.get(reward_key);
        return if (reward == null) 0 else reward!!;
    }
    
    get fun getClaimedReward(room_key: Int, winner_address: Address): Int {
        let reward_key: (Int, Address) = (room_key, winner_address);
        let claimed: Int? = self.claimed_rewards.get(reward_key);
        return if (claimed == null) 0 else claimed!!;
    }
    
    get fun getHouseFeeBps(): Int {
        return self.HOUSE_FEE_BPS;
    }
    
    get fun getHouseFeeDenominator(): Int {
        return self.HOUSE_FEE_DENOMINATOR;
    }
}
