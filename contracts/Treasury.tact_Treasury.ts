import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type RoomData = {
    $$type: 'RoomData';
    entry_fee: bigint;
    winners_count: bigint;
    status: bigint;
    pool: bigint;
    total_entries: bigint;
    paid_hash: bigint;
    created_at: bigint;
    closed_at: bigint;
}

export function storeRoomData(src: RoomData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.entry_fee, 257);
        b_0.storeInt(src.winners_count, 257);
        b_0.storeInt(src.status, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.pool, 257);
        b_1.storeInt(src.total_entries, 257);
        b_1.storeInt(src.paid_hash, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.created_at, 257);
        b_2.storeInt(src.closed_at, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadRoomData(slice: Slice) {
    const sc_0 = slice;
    const _entry_fee = sc_0.loadIntBig(257);
    const _winners_count = sc_0.loadIntBig(257);
    const _status = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _pool = sc_1.loadIntBig(257);
    const _total_entries = sc_1.loadIntBig(257);
    const _paid_hash = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _created_at = sc_2.loadIntBig(257);
    const _closed_at = sc_2.loadIntBig(257);
    return { $$type: 'RoomData' as const, entry_fee: _entry_fee, winners_count: _winners_count, status: _status, pool: _pool, total_entries: _total_entries, paid_hash: _paid_hash, created_at: _created_at, closed_at: _closed_at };
}

export function loadTupleRoomData(source: TupleReader) {
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    const _status = source.readBigNumber();
    const _pool = source.readBigNumber();
    const _total_entries = source.readBigNumber();
    const _paid_hash = source.readBigNumber();
    const _created_at = source.readBigNumber();
    const _closed_at = source.readBigNumber();
    return { $$type: 'RoomData' as const, entry_fee: _entry_fee, winners_count: _winners_count, status: _status, pool: _pool, total_entries: _total_entries, paid_hash: _paid_hash, created_at: _created_at, closed_at: _closed_at };
}

export function loadGetterTupleRoomData(source: TupleReader) {
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    const _status = source.readBigNumber();
    const _pool = source.readBigNumber();
    const _total_entries = source.readBigNumber();
    const _paid_hash = source.readBigNumber();
    const _created_at = source.readBigNumber();
    const _closed_at = source.readBigNumber();
    return { $$type: 'RoomData' as const, entry_fee: _entry_fee, winners_count: _winners_count, status: _status, pool: _pool, total_entries: _total_entries, paid_hash: _paid_hash, created_at: _created_at, closed_at: _closed_at };
}

export function storeTupleRoomData(source: RoomData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.entry_fee);
    builder.writeNumber(source.winners_count);
    builder.writeNumber(source.status);
    builder.writeNumber(source.pool);
    builder.writeNumber(source.total_entries);
    builder.writeNumber(source.paid_hash);
    builder.writeNumber(source.created_at);
    builder.writeNumber(source.closed_at);
    return builder.build();
}

export function dictValueParserRoomData(): DictionaryValue<RoomData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoomData(src)).endCell());
        },
        parse: (src) => {
            return loadRoomData(src.loadRef().beginParse());
        }
    }
}

export type OpenRoom = {
    $$type: 'OpenRoom';
    room_key: bigint;
    entry_fee: bigint;
    winners_count: bigint;
}

export function storeOpenRoom(src: OpenRoom) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2616294104, 32);
        b_0.storeUint(src.room_key, 32);
        b_0.storeCoins(src.entry_fee);
        b_0.storeUint(src.winners_count, 8);
    };
}

export function loadOpenRoom(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2616294104) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    const _entry_fee = sc_0.loadCoins();
    const _winners_count = sc_0.loadUintBig(8);
    return { $$type: 'OpenRoom' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function loadTupleOpenRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    return { $$type: 'OpenRoom' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function loadGetterTupleOpenRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    return { $$type: 'OpenRoom' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function storeTupleOpenRoom(source: OpenRoom) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    builder.writeNumber(source.entry_fee);
    builder.writeNumber(source.winners_count);
    return builder.build();
}

export function dictValueParserOpenRoom(): DictionaryValue<OpenRoom> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOpenRoom(src)).endCell());
        },
        parse: (src) => {
            return loadOpenRoom(src.loadRef().beginParse());
        }
    }
}

