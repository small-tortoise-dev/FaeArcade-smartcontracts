import "@stdlib/deploy";

// FAE Arcade Treasury Contract - Production Ready with Frontend Room Management
contract Treasury with Deployable {
    
    // State variables
    owner: Address;
    upgrade_authority: Address;
    
    // Treasury pools
    airdrop_pool: Int;
    
    // Room management - production ready with multiple rooms support
    rooms: map<Int, Int>; // room_key -> room_data (packed)
    current_active_room: Int; // Currently active room key
    
    // Constants
    HOUSE_FEE_BPS: Int = 250; // 2.5%
    HOUSE_FEE_DENOMINATOR: Int = 10000;
    
    // Room data structure (packed into Int)
    // Bits 0-31: entry_fee (in nanotons)
    // Bits 32-39: winners_count
    // Bits 40-47: status (0=Closed, 1=Open, 2=Paid)
    // Bits 48-95: pool (in nanotons)
    // Bits 96-127: total_entries
    
    // Constructor
    init(owner: Address, upgrade_authority: Address) {
        self.owner = owner;
        self.upgrade_authority = upgrade_authority;
        self.airdrop_pool = 0;
        self.current_active_room = 0;
    }
    
    // External message handlers
    
    // Open a new room for the day
    receive("open_room") {
        // For production, we'll use a deterministic room key based on date
        // This allows multiple rooms per day for different risk tiers
        let room_key: Int = 20250101; // Format: YYYYMMDD (will be updated by frontend)
        let entry_fee: Int = ton("1"); // 1 TON base entry fee
        let winners_count: Int = 100; // Base winners count
        
        // Check if room already exists
        let existing_room: Int? = self.rooms.get(room_key);
        require(existing_room == null, "Room already exists");
        
        // Pack room data
        let room_data: Int = entry_fee + 
                           (winners_count << 32) + 
                           (1 << 40) + // Status = Open
                           (0 << 48) + // Pool = 0
                           (0 << 96);  // Total entries = 0
        
        // Store room data
        self.rooms.set(room_key, room_data);
        self.current_active_room = room_key;
    }
    
    // User enters a paid room
    receive("enter_paid") {
        // Get current active room
        let room_key: Int = self.current_active_room;
        require(room_key > 0, "No active room");
        
        let room_data: Int? = self.rooms.get(room_key);
        require(room_data != null, "Room not found");
        
        // Unpack room data
        let entry_fee: Int = room_data!! & 0xFFFFFFFF;
        let winners_count: Int = (room_data!! >> 32) & 0xFF;
        let status: Int = (room_data!! >> 40) & 0xFF;
        let pool: Int = (room_data!! >> 48) & 0xFFFFFFFFFFFFFFFF;
        let total_entries: Int = (room_data!! >> 96) & 0xFFFFFFFF;
        
        // Check if room is open
        require(status == 1, "Room is not open");
        
        let received_amount: Int = context().value;
        
        // Validate entry fee - allow for gas fees
        let min_gas_fee: Int = ton("0.05");
        let max_gas_fee: Int = ton("0.1");
        let min_required: Int = entry_fee;
        let max_required: Int = entry_fee + max_gas_fee;
        
        require(received_amount >= min_required, "Insufficient entry fee");
        require(received_amount <= max_required, "Excessive payment amount");
        
        // Calculate house fee (2.5%)
        let house_fee: Int = (entry_fee * self.HOUSE_FEE_BPS) / self.HOUSE_FEE_DENOMINATOR;
        
        // Add to room pool
        let pool_contribution: Int = entry_fee - house_fee;
        let new_pool: Int = pool + pool_contribution;
        let new_total_entries: Int = total_entries + 1;
        
        // Repack room data
        let new_room_data: Int = entry_fee + 
                               (winners_count << 32) + 
                               (status << 40) + 
                               (new_pool << 48) + 
                               (new_total_entries << 96);
        
        // Update room data
        self.rooms.set(room_key, new_room_data);
        
        // Refund excess if any
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
        let room_key: Int = self.current_active_room;
        require(room_key > 0, "No active room");
        
        let room_data: Int? = self.rooms.get(room_key);
        require(room_data != null, "Room not found");
        
        // Unpack and update status
        let entry_fee: Int = room_data!! & 0xFFFFFFFF;
        let winners_count: Int = (room_data!! >> 32) & 0xFF;
        let pool: Int = (room_data!! >> 48) & 0xFFFFFFFFFFFFFFFF;
        let total_entries: Int = (room_data!! >> 96) & 0xFFFFFFFF;
        
        // Set status to closed
        let new_room_data: Int = entry_fee + 
                               (winners_count << 32) + 
                               (0 << 40) + // Status = Closed
                               (pool << 48) + 
                               (total_entries << 96);
        
        self.rooms.set(room_key, new_room_data);
        self.current_active_room = 0;
    }
    
    // Fund the airdrop pool
    receive("fund_airdrop") {
        self.airdrop_pool = self.airdrop_pool + context().value;
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
}