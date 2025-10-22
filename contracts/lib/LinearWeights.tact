import "@stdlib/deploy";

// Linear Weights Library - Helper functions for weighted payouts
contract LinearWeights {
    
    init() {
        // Library contract initialization
    }
    
    // Calculate total weight for n participants using formula: n(n+1)/2
    // This implements linear weighted distribution where 1st place gets n points, 2nd gets n-1, etc.
    fun totalWeight(n: int): int {
        return (n * (n + 1)) / 2;
    }
    
    // Calculate weight for a specific position (1-based indexing)
    // 1st place gets n points, 2nd gets n-1, etc.
    fun positionWeight(position: int, total_participants: int): int {
        require(position > 0, "Position must be positive");
        require(position <= total_participants, "Position exceeds total participants");
        return total_participants - position + 1;
    }
    
    // Calculate payout for a specific position given total pool and participants
    // Returns the amount in coins
    fun calculatePayout(position: int, total_participants: int, pool_amount: coins): coins {
        let weight: int = positionWeight(position, total_participants);
        let total_weight: int = totalWeight(total_participants);
        
        // Calculate proportional payout: (weight / total_weight) * pool_amount
        let proportional: int = (weight * pool_amount) / total_weight;
        return proportional;
    }
    
    // Calculate all payouts for a competition using linear weighted distribution
    // Returns array of payouts for each position
    fun calculateAllPayouts(total_participants: int, pool_amount: coins): (int, int, int, int, int, int, int, int, int, int) {
        let total_weight: int = totalWeight(total_participants);
        let payout1: int = 0;
        let payout2: int = 0;
        let payout3: int = 0;
        let payout4: int = 0;
        let payout5: int = 0;
        let payout6: int = 0;
        let payout7: int = 0;
        let payout8: int = 0;
        let payout9: int = 0;
        let payout10: int = 0;
        
        // Calculate first 10 positions (can be extended)
        if (total_participants >= 1) {
            payout1 = (total_participants * pool_amount) / total_weight;
        }
        if (total_participants >= 2) {
            payout2 = ((total_participants - 1) * pool_amount) / total_weight;
        }
        if (total_participants >= 3) {
            payout3 = ((total_participants - 2) * pool_amount) / total_weight;
        }
        if (total_participants >= 4) {
            payout4 = ((total_participants - 3) * pool_amount) / total_weight;
        }
        if (total_participants >= 5) {
            payout5 = ((total_participants - 4) * pool_amount) / total_weight;
        }
        if (total_participants >= 6) {
            payout6 = ((total_participants - 5) * pool_amount) / total_weight;
        }
        if (total_participants >= 7) {
            payout7 = ((total_participants - 6) * pool_amount) / total_weight;
        }
        if (total_participants >= 8) {
            payout8 = ((total_participants - 7) * pool_amount) / total_weight;
        }
        if (total_participants >= 9) {
            payout9 = ((total_participants - 8) * pool_amount) / total_weight;
        }
        if (total_participants >= 10) {
            payout10 = ((total_participants - 9) * pool_amount) / total_weight;
        }
        
        return (payout1, payout2, payout3, payout4, payout5, payout6, payout7, payout8, payout9, payout10);
    }
    
    // Validate that weights array follows linear distribution
    // Returns true if weights are valid, false otherwise
    fun validateLinearWeights(weights: slice): bool {
        // This would be implemented to check if weights follow n, n-1, n-2... pattern
        // For now, return true as placeholder
        return true;
    }
} 