export type EnterRoom = {
    $$type: 'EnterRoom';
    room_key: bigint;
    entry_fee: bigint;
}

export function storeEnterRoom(src: EnterRoom) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1380690280, 32);
        b_0.storeUint(src.room_key, 32);
        b_0.storeCoins(src.entry_fee);
    };
}

export function loadEnterRoom(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1380690280) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    const _entry_fee = sc_0.loadCoins();
    return { $$type: 'EnterRoom' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function loadTupleEnterRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    return { $$type: 'EnterRoom' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function loadGetterTupleEnterRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    return { $$type: 'EnterRoom' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function storeTupleEnterRoom(source: EnterRoom) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    builder.writeNumber(source.entry_fee);
    return builder.build();
}

export function dictValueParserEnterRoom(): DictionaryValue<EnterRoom> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEnterRoom(src)).endCell());
        },
        parse: (src) => {
            return loadEnterRoom(src.loadRef().beginParse());
        }
    }
}

export type CloseRoom = {
    $$type: 'CloseRoom';
    room_key: bigint;
}

export function storeCloseRoom(src: CloseRoom) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2943936156, 32);
        b_0.storeUint(src.room_key, 32);
    };
}

export function loadCloseRoom(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2943936156) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    return { $$type: 'CloseRoom' as const, room_key: _room_key };
}

export function loadTupleCloseRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'CloseRoom' as const, room_key: _room_key };
}

export function loadGetterTupleCloseRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'CloseRoom' as const, room_key: _room_key };
}

export function storeTupleCloseRoom(source: CloseRoom) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    return builder.build();
}

export function dictValueParserCloseRoom(): DictionaryValue<CloseRoom> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCloseRoom(src)).endCell());
        },
        parse: (src) => {
            return loadCloseRoom(src.loadRef().beginParse());
        }
    }
}

export type DistributePayouts = {
    $$type: 'DistributePayouts';
    room_key: bigint;
    winners_count: bigint;
    winners: Dictionary<bigint, Address>;
}

export function storeDistributePayouts(src: DistributePayouts) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3561099507, 32);
        b_0.storeUint(src.room_key, 32);
        b_0.storeUint(src.winners_count, 8);
        b_0.storeDict(src.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
    };
}

export function loadDistributePayouts(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3561099507) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    const _winners_count = sc_0.loadUintBig(8);
    const _winners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_0);
    return { $$type: 'DistributePayouts' as const, room_key: _room_key, winners_count: _winners_count, winners: _winners };
}

export function loadTupleDistributePayouts(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'DistributePayouts' as const, room_key: _room_key, winners_count: _winners_count, winners: _winners };
}

export function loadGetterTupleDistributePayouts(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'DistributePayouts' as const, room_key: _room_key, winners_count: _winners_count, winners: _winners };
}

export function storeTupleDistributePayouts(source: DistributePayouts) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    builder.writeNumber(source.winners_count);
    builder.writeCell(source.winners.size > 0 ? beginCell().storeDictDirect(source.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    return builder.build();
}

export function dictValueParserDistributePayouts(): DictionaryValue<DistributePayouts> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDistributePayouts(src)).endCell());
        },
        parse: (src) => {
            return loadDistributePayouts(src.loadRef().beginParse());
        }
    }
}

export type ClaimReward = {
    $$type: 'ClaimReward';
    room_key: bigint;
}

export function storeClaimReward(src: ClaimReward) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1385066661, 32);
        b_0.storeUint(src.room_key, 32);
    };
}

export function loadClaimReward(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1385066661) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    return { $$type: 'ClaimReward' as const, room_key: _room_key };
}

export function loadTupleClaimReward(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'ClaimReward' as const, room_key: _room_key };
}

export function loadGetterTupleClaimReward(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'ClaimReward' as const, room_key: _room_key };
}

export function storeTupleClaimReward(source: ClaimReward) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    return builder.build();
}

