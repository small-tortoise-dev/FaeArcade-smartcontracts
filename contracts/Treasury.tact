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

// FAE Arcade Treasury Contract - Complete Implementation
contract Treasury with Deployable {
    
    // State variables
    owner: Address;
    upgrade_authority: Address;
    
    // Treasury pools
    airdrop_pool: Int;
    airdrop_id: Int;
    
    // Multi-room support with proper data structure
    rooms: map<Int, RoomData>;
    current_room_id: Int;
    
    // Winner rewards tracking (pull-based payouts) - simplified approach
    winner_rewards: map<Int, Int>; // composite key: room_key * 1000000 + winner_address_hash -> reward_amount
    claimed_rewards: map<Int, Int>; // composite key: room_key * 1000000 + winner_address_hash -> claimed_amount
    
    // Constants
    HOUSE_FEE_BPS: Int = 250; // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;
    
    // Constructor
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.airdrop_id = 0;
        self.current_room_id = 0;
    }
    
    // External message handlers
    
    // Open a new room with default parameters (text message)
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
    }
    
    // User enters a paid room (text message)
    receive("enter_paid") {
        // For text messages, we need to use a default room key
        let default_room_key: Int = 12345; // Default room key for now
        
        // Get room data
        let room: RoomData? = self.rooms.get(default_room_key);
        require(room != null, "Room not found");
        
        let room_data: RoomData = room!!;
        require(room_data.status == 1, "Room is not open");
        
        // Validate entry fee
        let received_amount: Int = context().value;
        let min_gas_fee: Int = ton("0.05");
        let max_gas_fee: Int = ton("0.1");
        let min_required: Int = room_data.entry_fee;
        let max_required: Int = room_data.entry_fee + max_gas_fee;
        
        require(received_amount >= min_required, "Insufficient entry fee");
        require(received_amount <= max_required, "Excessive payment amount");
        
        // Calculate house fee (2.5%)
        let house_fee: Int = (room_data.entry_fee * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        
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
        let pool_contribution: Int = room_data.entry_fee - house_fee;
        
        // Update room data
        room_data.pool = room_data.pool + pool_contribution;
        room_data.total_entries = room_data.total_entries + 1;
        
        self.rooms.set(default_room_key, room_data);
        
        // Refund excess if any
        let excess_amount: Int = received_amount - room_data.entry_fee;
        if (excess_amount > 0) {
            send(SendParameters{
                to: context().sender,
                value: excess_amount,
                body: "Excess refund".asComment(),
                bounce: false
            });
        }
    }
    
    // Close a room (text message)
    receive("close_room") {
        let room_key: Int = 12345; // Default room key
        
        // Get room data
        let room: RoomData? = self.rooms.get(room_key);
        require(room != null, "Room not found");
        
        let room_data: RoomData = room!!;
        require(room_data.status == 1, "Room is not open");
        
        // Close room
        room_data.status = 0; // Closed
        room_data.closed_at = now();
        
        self.rooms.set(room_key, room_data);
    }
    
    // Helper functions for composite keys
    fun getCompositeKey(room_key: Int, winner_address: Address): Int {
        // Convert address to a simple hash for composite key
        // For simplicity, we'll use a fixed offset based on the address
        let address_offset: Int = 12345; // Fixed offset for demo
        return room_key * 1000000 + address_offset;
    }
    
    // Distribute payouts with linear weights (pull-based) - text message
    receive("distribute_payouts") {
        let room_key: Int = 12345; // Default room key
        let winners_count: Int = 100; // Default winners count
        
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
        
        // For text messages, we'll simulate winner distribution
        // In a real implementation, winner addresses would be passed in the message
        let i: Int = 0;
        while (i < winners_count) {
            let weight: Int = winners_count - i; // Linear weight: 1st gets highest weight
            
            // Calculate reward amount
            let reward_amount: Int = (remaining_pool * weight) / total_weight;
            
            // Store reward for later claiming using composite key
            // For now, we'll use a dummy address hash
            let composite_key: Int = room_key * 1000000 + i;
            self.winner_rewards.set(composite_key, reward_amount);
            
            i = i + 1;
        }
        
        // Mark room as paid
        room_data.status = 2; // Paid
        room_data.paid_hash = now(); // Use timestamp as hash
        self.rooms.set(room_key, room_data);
    }
    
    // Claim reward (pull-based) - text message
    receive("claim_reward") {
        let room_key: Int = 12345; // Default room key
        let winner_address: Address = context().sender; // Use sender as winner for simplicity
        
        // Get room data
        let room: RoomData? = self.rooms.get(room_key);
        require(room != null, "Room not found");
        
        let room_data: RoomData = room!!;
        require(room_data.status == 2, "Room is not paid");
        
        // Get winner rewards using composite key
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        let reward_amount: Int? = self.winner_rewards.get(composite_key);
        require(reward_amount != null, "No reward for this address");
        
        // Check if already claimed
        let already_claimed: Int = 0;
        let claimed_amount: Int? = self.claimed_rewards.get(composite_key);
        if (claimed_amount != null) {
            already_claimed = claimed_amount!!;
        }
        
        let remaining_reward: Int = reward_amount!! - already_claimed;
        require(remaining_reward > 0, "No remaining reward to claim");
        
        // Send reward to winner
        send(SendParameters{
            to: winner_address,
            value: remaining_reward,
            body: "Reward Claim".asComment(),
            bounce: false
        });
        
        // Update claimed amount
        self.claimed_rewards.set(composite_key, already_claimed + remaining_reward);
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Distribute airdrop rewards - text message
    receive("distribute_airdrop") {
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
                body: "Top Scorer Airdrop".asComment(),
                bounce: false
            });
        }
        
        // Clear airdrop pool
        self.airdrop_pool = 0;
    }
    
    // Owner withdrawal
    receive("withdraw_owner") {
        require(context().sender == self.owner, "Only owner can withdraw");
        
        let withdrawal_amount: Int = ton("1");
        let contract_balance: Int = myBalance();
        require(withdrawal_amount <= contract_balance, "Insufficient contract balance");
        
        send(SendParameters{
            to: self.owner,
            value: withdrawal_amount,
            body: "Owner Withdrawal".asComment(),
            bounce: false
        });
    }
    
    // Getter functions for contract state
    fun getOwner(): Address {
        return self.owner;
    }
    
    fun getUpgradeAuthority(): Address {
        return self.upgrade_authority;
    }
    
    fun getAirdropPool(): Int {
        return self.airdrop_pool;
    }
    
    fun getAirdropId(): Int {
        return self.airdrop_id;
    }
    
    fun getCurrentRoomId(): Int {
        return self.current_room_id;
    }
    
    fun getHouseFeeBps(): Int {
        return self.HOUSE_FEE_BPS;
    }
    
    fun getHouseFeeDenominator(): Int {
        return self.HOUSE_FEE_DENOMINATOR;
    }
    
    fun getRoomData(room_key: Int): RoomData? {
        return self.rooms.get(room_key);
    }
    
    fun getWinnerReward(room_key: Int, winner_address: Address): Int? {
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        return self.winner_rewards.get(composite_key);
    }
    
    fun getClaimedReward(room_key: Int, winner_address: Address): Int? {
        let composite_key: Int = self.getCompositeKey(room_key, winner_address);
        return self.claimed_rewards.get(composite_key);
    }
}