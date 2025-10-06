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
        // Check if room exists and is closed but not paid
        require(self.current_room_status == 0, "Room is not closed");
        require(self.current_room_paid_hash == 0, "Room already paid");
        
        // For now, use placeholder winners - in production this would parse msg body
        let winners_count: Int = 3; // Placeholder
        let expected_winners: Int = self.current_room_winners_count;
        require(winners_count == expected_winners, "Winners count mismatch");
        
        // Placeholder payout logic - in production this would parse winners and weights
        let room_pool: Int = self.current_room_pool;
        let payout_per_winner: Int = room_pool / winners_count;
        
        // Placeholder winner addresses - in production these would come from msg body
        let winner1: Address = address("EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t");
        let winner2: Address = address("EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG");
        let winner3: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        
        // Send payouts to winners
        send(SendParameters{
            to: winner1,
            value: payout_per_winner,
            body: "Payout".asComment()
        });
        send(SendParameters{
            to: winner2,
            value: payout_per_winner,
            body: "Payout".asComment()
        });
        send(SendParameters{
            to: winner3,
            value: payout_per_winner,
            body: "Payout".asComment()
        });
        
        // Mark room as paid
        self.current_room_status = 2; // Paid
        self.current_room_paid_hash = 12345; // Placeholder hash
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        // Anyone can fund the airdrop pool
        self.airdrop_pool = self.airdrop_pool + context().value;
    }
    
    // Payout weekly airdrop
    receive("payout_airdrop") {
        // Placeholder winner counts - in production this would parse msg body
        let top_count: Int = 2;
        let streak_count: Int = 1;
        
        // Split airdrop pool 50/50
        let half_pool: Int = self.airdrop_pool / 2;
        
        // Distribute to top winners
        if (top_count > 0) {
            let top_per_winner: Int = half_pool / top_count;
            let top_winner1: Address = address("EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t");
            let top_winner2: Address = address("EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG");
            
            send(SendParameters{
                to: top_winner1,
                value: top_per_winner,
                body: "Top Winner Payout".asComment()
            });
            send(SendParameters{
                to: top_winner2,
                value: top_per_winner,
                body: "Top Winner Payout".asComment()
            });
        }
        
        // Distribute to streak winners
        if (streak_count > 0) {
            let streak_per_winner: Int = half_pool / streak_count;
            let streak_winner: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        
            send(SendParameters{
                to: streak_winner,
                value: streak_per_winner,
                body: "Streak Winner Payout".asComment()
            });
        }
        
        // Reset airdrop pool
        self.airdrop_pool = 0;
    }
    
    // Upgrade contract code
    receive("upgrade") {
        // Placeholder upgrade logic
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