export function dictValueParserClaimReward(): DictionaryValue<ClaimReward> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimReward(src)).endCell());
        },
        parse: (src) => {
            return loadClaimReward(src.loadRef().beginParse());
        }
    }
}

export type RefundRoom = {
    $$type: 'RefundRoom';
    room_key: bigint;
}

export function storeRefundRoom(src: RefundRoom) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(850355063, 32);
        b_0.storeUint(src.room_key, 32);
    };
}

export function loadRefundRoom(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 850355063) { throw Error('Invalid prefix'); }
    const _room_key = sc_0.loadUintBig(32);
    return { $$type: 'RefundRoom' as const, room_key: _room_key };
}

export function loadTupleRefundRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'RefundRoom' as const, room_key: _room_key };
}

export function loadGetterTupleRefundRoom(source: TupleReader) {
    const _room_key = source.readBigNumber();
    return { $$type: 'RefundRoom' as const, room_key: _room_key };
}

export function storeTupleRefundRoom(source: RefundRoom) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    return builder.build();
}

export function dictValueParserRefundRoom(): DictionaryValue<RefundRoom> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRefundRoom(src)).endCell());
        },
        parse: (src) => {
            return loadRefundRoom(src.loadRef().beginParse());
        }
    }
}

export type Treasury$Data = {
    $$type: 'Treasury$Data';
    owner: Address;
    upgrade_authority: Address;
    airdrop_pool: bigint;
    airdrop_id: bigint;
    rooms: Dictionary<bigint, RoomData>;
    current_room_id: bigint;
    room_entries: Dictionary<bigint, boolean>;
    winner_rewards: Dictionary<Address, bigint>;
    claimed_rewards: Dictionary<Address, bigint>;
    HOUSE_FEE_BPS: bigint;
    HOUSE_FEE_DENOMINATOR: bigint;
    MIN_ENTRY_FEE: bigint;
    MAX_ENTRIES_PER_ROOM: bigint;
}

export function storeTreasury$Data(src: Treasury$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.upgrade_authority);
        b_0.storeInt(src.airdrop_pool, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.airdrop_id, 257);
        b_1.storeDict(src.rooms, Dictionary.Keys.BigInt(257), dictValueParserRoomData());
        b_1.storeInt(src.current_room_id, 257);
        b_1.storeDict(src.room_entries, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool());
        b_1.storeDict(src.winner_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        const b_2 = new Builder();
        b_2.storeDict(src.claimed_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_2.storeInt(src.HOUSE_FEE_BPS, 257);
        b_2.storeInt(src.HOUSE_FEE_DENOMINATOR, 257);
        b_2.storeInt(src.MIN_ENTRY_FEE, 257);
        const b_3 = new Builder();
        b_3.storeInt(src.MAX_ENTRIES_PER_ROOM, 257);
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTreasury$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _upgrade_authority = sc_0.loadAddress();
    const _airdrop_pool = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _airdrop_id = sc_1.loadIntBig(257);
    const _rooms = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), sc_1);
    const _current_room_id = sc_1.loadIntBig(257);
    const _room_entries = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), sc_1);
    const _winner_rewards = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_1);
    const sc_2 = sc_1.loadRef().beginParse();
    const _claimed_rewards = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_2);
    const _HOUSE_FEE_BPS = sc_2.loadIntBig(257);
    const _HOUSE_FEE_DENOMINATOR = sc_2.loadIntBig(257);
    const _MIN_ENTRY_FEE = sc_2.loadIntBig(257);
    const sc_3 = sc_2.loadRef().beginParse();
    const _MAX_ENTRIES_PER_ROOM = sc_3.loadIntBig(257);
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, room_entries: _room_entries, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, MIN_ENTRY_FEE: _MIN_ENTRY_FEE, MAX_ENTRIES_PER_ROOM: _MAX_ENTRIES_PER_ROOM };
}

export function loadTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _room_entries = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    const _MIN_ENTRY_FEE = source.readBigNumber();
    const _MAX_ENTRIES_PER_ROOM = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, room_entries: _room_entries, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, MIN_ENTRY_FEE: _MIN_ENTRY_FEE, MAX_ENTRIES_PER_ROOM: _MAX_ENTRIES_PER_ROOM };
}

