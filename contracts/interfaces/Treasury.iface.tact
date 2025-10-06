import "@stdlib/deploy";

// Treasury Interface - External messages and events
// Note: Interface syntax may need to be updated for current Tact version
// For now, commenting out to allow compilation
/*
interface Treasury {
    
    // External messages (signatures only)
    
    // Open a new room for the day
    // admin only
    fun open_room(room_id: uint256, day: uint32, entry_fee: coins, tier: int);
    
    // User enters a paid room
    // payable by user
    fun enter_paid(room_id: uint256, day: uint32);
    
    // Close a room (stop accepting entries)
    // admin only
    fun close_room(room_id: uint256, day: uint32);
    
    // Payout winners for paid rooms
    // admin/bot only
    fun payout_paid(room_id: uint256, day: uint32, winners: slice, weights: slice);
    
    // Fund the airdrop pool
    // payable
    fun fund_airdrop();
    
    // Payout weekly airdrop
    // admin/bot only
    fun payout_airdrop(top: slice, streak: slice);
    
    // Upgrade contract code
    // upgrade authority only
    fun upgrade(new_code: cell);
}

// Events
event EntryReceived {
    room_id: uint256,
    day: uint32,
    user: Address,
    entry_fee: coins,
    tier: int
}

event PaidPayoutDone {
    room_id: uint256,
    day: uint32,
    winners_count: int,
    total_payout: coins,
    house_fee: coins
}

event AirdropPayoutDone {
    top_winners_count: int,
    streak_winners_count: int,
    top_payout: coins,
    streak_payout: coins
}
*/ 