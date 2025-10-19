import "@stdlib/deploy";

// Enhanced FAE Arcade Treasury Contract with Dynamic Airdrop Support
contract TreasuryEnhanced with Deployable {
    
    // State variables
    owner: Address;
    upgrade_authority: Address;
    
    // Treasury pools
    airdrop_pool: Int;
    airdrop_id: Int; // Track current airdrop ID
    
    // Room management - simplified for now
    current_room_key: Int;
    current_room_entry_fee: Int;
    current_room_winners_count: Int;
    current_room_status: Int; // 0=Closed, 1=Open, 2=Paid
    current_room_pool: Int;
    current_room_total_entries: Int;
    current_room_paid_hash: Int;
    
    // Constants
    HOUSE_FEE_BPS: Int = 250; // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;
    
    // Constructor
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.airdrop_id = 0;
        self.current_room_key = 0;
        self.current_room_entry_fee = 0;
        self.current_room_winners_count = 0;
        self.current_room_status = 0; // Closed
        self.current_room_pool = 0;
        self.current_room_total_entries = 0;
        self.current_room_paid_hash = 0;
    }
    
    // External message handlers
    
    // Open a new room for the day
    receive("open_room") {
        // Parse message body for dynamic parameters
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            // Parse room parameters from message body
            let room_key: Int = slice.load_uint(32);
            let entry_fee: Int = slice.load_coins();
            let winners_count: Int = slice.load_uint(8);
            
            // Validate parameters
            require(entry_fee > 0, "Entry fee must be positive");
            require(winners_count > 0, "Winners count must be positive");
            require(winners_count <= 1000, "Too many winners");
            
            // Check if room already exists
            require(self.current_room_status == 0, "Room already exists");
            
            // Create room state
            self.current_room_key = room_key;
            self.current_room_entry_fee = entry_fee;
            self.current_room_winners_count = winners_count;
            self.current_room_status = 1; // Open
            self.current_room_pool = 0;
            self.current_room_total_entries = 0;
            self.current_room_paid_hash = 0;
        }
    }
    
    // User enters a paid room
    receive("enter_paid") {
        // Check if room exists and is open
        require(self.current_room_status == 1, "Room is not open");
        
        let entry_fee: Int = self.current_room_entry_fee;
        
        // Validate entry fee using context().value
        require(context().value == entry_fee, "Incorrect entry fee");
        
        // Calculate house fee (2.5%)
        let house_fee: Int = (context().value * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        
        // Add 97.5% to room pool
        let pool_contribution: Int = context().value - house_fee;
        self.current_room_pool = self.current_room_pool + pool_contribution;
        self.current_room_total_entries = self.current_room_total_entries + 1;
    }
    
    // Close a room
    receive("close_room") {
        // Check if room exists and is open
        require(self.current_room_status == 1, "Room is not open");
        
        // Close room
        self.current_room_status = 0; // Closed
    }
    
    // Payout winners for paid rooms
    receive("payout_paid") {
        // Parse message body for winner data
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            // Check if room exists and is closed but not paid
            require(self.current_room_status == 0, "Room is not closed");
            require(self.current_room_paid_hash == 0, "Room already paid");
            
            // Parse winners count and validate
            let winners_count: Int = slice.load_uint(8);
            let expected_winners: Int = self.current_room_winners_count;
            require(winners_count == expected_winners, "Winners count mismatch");
            
            // Calculate linear weights
            let total_weight: Int = (winners_count * (winners_count + 1)) / 2;
            let room_pool: Int = self.current_room_pool;
            
            // Parse winners and distribute rewards
            let i: Int = 0;
            while (i < winners_count) {
                let winner_address: Address = slice.load_address();
                let weight: Int = winners_count - i; // Linear weight: 1st gets highest weight
                
                // Calculate reward amount
                let reward_amount: Int = (room_pool * weight) / total_weight;
                
                // Send payout to winner
                send(SendParameters{
                    to: winner_address,
                    value: reward_amount,
                    body: "Payout".asComment()
                });
                
                i = i + 1;
            }
            
            // Mark room as paid
            self.current_room_status = 2; // Paid
            self.current_room_paid_hash = now(); // Use timestamp as hash
        }
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        // Anyone can fund the airdrop pool
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Enhanced airdrop payout with dynamic winner data
    receive("distribute_airdrop") {
        // Parse message body to get airdrop data
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32); // Operation code
        
        if (op == 0) {
            // Parse airdrop data from message body
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
        }
    }
    
    // Legacy payout_airdrop for backward compatibility
    receive("payout_airdrop") {
        // Parse message body for airdrop data
        let slice = context().body.begin_parse();
        let op: Int = slice.preload_uint(32);
        
        if (op == 0) {
            // Parse airdrop data from message body
            let top_count: Int = slice.load_uint(8);
            let streak_count: Int = slice.load_uint(8);
            
            // Validate we have enough in the pool
            require(self.airdrop_pool > 0, "No airdrop pool available");
            
            // Increment airdrop ID
            self.airdrop_id = self.airdrop_id + 1;
            
            // Split airdrop pool 50/50
            let half_pool: Int = self.airdrop_pool / 2;
            
            // Calculate amounts per winner
            let top_per_winner: Int = 0;
            let streak_per_winner: Int = 0;
            
            if (top_count > 0) {
                top_per_winner = half_pool / top_count;
            }
            
            if (streak_count > 0) {
                streak_per_winner = half_pool / streak_count;
            }
            
            // Parse and send to top scorer winners
            let i: Int = 0;
            while (i < top_count) {
                let winner_address: Address = slice.load_address();
                if (top_per_winner > 0) {
                    send(SendParameters{
                        to: winner_address,
                        value: top_per_winner,
                        body: "Top Winner Payout".asComment()
                    });
                }
                i = i + 1;
            }
            
            // Parse and send to streak winners
            i = 0;
            while (i < streak_count) {
                let winner_address: Address = slice.load_address();
                if (streak_per_winner > 0) {
                    send(SendParameters{
                        to: winner_address,
                        value: streak_per_winner,
                        body: "Streak Winner Payout".asComment()
                    });
                }
                i = i + 1;
            }
            
            // Reset airdrop pool
            self.airdrop_pool = 0;
        }
    }
    
    // Upgrade contract code
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
    
    get fun getCurrentRoomEntryFee(): Int {
        return self.current_room_entry_fee;
    }
    
    get fun getCurrentRoomWinnersCount(): Int {
        return self.current_room_winners_count;
    }
    
    get fun getCurrentRoomStatus(): Int {
        return self.current_room_status;
    }
    
    get fun getCurrentRoomPool(): Int {
        return self.current_room_pool;
    }
    
    get fun getCurrentRoomTotalEntries(): Int {
        return self.current_room_total_entries;
    }
    
    get fun getHouseFeeBps(): Int {
        return self.HOUSE_FEE_BPS;
    }
}