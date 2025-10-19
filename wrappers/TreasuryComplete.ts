import { Address, Cell, contractAddress, StateInit, beginCell, toNano } from '@ton/core';
import { Contract, ContractProvider, Sender, SendMode } from '@ton/ton';

export type TreasuryCompleteConfig = {
    owner: Address;
    upgrade_authority: Address;
};

export interface RoomData {
    entryFee: bigint;
    winnersCount: number;
    status: number; // 0=Closed, 1=Open, 2=Paid
    pool: bigint;
    totalEntries: number;
    paidHash: number;
    createdAt: number;
    closedAt: number;
}

export const Opcodes = {
    open_room: 0,
    enter_paid: 1,
    close_room: 2,
    distribute_payouts: 3,
    claim_reward: 4,
    fund_airdrop: 5,
    distribute_airdrop: 6,
    upgrade: 7,
};

export const EventOpcodes = {
    ROOM_OPENED: 0x12345678,
    ROOM_CLOSED: 0x12345679,
    PAYOUT_DISTRIBUTED: 0x1234567A,
    AIRDROP_DISTRIBUTED: 0x1234567B,
    REWARD_CLAIMED: 0x1234567C,
};

export function treasuryCompleteConfigToCell(config: TreasuryCompleteConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.upgradeAuthority)
        .storeUint(0, 64) // airdrop_pool
        .storeUint(0, 32) // airdrop_id
        .storeUint(0, 32) // current_room_id
        .endCell();
}

export class TreasuryComplete implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new TreasuryComplete(address);
    }

    static createFromConfig(config: TreasuryCompleteConfig, code: Cell, workchain = 0) {
        const data = treasuryCompleteConfigToCell(config);
        const init = { code, data };
        return new TreasuryComplete(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendOpenRoom(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        roomKey: number,
        entryFee: bigint,
        winnersCount: number
    ) {
        const body = beginCell()
            .storeUint(Opcodes.open_room, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .storeCoins(entryFee)
            .storeUint(winnersCount, 8)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async sendEnterPaid(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        roomKey: number
    ) {
        const body = beginCell()
            .storeUint(Opcodes.enter_paid, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async sendCloseRoom(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        roomKey: number
    ) {
        const body = beginCell()
            .storeUint(Opcodes.close_room, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async sendDistributePayouts(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        roomKey: number,
        winners: Array<{ address: Address; weight: number }>
    ) {
        const body = beginCell()
            .storeUint(Opcodes.distribute_payouts, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .storeUint(winners.length, 8);

        // Add winner addresses
        for (const winner of winners) {
            body.storeAddress(winner.address);
        }

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body.endCell(),
        });
    }

    async sendClaimReward(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        roomKey: number,
        winnerAddress: Address
    ) {
        const body = beginCell()
            .storeUint(Opcodes.claim_reward, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .storeAddress(winnerAddress)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async sendFundAirdrop(provider: ContractProvider, via: Sender, value: bigint) {
        const body = beginCell()
            .storeUint(Opcodes.fund_airdrop, 32)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async sendDistributeAirdrop(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        airdropId: number,
        topScorerWinners: Address[],
        streakWinners: Address[]
    ) {
        const body = beginCell()
            .storeUint(Opcodes.distribute_airdrop, 32)
            .storeUint(0, 32) // op code
            .storeUint(airdropId, 32)
            .storeUint(topScorerWinners.length, 8)
            .storeUint(streakWinners.length, 8);

        // Add top scorer addresses
        for (const address of topScorerWinners) {
            body.storeAddress(address);
        }

        // Add streak winner addresses
        for (const address of streakWinners) {
            body.storeAddress(address);
        }

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body.endCell(),
        });
    }

    async sendUpgrade(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        newCode: Cell
    ) {
        const body = beginCell()
            .storeUint(Opcodes.upgrade, 32)
            .storeUint(0, 32) // op code
            .storeRef(newCode)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    // Getter methods
    async getOwner(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('getOwner', []);
        return result.stack.readAddress();
    }

    async getUpgradeAuthority(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('getUpgradeAuthority', []);
        return result.stack.readAddress();
    }

    async getAirdropPool(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getAirdropPool', []);
        return result.stack.readBigNumber();
    }

    async getAirdropId(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getAirdropId', []);
        return result.stack.readNumber();
    }

    async getCurrentRoomId(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getCurrentRoomId', []);
        return result.stack.readNumber();
    }

    async getRoomData(provider: ContractProvider, roomKey: number): Promise<RoomData | null> {
        try {
            const result = await provider.get('getRoomData', [{ type: 'int', value: BigInt(roomKey) }]);
            const stack = result.stack;
            
            if (stack.remaining === 0) {
                return null;
            }

            return {
                entryFee: stack.readBigNumber(),
                winnersCount: stack.readNumber(),
                status: stack.readNumber(),
                pool: stack.readBigNumber(),
                totalEntries: stack.readNumber(),
                paidHash: stack.readNumber(),
                createdAt: stack.readNumber(),
                closedAt: stack.readNumber(),
            };
        } catch (error) {
            return null;
        }
    }

    async getWinnerReward(
        provider: ContractProvider,
        roomKey: number,
        winnerAddress: Address
    ): Promise<bigint> {
        const result = await provider.get('getWinnerReward', [
            { type: 'int', value: BigInt(roomKey) },
            { type: 'slice', cell: beginCell().storeAddress(winnerAddress).endCell() }
        ]);
        return result.stack.readBigNumber();
    }

    async getClaimedReward(
        provider: ContractProvider,
        roomKey: number,
        winnerAddress: Address
    ): Promise<bigint> {
        const result = await provider.get('getClaimedReward', [
            { type: 'int', value: BigInt(roomKey) },
            { type: 'slice', cell: beginCell().storeAddress(winnerAddress).endCell() }
        ]);
        return result.stack.readBigNumber();
    }

    async getHouseFeeBps(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getHouseFeeBps', []);
        return result.stack.readNumber();
    }

    async getHouseFeeDenominator(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getHouseFeeDenominator', []);
        return result.stack.readNumber();
    }

    async getTreasuryState(provider: ContractProvider) {
        const [
            owner,
            upgradeAuthority,
            airdropPool,
            airdropId,
            currentRoomId,
            houseFeeBps,
            houseFeeDenominator
        ] = await Promise.all([
            this.getOwner(provider),
            this.getUpgradeAuthority(provider),
            this.getAirdropPool(provider),
            this.getAirdropId(provider),
            this.getCurrentRoomId(provider),
            this.getHouseFeeBps(provider),
            this.getHouseFeeDenominator(provider),
        ]);

        return {
            owner: owner.toString(),
            upgradeAuthority: upgradeAuthority.toString(),
            airdropPool: airdropPool.toString(),
            airdropId,
            currentRoomId,
            houseFeeBps,
            houseFeeDenominator,
        };
    }

    // Utility methods for frontend integration
    static createOpenRoomMessage(roomKey: number, entryFee: bigint, winnersCount: number): Cell {
        return beginCell()
            .storeUint(Opcodes.open_room, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .storeCoins(entryFee)
            .storeUint(winnersCount, 8)
            .endCell();
    }

    static createEnterPaidMessage(roomKey: number): Cell {
        return beginCell()
            .storeUint(Opcodes.enter_paid, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .endCell();
    }

    static createClaimRewardMessage(roomKey: number, winnerAddress: Address): Cell {
        return beginCell()
            .storeUint(Opcodes.claim_reward, 32)
            .storeUint(0, 32) // op code
            .storeUint(roomKey, 32)
            .storeAddress(winnerAddress)
            .endCell();
    }
}
