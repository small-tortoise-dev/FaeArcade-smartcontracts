import { Address, Cell, contractAddress, StateInit, beginCell, toNano } from '@ton/core';
import { Contract, ContractProvider, Sender, SendMode, MessageRelaxed } from '@ton/ton';
import { TupleItem } from '@ton/core';

export type TreasuryEnhancedConfig = {
    owner: Address;
    upgrade_authority: Address;
};

export function treasuryEnhancedConfigToCell(config: TreasuryEnhancedConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.upgrade_authority)
        .storeUint(0, 64) // airdrop_pool
        .storeUint(0, 32) // airdrop_id
        .storeUint(0, 32) // current_room_key
        .storeUint(0, 64) // current_room_entry_fee
        .storeUint(0, 32) // current_room_winners_count
        .storeUint(0, 8) // current_room_status
        .storeUint(0, 64) // current_room_pool
        .storeUint(0, 32) // current_room_total_entries
        .storeUint(0, 32) // current_room_paid_hash
        .endCell();
}

export const Opcodes = {
    open_room: 0,
    enter_paid: 1,
    close_room: 2,
    payout_paid: 3,
    fund_airdrop: 4,
    distribute_airdrop: 5,
    payout_airdrop: 6,
    upgrade: 7,
};

export class TreasuryEnhanced implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new TreasuryEnhanced(address);
    }

    static createFromConfig(config: TreasuryEnhancedConfig, code: Cell, workchain = 0) {
        const data = treasuryEnhancedConfigToCell(config);
        const init = { code, data };
        return new TreasuryEnhanced(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendOpenRoom(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.open_room, 32)
                .endCell(),
        });
    }

    async sendEnterPaid(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.enter_paid, 32)
                .endCell(),
        });
    }

    async sendCloseRoom(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.close_room, 32)
                .endCell(),
        });
    }

    async sendPayoutPaid(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.payout_paid, 32)
                .endCell(),
        });
    }

    async sendFundAirdrop(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.fund_airdrop, 32)
                .endCell(),
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
            .storeUint(0, 32) // op code for distribute
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

    async sendPayoutAirdrop(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.payout_airdrop, 32)
                .endCell(),
        });
    }

    async sendUpgrade(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.upgrade, 32)
                .endCell(),
        });
    }

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

    async getCurrentRoomEntryFee(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getCurrentRoomEntryFee', []);
        return result.stack.readBigNumber();
    }

    async getCurrentRoomWinnersCount(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getCurrentRoomWinnersCount', []);
        return result.stack.readNumber();
    }

    async getCurrentRoomStatus(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getCurrentRoomStatus', []);
        return result.stack.readNumber();
    }

    async getCurrentRoomPool(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('getCurrentRoomPool', []);
        return result.stack.readBigNumber();
    }

    async getCurrentRoomTotalEntries(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getCurrentRoomTotalEntries', []);
        return result.stack.readNumber();
    }

    async getHouseFeeBps(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getHouseFeeBps', []);
        return result.stack.readNumber();
    }

    async getTreasuryState(provider: ContractProvider) {
        const [
            owner,
            upgradeAuthority,
            airdropPool,
            airdropId,
            currentRoomEntryFee,
            currentRoomWinnersCount,
            currentRoomStatus,
            currentRoomPool,
            currentRoomTotalEntries,
            houseFeeBps
        ] = await Promise.all([
            this.getOwner(provider),
            this.getUpgradeAuthority(provider),
            this.getAirdropPool(provider),
            this.getAirdropId(provider),
            this.getCurrentRoomEntryFee(provider),
            this.getCurrentRoomWinnersCount(provider),
            this.getCurrentRoomStatus(provider),
            this.getCurrentRoomPool(provider),
            this.getCurrentRoomTotalEntries(provider),
            this.getHouseFeeBps(provider),
        ]);

        return {
            owner: owner.toString(),
            upgradeAuthority: upgradeAuthority.toString(),
            airdropPool: airdropPool.toString(),
            airdropId,
            currentRoom: {
                entryFee: currentRoomEntryFee.toString(),
                winnersCount: currentRoomWinnersCount,
                status: currentRoomStatus,
                pool: currentRoomPool.toString(),
                totalEntries: currentRoomTotalEntries,
            },
            houseFeeBps,
        };
    }
}