export function loadGetterTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _room_entries = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    const _MIN_ENTRY_FEE = source.readBigNumber();
    const _MAX_ENTRIES_PER_ROOM = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, room_entries: _room_entries, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, MIN_ENTRY_FEE: _MIN_ENTRY_FEE, MAX_ENTRIES_PER_ROOM: _MAX_ENTRIES_PER_ROOM };
}

export function storeTupleTreasury$Data(source: Treasury$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.upgrade_authority);
    builder.writeNumber(source.airdrop_pool);
    builder.writeNumber(source.airdrop_id);
    builder.writeCell(source.rooms.size > 0 ? beginCell().storeDictDirect(source.rooms, Dictionary.Keys.BigInt(257), dictValueParserRoomData()).endCell() : null);
    builder.writeNumber(source.current_room_id);
    builder.writeCell(source.room_entries.size > 0 ? beginCell().storeDictDirect(source.room_entries, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.winner_rewards.size > 0 ? beginCell().storeDictDirect(source.winner_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.claimed_rewards.size > 0 ? beginCell().storeDictDirect(source.claimed_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.HOUSE_FEE_BPS);
    builder.writeNumber(source.HOUSE_FEE_DENOMINATOR);
    builder.writeNumber(source.MIN_ENTRY_FEE);
    builder.writeNumber(source.MAX_ENTRIES_PER_ROOM);
    return builder.build();
}

export function dictValueParserTreasury$Data(): DictionaryValue<Treasury$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasury$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTreasury$Data(src.loadRef().beginParse());
        }
    }
}

 type Treasury_init_args = {
    $$type: 'Treasury_init_args';
    owner: Address;
    upgrade_authority: Address;
}

function initTreasury_init_args(src: Treasury_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.upgrade_authority);
    };
}

