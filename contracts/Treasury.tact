import "@stdlib/deploy";

// FAE Arcade Treasury Contract - Working Version
contract Treasury with Deployable {
    
    // State variables
    owner: Address;
    upgrade_authority: Address;
    
    // Treasury pools
    airdrop_pool: Int;
    
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
        // For now, use simple parameters - in production this would parse msg body
        let room_key: Int = 12345; // Placeholder - would be room_id + day
        let entry_fee: Int = ton("1"); // 1 TON
        let winners_count: Int = 100; // Low risk tier
        
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
    
    // User enters a paid room
    receive("enter_paid") {
        // Check if room exists and is open
        require(self.current_room_status == 1, "Room is not open");
        
        let entry_fee: Int = self.current_room_entry_fee;
        let received_amount: Int = context().value;
        
        // Validate entry fee - allow for gas fees (minimum entry fee, maximum entry fee + 0.1 TON gas)
        let min_gas_fee: Int = ton("0.05"); // Minimum gas fee
        let max_gas_fee: Int = ton("0.1");  // Maximum gas fee
        let min_required: Int = entry_fee;
        let max_required: Int = entry_fee + max_gas_fee;
        
        require(received_amount >= min_required, "Insufficient entry fee");
        require(received_amount <= max_required, "Excessive payment amount");
        
        // Calculate house fee (2.5%) based on entry fee only
        let house_fee: Int = (entry_fee * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        
        // Add 97.5% to room pool (based on entry fee only)
        let pool_contribution: Int = entry_fee - house_fee;
        self.current_room_pool = self.current_room_pool + pool_contribution;
        self.current_room_total_entries = self.current_room_total_entries + 1;
        
        // If user sent more than entry fee, refund the excess
        let excess_amount: Int = received_amount - entry_fee;
        if (excess_amount > 0) {
            send(SendParameters{
                to: context().sender,
                value: excess_amount,
                body: "Excess refund".asComment(),
                bounce: false
            });
        }
    }
    
    // Close a room
    receive("close_room") {
        // Check if room exists and is open
        require(self.current_room_status == 1, "Room is not open");
        
        // Close room
        self.current_room_status = 0; // Closed
    }
    
    // Payout winners for paid rooms using linear weighted distribution
    receive("payout_paid") {
        // Check if room exists and is closed but not paid
        require(self.current_room_status == 0, "Room is not closed");
        require(self.current_room_paid_hash == 0, "Room already paid");
        
        // For now, use hardcoded winners - in production this would parse msg body
        let winners_count: Int = self.current_room_winners_count;
        
        // Get room pool after 2.5% house fee
        let room_pool: Int = self.current_room_pool;
        
        // Calculate linear weighted distribution
        let total_weight: Int = (winners_count * (winners_count + 1)) / 2; // W = N(N+1)/2
        
        // Process each winner (simplified for now)
        let i: Int = 0;
        while (i < winners_count) {
            // Use hardcoded winner addresses for now
            let winner_address: Address = address("EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t");
            
            // Calculate reward amount
            let rank: Int = i + 1;
            let expected_weight: Int = winners_count - i; // N - i + 1 (since i starts at 0)
            let winner_amount: Int = (room_pool * expected_weight) / total_weight;
            
            // Send payout to winner
            send(SendParameters{
                to: winner_address,
                value: winner_amount,
                body: "Competition Payout".asComment()
            });
            
            // Log payout event (simplified)
            
            i = i + 1;
        }
        
        // Mark room as paid and reset pool
        self.current_room_status = 2; // Paid
        self.current_room_paid_hash = context().value; // Use transaction value as hash
        self.current_room_pool = 0; // Reset pool balance
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        // Anyone can fund the airdrop pool
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Payout weekly airdrop
    receive("payout_airdrop") {
        // Parse message body to get winner counts and addresses
        let slice = context().body.begin_parse();
        
        // Read query_id (8 bytes) - skip for now, could be used for deduplication
        let query_id: Int = slice.load_uint(64);
        
        // Read top_winners_count (1 byte)
        let top_count: Int = slice.load_uint(8);
        
        // Read streak_winners_count (1 byte)
        let streak_count: Int = slice.load_uint(8);
        
        // Validate counts
        require(top_count >= 0 && top_count <= 100, "Invalid top winners count");
        require(streak_count >= 0 && streak_count <= 100, "Invalid streak winners count");
        require(top_count + streak_count > 0, "At least one winner required");
        
        // Validate airdrop pool has sufficient funds
        require(self.airdrop_pool > 0, "Airdrop pool is empty");
        
        // Calculate total amount to distribute
        let total_distributed: Int = 0;
        
        // Distribute to top winners
        if (top_count > 0) {
            let i: Int = 0;
            while (i < top_count) {
                let winner_address: Address = slice.load_address();
                let winner_amount: Int = slice.load_uint(64);
                
                // Validate amount
                require(winner_amount > 0, "Invalid winner amount");
                require(winner_amount <= self.airdrop_pool, "Winner amount exceeds pool");
                
                // Send payout to winner
                send(SendParameters{
                    to: winner_address,
                    value: winner_amount,
                    body: "Top Winner Payout".asComment(),
                    bounce: false
                });
                
                total_distributed = total_distributed + winner_amount;
                i = i + 1;
            }
        }
        
        // Distribute to streak winners
        if (streak_count > 0) {
            let i: Int = 0;
            while (i < streak_count) {
                let winner_address: Address = slice.load_address();
                let winner_amount: Int = slice.load_uint(64);
                
                // Validate amount
                require(winner_amount > 0, "Invalid winner amount");
                require(winner_amount <= self.airdrop_pool, "Winner amount exceeds pool");
            
                // Send payout to winner
                send(SendParameters{
                    to: winner_address,
                    value: winner_amount,
                    body: "Streak Winner Payout".asComment(),
                    bounce: false
                });
                
                total_distributed = total_distributed + winner_amount;
                i = i + 1;
            }
        }
        
        // Validate total distribution doesn't exceed pool
        require(total_distributed <= self.airdrop_pool, "Total distribution exceeds pool");
        
        // Reset airdrop pool
        self.airdrop_pool = 0;
    }
    
    // Owner withdrawal - only owner can withdraw TON
    receive("withdraw_owner") {
        // Only owner can withdraw
        require(context().sender == self.owner, "Only owner can withdraw");
        
        // For now, send to owner - we'll handle target address in the frontend
        let withdrawal_amount: Int = ton("1"); // Default 1 TON
        
        // Check if contract has enough balance
        let contract_balance: Int = myBalance();
        require(withdrawal_amount <= contract_balance, "Insufficient contract balance");
        
        // Send TON to owner (we'll modify this to send to target address)
        send(SendParameters{
            to: self.owner,
            value: withdrawal_amount,
            body: "Owner Withdrawal".asComment(),
            bounce: false
        });
    }
    
    // Upgrade contract code
    receive("upgrade") {
        // Placeholder upgrade logic
    }
    
    // Test message parsing (for development/testing only)
    receive("test_airdrop_parsing") {
        // Parse message body to test parsing logic
        let slice = context().body.begin_parse();
        
        // Read query_id (8 bytes)
        let query_id: Int = slice.load_uint(64);
        
        // Read top_winners_count (1 byte)
        let top_count: Int = slice.load_uint(8);
        
        // Read streak_winners_count (1 byte)
        let streak_count: Int = slice.load_uint(8);
        
        // Log parsing results (in production, this would be handled differently)
        // For now, we'll just validate the parsing worked
        
        // Validate counts
        require(top_count >= 0 && top_count <= 100, "Invalid top winners count");
        require(streak_count >= 0 && streak_count <= 100, "Invalid streak winners count");
        require(top_count + streak_count > 0, "At least one winner required");
        
        // Test reading addresses and amounts
        let total_test_amount: Int = 0;
        
        // Test top winners parsing
        if (top_count > 0) {
            let i: Int = 0;
            while (i < top_count) {
                let winner_address: Address = slice.load_address();
                let winner_amount: Int = slice.load_uint(64);
                total_test_amount = total_test_amount + winner_amount;
                i = i + 1;
            }
        }
        
        // Test streak winners parsing
        if (streak_count > 0) {
            let i: Int = 0;
            while (i < streak_count) {
                let winner_address: Address = slice.load_address();
                let winner_amount: Int = slice.load_uint(64);
                total_test_amount = total_test_amount + winner_amount;
                i = i + 1;
            }
        }
        
        // Send test result back to sender
        send(SendParameters{
            to: context().sender,
            value: ton("0.01"), // Small amount to confirm parsing worked
            body: "Test Parsing Success".asComment(),
            bounce: false
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