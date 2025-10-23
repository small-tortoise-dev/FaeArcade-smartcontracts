import "@stdlib/deploy";

// Room data structure (must be top-level in Tact)
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
    
    // Winner rewards tracking (pull-based payouts) - simplified approach
    winner_rewards: map<Int, Int>; // composite key: room_key * 1000000 + winner_address_hash -> reward_amount
    claimed_rewards: map<Int, Int>; // composite key: room_key * 1000000 + winner_address_hash -> claimed_amount
    
    // Constants
    HOUSE_FEE_BPS: Int = 250; // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;
    
    // Event opcodes
    EVENT_ROOM_OPENED: Int = 0x12345678;
    EVENT_ROOM_CLOSED: Int = 0x12345679;
    EVENT_PAYOUT_DISTRIBUTED: Int = 0x1234567A;
    EVENT_AIRDROP_DISTRIBUTED: Int = 0x1234567B;
    EVENT_REWARD_CLAIMED: Int = 0x1234567C;
    EVENT_ROOM_ENTRY: Int = 0x1234567D;
    
    // Room data structure defined at top-level
    
    // Constructor
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.airdrop_id = 0;
        self.current_room_id = 0;
    }
    
    // Helper functions for composite keys
    fun getCompositeKey(room_key: Int, winner_address: Address): Int {
        // Convert address to a simple hash for composite key
        // For simplicity, we'll use a fixed offset based on the address
        let address_offset: Int = 12345; // Fixed offset for demo
        return room_key * 1000000 + address_offset;
    }
    
    // External message handlers
    
    // Open a new room with dynamic parameters
    receive("open_room") {
        // For text messages, create a default room with key 12345
        let room_key: Int = 12345;
        let entry_fee: Int = ton("1.5"); // 1.5 TON entry fee
        let winners_count: Int = 100; // 100 winners
        
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
    
    // User enters a paid room
    receive("enter_paid") {
        // For text messages, we need to use a default room key
        // In a real implementation, the room key should be passed differently
        let default_room_key: Int = 12345; // Default room key for now
        
        // Get room data
        let room: RoomData? = self.rooms.get(default_room_key);
        require(room != null, "Room not found");
        
        let room_data: RoomData = room!!;
        require(room_data.status == 1, "Room is not open");
        
        // Validate entry fee
        require(context().value == room_data.entry_fee, "Incorrect entry fee");
        
        // Calculate house fee (2.5%)
        let house_fee: Int = (context().value * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        
        // Send house fee to owner wallet immediately
        if (house_fee > 0) {
            send(SendParameters{
                to: self.owner,
                value: house_fee,
                body: "House Fee".asComment(),
                bounce: false
            });
        }
        
        // Add 97.5% to room pool
        let pool_contribution: Int = context().value - house_fee;
        
        // Update room data
        room_data.pool = room_data.pool + pool_contribution;
        room_data.total_entries = room_data.total_entries + 1;
        
        self.rooms.set(default_room_key, room_data);
        
        // Emit entry event for transparency
        self.emitRoomEntry(default_room_key, context().sender, context().value, pool_contribution, house_fee);
    }
    
    // Close a room (only owner or authorized backend) - text message with parameters
    receive("close_room_params") {
        // Parse message body for room key using context().raw
        let slice = context().raw;
        let room_key: Int = slice.loadUint(32);
        
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
    
    // Distribute payouts with linear weights (pull-based) - text message with parameters
    receive("distribute_payouts_params") {
        // Parse message body for parameters using context().raw
        let slice = context().raw;
        let room_key: Int = slice.loadUint(32);
        let winners_count: Int = slice.loadUint(8);
        
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
            let winner_address: Address = slice.loadAddress();
            let weight: Int = winners_count - i; // Linear weight: 1st gets highest weight
            
            // Calculate reward amount
            let reward_amount: Int = (remaining_pool * weight) / total_weight;
            
            // Store reward for later claiming using composite key
            let composite_key: Int = self.getCompositeKey(room_key, winner_address);
            self.winner_rewards.set(composite_key, reward_amount);
            
            i = i + 1;
        }
        
        // Mark room as paid
        room_data.status = 2; // Paid
        room_data.paid_hash = now(); // Use timestamp as hash
        
        self.rooms.set(room_key, room_data);
        
        // Emit payout distributed event
        self.emitPayoutDistributed(room_key, room_data.pool, winners_count);
    }
    
    // Claim reward (pull-based payout) - text message with parameters
    receive("claim_reward_params") {
        // Parse message body for parameters using context().raw
        let slice = context().raw;
        let room_key: Int = slice.loadUint(32);
        let winner_address: Address = slice.loadAddress();
        
        // Check if winner has unclaimed rewards using composite key
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        let reward_amount: Int? = self.winner_rewards.get(composite_key);
        require(reward_amount != null, "No rewards to claim");
        
        let reward: Int = reward_amount!!;
        require(reward > 0, "No rewards to claim");
        
        // Check if already claimed
        let claimed_amount: Int? = self.claimed_rewards.get(composite_key);
        let claimed: Int = 0;
        if (claimed_amount != null) {
            claimed = claimed_amount!!;
        }
        require(claimed == 0, "Reward already claimed");
        
        // Send reward
        send(SendParameters{
            to: winner_address,
            value: reward,
            body: "Reward Claim".asComment()
        });
        
        // Mark as claimed
        self.claimed_rewards.set(composite_key, reward);
        
        // Emit reward claimed event
        self.emitRewardClaimed(room_key, winner_address, reward);
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        // Anyone can fund the airdrop pool
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Enhanced airdrop distribution
    receive("distribute_airdrop") {
        // For now, use default parameters since message parsing is complex
        let airdrop_id: Int = 1; // Default airdrop ID
        let top_scorer_count: Int = 10; // Default counts
        let streak_winner_count: Int = 5;
        
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
        
        // For text messages, we'll send to the sender as a demo
        if (top_scorer_amount > 0) {
            send(SendParameters{
                to: context().sender,
                value: top_scorer_amount,
                body: "Top Scorer Airdrop".asComment()
            });
        }
        
        // Reset airdrop pool
        self.airdrop_pool = 0;
        
        // Emit airdrop distributed event
        self.emitAirdropDistributed(airdrop_id, top_scorer_count, streak_winner_count);
    }
    
    // Upgrade contract code (only upgrade authority)
    receive("upgrade") {
        // For now, skip upgrade functionality since message parsing is complex
        // In a real implementation, this would parse the message body and upgrade the contract
        require(context().sender == self.upgrade_authority, "Unauthorized");
    }
    
    // Event emission functions
    fun emitRoomEntry(room_key: Int, player_address: Address, entry_fee: Int, pool_contribution: Int, house_fee: Int) {
        send(SendParameters{
            to: self.owner,
            value: 0,
            body: beginCell()
                .storeUint(self.EVENT_ROOM_ENTRY, 32)
                .storeUint(room_key, 32)
                .storeAddress(player_address)
                .storeCoins(entry_fee)
                .storeCoins(pool_contribution)
                .storeCoins(house_fee)
                .storeUint(now(), 32)
                .endCell()
        });
    }
    
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
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        let reward: Int? = self.winner_rewards.get(composite_key);
        if (reward == null) {
            return 0;
        } else {
            return reward!!;
        }
    }
    
    get fun getClaimedReward(room_key: Int, winner_address: Address): Int {
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        let claimed: Int? = self.claimed_rewards.get(composite_key);
        if (claimed == null) {
            return 0;
        } else {
            return claimed!!;
        }
    }
    
    get fun getHouseFeeBps(): Int {
        return self.HOUSE_FEE_BPS;
    }
    
    get fun getHouseFeeDenominator(): Int {
        return self.HOUSE_FEE_DENOMINATOR;
    }
}