async function Treasury_init(owner: Address, upgrade_authority: Address) {
    const __code = Cell.fromHex('b5ee9c724102490100137c000262ff008e88f4a413f4bcf2c80bed53208e9c30eda2edfb01d072d721d200d200fa4021103450666f04f86102f862e1ed43d9012a020271021602012003120201200410020120050a020120060801efacb6f6a268690000c720fd207d20408080eb806a00e8408080eb807a02408080eb807a027a026a18687a02408080eb80408080eb80408080eb806a1868408080eb8018085688560855b60ec712fd207d202c816880b6b6b6b6c0807d409388410802faf0804081f4382a1c44244ba2b22801f16d9e3668c00700022101f3acee76a268690000c720fd207d20408080eb806a00e8408080eb807a02408080eb807a027a026a18687a02408080eb80408080eb80408080eb806a1868408080eb8018085688560855b60ec712fd207d202c816880b6b6b6b6c0807d409388410802faf0804081f4382a1c44244ba2b22801f12a8e6d9e3668c00900303181010b27028101014133f40a6fa19401d70030925b6de20202730b0e02f1a387b513434800063907e903e9020404075c035007420404075c03d0120404075c03d013d01350c343d0120404075c020404075c020404075c0350c3420404075c00c042b442b042adb0763897e903e901640b4405b5b5b5b60403ea049c42084017d78402040fa1c150e221225d1591400f8954336cf1b3460c0d00a08101012a0259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2002c206e92306d99206ef2d0806f286f08e2206e92306dde01eda0f3b513434800063907e903e9020404075c035007420404075c03d0120404075c03d013d01350c343d0120404075c020404075c020404075c0350c3420404075c00c042b442b042adb0763897e903e901640b4405b5b5b5b60403ea049c42084017d78402040fa1c150e221225d1591400f8b6cf1b3460f00022201efb73f5da89a1a400031c83f481f481020203ae01a803a1020203ae01e809020203ae01e809e809a861a1e809020203ae01020203ae01020203ae01a861a1020203ae0060215a21582156d83b1c4bf481f480b205a202dadadadb0201f5024e2104200bebc2010207d0e0a87110912e8ac8a007c5b678d9a3011000227020158131401f3b320fb513434800063907e903e9020404075c035007420404075c03d0120404075c03d013d01350c343d0120404075c020404075c020404075c0350c3420404075c00c042b442b042adb0763897e903e901640b4405b5b5b5b60403ea049c42084017d78402040fa1c150e221225d1591400f8954736cf1b34603001efb0b23b513434800063907e903e9020404075c035007420404075c03d0120404075c03d013d01350c343d0120404075c020404075c020404075c0350c3420404075c00c042b442b042adb0763897e903e901640b4405b5b5b5b60403ea049c42084017d78402040fa1c150e221225d1591400f8b6cf1b34601500022a020120171c020120181a01efb5d13da89a1a400031c83f481f481020203ae01a803a1020203ae01e809020203ae01e809e809a861a1e809020203ae01020203ae01020203ae01a861a1020203ae0060215a21582156d83b1c4bf481f480b205a202dadadadb0201f5024e2104200bebc2010207d0e0a87110912e8ac8a007c5b678d9a301900022c01efb7627da89a1a400031c83f481f481020203ae01a803a1020203ae01e809020203ae01e809e809a861a1e809020203ae01020203ae01020203ae01a861a1020203ae0060215a21582156d83b1c4bf481f480b205a202dadadadb0201f5024e2104200bebc2010207d0e0a87110912e8ac8a007c5b678d9a301b0002200201201d1f01f3b58edda89a1a400031c83f481f481020203ae01a803a1020203ae01e809020203ae01e809e809a861a1e809020203ae01020203ae01020203ae01a861a1020203ae0060215a21582156d83b1c4bf481f480b205a202dadadadb0201f5024e2104200bebc2010207d0e0a87110912e8ac8a007c4aa39b678d9a301e0132db3c8101012802714133f40c6fa19401d70030925b6de26eb33002012020280201202126020120222401eea8c7ed44d0d200018e41fa40fa40810101d700d401d0810101d700f404810101d700f404f404d430d0f404810101d700810101d700810101d700d430d0810101d7003010ad10ac10ab6c1d8e25fa40fa405902d1016d6d6d6d8100fa812710821005f5e1008103e870543888489745645003e2db3c6cd12300022301eea889ed44d0d200018e41fa40fa40810101d700d401d0810101d700f404810101d700f404f404d430d0f404810101d700810101d700810101d700d430d0810101d7003010ad10ac10ab6c1d8e25fa40fa405902d1016d6d6d6d8100fa812710821005f5e1008103e870543888489745645003e2db3c6cd12500022901f3ac26f6a268690000c720fd207d20408080eb806a00e8408080eb807a02408080eb807a027a026a18687a02408080eb80408080eb80408080eb806a1868408080eb8018085688560855b60ec712fd207d202c816880b6b6b6b6c0807d409388410802faf0804081f4382a1c44244ba2b22801f12a8e6d9e3668c02700303181010b26028101014133f40a6fa19401d70030925b6de201efb3ce7b513434800063907e903e9020404075c035007420404075c03d0120404075c03d013d01350c343d0120404075c020404075c020404075c0350c3420404075c00c042b442b042adb0763897e903e901640b4405b5b5b5b60403ea049c42084017d78402040fa1c150e221225d1591400f8b6cf1b34602900022b02feed44d0d200018e41fa40fa40810101d700d401d0810101d700f404810101d700f404f404d430d0f404810101d700810101d700810101d700d430d0810101d7003010ad10ac10ab6c1d8e25fa40fa405902d1016d6d6d6d8100fa812710821005f5e1008103e870543888489745645003e20e925f0ee0702dd74920c21fe3002b4204e8310dd31f2182109bf17ad8ba8ec931373c05d31ffa00d307308200ccdff8422ec705f2f48200a3e4532ebef2f482009bd521c200f2f48138aa218103e8bbf2f482009d4a23c200f2f4288101012459f40d6fa192306ddfe0218210524ba968bae302218210af78e69cbae302218210d44210f3ba2c2e343601b8206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2816b0f016ef2f471705300f823210706050443138101015028c82d01b855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc922103901206e953059f45a30944133f415e210ac109b108a1079081067104610354430123c01fe313d0cd31ffa0030288101012359f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e281508a216eb3f2f4206ef2d0806f288116fb26c001f2f4278200e4850aba19f2f4f8420d11140d2f02fc0c11130c0b11120b0a11110a09111009108f107e061114060511130504111204031111030211150201111601561001db3c2781010122714133f40c6fa19401d70030925b6de28168d3016ef2f48200f24d561223b9f2f42ef8416f24135f038200c8975112baf2f45305a825a90466a101111401a01112a4106f0511150530310030f901018260af298d050e4395d69670b12b7f41aa2fa801a001f80411140403111203020111160111178101011111c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc910344ab0206e953059f45a30944133f415e217810101500e7f71216e955b59f45a3098c801cf004133f442e229c20032029e8ebd885445bb7070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009139e2103c4ba9102810574016505503333c001a00000000486f7573652046656501fe313d0cd31f308200d867f8422dc705f2f4278101012259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f28308116fb05c00115f2f470f82310673501ca10571443308101015088c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9103912206e953059f45a30944133f415e210ac109b108a10790810571046103544303c032ee30221821032af6377bae302218210528e70a5bae3020e373a3d01fc313d0cd31fd307f404308200eb6bf8422fc705f2f4298101012459f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f288200c69d06c00016f2f43801fe81416f02c00012f2f48200f4a75385baf2f45327a90470098e64278101012a59f40c6fa192306ddf206eb38e4b206ef2d0802e81010b228101014133f40a6fa19401d70030925b6de270216eb39630206ef2d0809131e281010b5113a00311100312810101216e955b59f4593098c801cf004133f441e20d9130e208a408e43901da30363672f823105614435010278101015028c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9103912206e953059f45a30944133f415e210ac109b108a10790810571046103544303c01fc313d0cd31f30815e06f8422dc705f2f4278101012259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f28308200ddb605c00115f2f4816671223b01dcc200f2f470f823106710571443308101015088c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9103912206e953059f45a30944133f415e210ac109b108a10790810571046103544303c0098c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed54db3101f8313d0cd31f30f84281010154491359f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f2810565f068127e732c002f2f42481010b228101013e03fe4133f40a6fa19401d70030925b6de2811851216eb3f2f4702581010b248101014133f40a6fa19401d70030925b6de2206eb39631206ef2d0809130e201206ef2d08021a18200a88121c200f2f488702454433070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb00013f404100200000000052657761726420436c61696d001a58cf8680cf8480f400f400cf8100f681010b02a0103512810101216e955b59f4593098c801cf004133f441e210ac109b108a107910681057104610355034c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed54db3101bc21c00021c121b08e505b3c10ac5519c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed54e00ef901204303a882f0ae1f55287d6c4d2042cc5941a8a23c971d49bf5e554d4fa78ae730638e083cb7bae30282f07e9a4e9c4db87f8cc634e496e2f129f07172c3894b3498755d7d69745e4ba895bae302c000925f0ee30df2c08244454800cc5b3cf8416f24135f0319a010ac109b0a107910681057104610354430c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed5402f0303c8200e503f8422cc705f2f48200bfb829c200f2f407a408ab00207aa9043120c2008ebdf84288127070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009130e2109b108a700a108910681057104610354430124647002c00000000546f702053636f7265722041697264726f700094c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed5400b00cc21f8e5010ac5519c87f01ca0055c050cdce1ace18810101cf0006c8810101cf0015f40013810101cf00f400f40001c8f40013810101cf0013810101cf0013810101cf0003c8810101cf0013cdcdcdc9ed54db31e05f0d8c5c5c11');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initTreasury_init_args({ $$type: 'Treasury_init_args', owner, upgrade_authority })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Treasury_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    5883: { message: "Room is not open" },
    6225: { message: "No reward for this address" },
    10215: { message: "Room is not paid" },
    14103: { message: "Room not found" },
    14506: { message: "Too many winners" },
    16751: { message: "Room already paid" },
    20618: { message: "Room does not exist" },
    24070: { message: "Only owner can refund rooms" },
    26225: { message: "No entries to refund" },
    26835: { message: "User already entered this room" },
    27407: { message: "Room already exists" },
    39893: { message: "Winners count must be positive" },
    40266: { message: "Room key must be positive" },
    41956: { message: "Entry fee below minimum" },
    43137: { message: "No remaining reward to claim" },
    49080: { message: "No airdrop pool available" },
    50845: { message: "Room is not closed" },
    51351: { message: "Entry fee must be exact amount" },
    52447: { message: "Only owner can create rooms" },
    55399: { message: "Only owner can close rooms" },
    56758: { message: "Room must be open to refund" },
    58501: { message: "Entry fee mismatch" },
    58627: { message: "Only owner can distribute airdrops" },
    60267: { message: "Only owner can distribute payouts" },
    62029: { message: "Room is full" },
    62631: { message: "Winners count mismatch" },
} as const

