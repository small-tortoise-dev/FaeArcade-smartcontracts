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
    
    // Validate that weights array follows linear distribution
    // Returns true if weights are valid, false otherwise
    fun validateLinearWeights(weights: slice): bool {
        // This would be implemented to check if weights follow n, n-1, n-2... pattern
        // For now, return true as placeholder
        return true;
    }
} 