export const Treasury_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Room is not open": 5883,
    "No reward for this address": 6225,
    "Room is not paid": 10215,
    "Room not found": 14103,
    "Too many winners": 14506,
    "Room already paid": 16751,
    "Room does not exist": 20618,
    "Only owner can refund rooms": 24070,
    "No entries to refund": 26225,
    "User already entered this room": 26835,
    "Room already exists": 27407,
    "Winners count must be positive": 39893,
    "Room key must be positive": 40266,
    "Entry fee below minimum": 41956,
    "No remaining reward to claim": 43137,
    "No airdrop pool available": 49080,
    "Room is not closed": 50845,
    "Entry fee must be exact amount": 51351,
    "Only owner can create rooms": 52447,
    "Only owner can close rooms": 55399,
    "Room must be open to refund": 56758,
    "Entry fee mismatch": 58501,
    "Only owner can distribute airdrops": 58627,
    "Only owner can distribute payouts": 60267,
    "Room is full": 62029,
    "Winners count mismatch": 62631,
} as const

const Treasury_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"RoomData","header":null,"fields":[{"name":"entry_fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winners_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"total_entries","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"paid_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"created_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"closed_at","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"OpenRoom","header":2616294104,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"entry_fee","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"winners_count","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"EnterRoom","header":1380690280,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"entry_fee","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"CloseRoom","header":2943936156,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"DistributePayouts","header":3561099507,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"winners_count","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"winners","type":{"kind":"dict","key":"int","value":"address"}}]},
    {"name":"ClaimReward","header":1385066661,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"RefundRoom","header":850355063,"fields":[{"name":"room_key","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"Treasury$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"upgrade_authority","type":{"kind":"simple","type":"address","optional":false}},{"name":"airdrop_pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"airdrop_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rooms","type":{"kind":"dict","key":"int","value":"RoomData","valueFormat":"ref"}},{"name":"current_room_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"room_entries","type":{"kind":"dict","key":"int","value":"bool"}},{"name":"winner_rewards","type":{"kind":"dict","key":"address","value":"int"}},{"name":"claimed_rewards","type":{"kind":"dict","key":"address","value":"int"}},{"name":"HOUSE_FEE_BPS","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"HOUSE_FEE_DENOMINATOR","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"MIN_ENTRY_FEE","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"MAX_ENTRIES_PER_ROOM","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const Treasury_opcodes = {
    "OpenRoom": 2616294104,
    "EnterRoom": 1380690280,
    "CloseRoom": 2943936156,
    "DistributePayouts": 3561099507,
    "ClaimReward": 1385066661,
    "RefundRoom": 850355063,
}

const Treasury_getters: ABIGetter[] = [
    {"name":"getOwner","methodId":102025,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getUpgradeAuthority","methodId":130873,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getAirdropPool","methodId":94920,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getAirdropId","methodId":124041,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomId","methodId":80378,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getHouseFeeBps","methodId":123079,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getHouseFeeDenominator","methodId":71484,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getRoomData","methodId":71393,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"RoomData","optional":true}},
    {"name":"getWinnerReward","methodId":68060,"arguments":[{"name":"_","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"addr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"getClaimedReward","methodId":125005,"arguments":[{"name":"_","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"addr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"hasUserEntered","methodId":117878,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"user_address","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"computeEntryKey","methodId":93315,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"user_address","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getMinEntryFee","methodId":65901,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getMaxEntriesPerRoom","methodId":113427,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const Treasury_getterMapping: { [key: string]: string } = {
    'getOwner': 'getGetOwner',
    'getUpgradeAuthority': 'getGetUpgradeAuthority',
    'getAirdropPool': 'getGetAirdropPool',
    'getAirdropId': 'getGetAirdropId',
    'getCurrentRoomId': 'getGetCurrentRoomId',
    'getHouseFeeBps': 'getGetHouseFeeBps',
    'getHouseFeeDenominator': 'getGetHouseFeeDenominator',
    'getRoomData': 'getGetRoomData',
    'getWinnerReward': 'getGetWinnerReward',
    'getClaimedReward': 'getGetClaimedReward',
    'hasUserEntered': 'getHasUserEntered',
    'computeEntryKey': 'getComputeEntryKey',
    'getMinEntryFee': 'getGetMinEntryFee',
    'getMaxEntriesPerRoom': 'getGetMaxEntriesPerRoom',
}

const Treasury_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"OpenRoom"}},
    {"receiver":"internal","message":{"kind":"typed","type":"EnterRoom"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CloseRoom"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DistributePayouts"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RefundRoom"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimReward"}},
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"text"}},
    {"receiver":"internal","message":{"kind":"text","text":"fund_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"distribute_airdrop"}},
]


export class Treasury implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = Treasury_errors_backward;
    public static readonly opcodes = Treasury_opcodes;
    
    static async init(owner: Address, upgrade_authority: Address) {
        return await Treasury_init(owner, upgrade_authority);
    }
    
    static async fromInit(owner: Address, upgrade_authority: Address) {
        const __gen_init = await Treasury_init(owner, upgrade_authority);
        const address = contractAddress(0, __gen_init);
        return new Treasury(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Treasury(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Treasury_types,
        getters: Treasury_getters,
        receivers: Treasury_receivers,
        errors: Treasury_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: OpenRoom | EnterRoom | CloseRoom | DistributePayouts | RefundRoom | ClaimReward | null | string | "fund_airdrop" | "distribute_airdrop") {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'OpenRoom') {
            body = beginCell().store(storeOpenRoom(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'EnterRoom') {
            body = beginCell().store(storeEnterRoom(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CloseRoom') {
            body = beginCell().store(storeCloseRoom(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DistributePayouts') {
            body = beginCell().store(storeDistributePayouts(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RefundRoom') {
            body = beginCell().store(storeRefundRoom(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClaimReward') {
            body = beginCell().store(storeClaimReward(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (typeof message === 'string') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "fund_airdrop") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "distribute_airdrop") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getOwner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getGetUpgradeAuthority(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getUpgradeAuthority', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getGetAirdropPool(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getAirdropPool', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetAirdropId(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getAirdropId', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCurrentRoomId(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomId', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetHouseFeeBps(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getHouseFeeBps', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetHouseFeeDenominator(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getHouseFeeDenominator', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetRoomData(provider: ContractProvider, room_key: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        const source = (await provider.get('getRoomData', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleRoomData(result_p) : null;
        return result;
    }
    
    async getGetWinnerReward(provider: ContractProvider, _: bigint, addr: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(_);
        builder.writeAddress(addr);
        const source = (await provider.get('getWinnerReward', builder.build())).stack;
        const result = source.readBigNumberOpt();
        return result;
    }
    
    async getGetClaimedReward(provider: ContractProvider, _: bigint, addr: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(_);
        builder.writeAddress(addr);
        const source = (await provider.get('getClaimedReward', builder.build())).stack;
        const result = source.readBigNumberOpt();
        return result;
    }
    
    async getHasUserEntered(provider: ContractProvider, room_key: bigint, user_address: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        builder.writeAddress(user_address);
        const source = (await provider.get('hasUserEntered', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getComputeEntryKey(provider: ContractProvider, room_key: bigint, user_address: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        builder.writeAddress(user_address);
        const source = (await provider.get('computeEntryKey', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetMinEntryFee(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getMinEntryFee', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetMaxEntriesPerRoom(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getMaxEntriesPerRoom', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}