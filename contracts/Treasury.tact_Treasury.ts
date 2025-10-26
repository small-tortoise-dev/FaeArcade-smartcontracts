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

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
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

export type OpenRoomMessage = {
    $$type: 'OpenRoomMessage';
    room_key: bigint;
    entry_fee: bigint;
    winners_count: bigint;
}

export function storeOpenRoomMessage(src: OpenRoomMessage) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.room_key, 257);
        b_0.storeInt(src.entry_fee, 257);
        b_0.storeInt(src.winners_count, 257);
    };
}

export function loadOpenRoomMessage(slice: Slice) {
    const sc_0 = slice;
    const _room_key = sc_0.loadIntBig(257);
    const _entry_fee = sc_0.loadIntBig(257);
    const _winners_count = sc_0.loadIntBig(257);
    return { $$type: 'OpenRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function loadTupleOpenRoomMessage(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    return { $$type: 'OpenRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function loadGetterTupleOpenRoomMessage(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    const _winners_count = source.readBigNumber();
    return { $$type: 'OpenRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee, winners_count: _winners_count };
}

export function storeTupleOpenRoomMessage(source: OpenRoomMessage) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    builder.writeNumber(source.entry_fee);
    builder.writeNumber(source.winners_count);
    return builder.build();
}

export function dictValueParserOpenRoomMessage(): DictionaryValue<OpenRoomMessage> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOpenRoomMessage(src)).endCell());
        },
        parse: (src) => {
            return loadOpenRoomMessage(src.loadRef().beginParse());
        }
    }
}

export type EnterRoomMessage = {
    $$type: 'EnterRoomMessage';
    room_key: bigint;
    entry_fee: bigint;
}

export function storeEnterRoomMessage(src: EnterRoomMessage) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.room_key, 257);
        b_0.storeInt(src.entry_fee, 257);
    };
}

export function loadEnterRoomMessage(slice: Slice) {
    const sc_0 = slice;
    const _room_key = sc_0.loadIntBig(257);
    const _entry_fee = sc_0.loadIntBig(257);
    return { $$type: 'EnterRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function loadTupleEnterRoomMessage(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    return { $$type: 'EnterRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function loadGetterTupleEnterRoomMessage(source: TupleReader) {
    const _room_key = source.readBigNumber();
    const _entry_fee = source.readBigNumber();
    return { $$type: 'EnterRoomMessage' as const, room_key: _room_key, entry_fee: _entry_fee };
}

export function storeTupleEnterRoomMessage(source: EnterRoomMessage) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.room_key);
    builder.writeNumber(source.entry_fee);
    return builder.build();
}

export function dictValueParserEnterRoomMessage(): DictionaryValue<EnterRoomMessage> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEnterRoomMessage(src)).endCell());
        },
        parse: (src) => {
            return loadEnterRoomMessage(src.loadRef().beginParse());
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
    winner_rewards: Dictionary<Address, bigint>;
    claimed_rewards: Dictionary<Address, bigint>;
    HOUSE_FEE_BPS: bigint;
    HOUSE_FEE_DENOMINATOR: bigint;
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
        b_1.storeDict(src.winner_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_1.storeDict(src.claimed_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_1.storeInt(src.HOUSE_FEE_BPS, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.HOUSE_FEE_DENOMINATOR, 257);
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
    const _winner_rewards = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_1);
    const _claimed_rewards = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_1);
    const _HOUSE_FEE_BPS = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _HOUSE_FEE_DENOMINATOR = sc_2.loadIntBig(257);
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function loadTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function loadGetterTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function storeTupleTreasury$Data(source: Treasury$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.upgrade_authority);
    builder.writeNumber(source.airdrop_pool);
    builder.writeNumber(source.airdrop_id);
    builder.writeCell(source.rooms.size > 0 ? beginCell().storeDictDirect(source.rooms, Dictionary.Keys.BigInt(257), dictValueParserRoomData()).endCell() : null);
    builder.writeNumber(source.current_room_id);
    builder.writeCell(source.winner_rewards.size > 0 ? beginCell().storeDictDirect(source.winner_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.claimed_rewards.size > 0 ? beginCell().storeDictDirect(source.claimed_rewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.HOUSE_FEE_BPS);
    builder.writeNumber(source.HOUSE_FEE_DENOMINATOR);
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
    const __code = Cell.fromHex('b5ee9c7241021b0100097e000110ff0020e303f2c80b0101f830eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e32fa40fa40810101d700d401d0810101d700f404810101d700f404f404810101d700d430d0810101d70030107a107910786c1a8e19fa40fa405902d1016d6d6d8100fa8127107054355545645003e20b925f0be029d749c21f0204c28e8e09d31f018210946a98b6bae30209de09f9012082f0f7f7c1c7a35dbbe41cbb35aa7d13ae03739219b763f8529bf693dc57abfdbec3bae3022082f023918e6c7fc5497b05e31986ff583a99314910879bd1ccfe3a465e83c3aa8628bae302200304070b00fed33f30c8018210aff90f5758cb1fcb3fc9108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca005590509ace17ce15810101cf0003c8810101cf0012f400810101cf0012f40012f40012810101cf0002c8810101cf0012cdcdc9ed54db3102aa30f8416f246c31108a107910681057104610354430128010db3c3504d31ffa00d307308109bd22c200f2f482009bd521c200f2f48138aa218103e8bbf2f482009d4a23c200f2f4278101012459f40d6fa192306ddf120501b8206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2816b0f016ef2f471705300f823210706050443138101015028c806019855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc922103801206e953059f45a30944133f415e205041a02fc30f8416f246c31108a107910681057104610354430128011db3cd31ffa0030278101012359f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e281508a216eb3f2f4206ef2d0806f28120801ec8116fb26c001f2f4278200e4850aba19f2f426f8416f24135f038200c8975112baf2f4530ba82ba90466a115a003a4106710571047028101015029c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc919130902a6206e953059f45a30944133f415e226c2008ebd88544b887070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009136e20a1a001a00000000486f7573652046656504e482f078f481cc938c19046a2dbeed444b8cf7b65aa38154efdaef2a7d5dd15d2dab6cbae3022082f03eefb0952b6918ad8b478603bade6f3639a4230c05b7f2e2282ffa77fede55e5bae3022082f098e91200d96b01eb7c70c724a4d16a71e36dd0752ec2220accce37d2ea4be77cbae302200c0e111602fa30f8416f246c31108a107910681057104610354430128011db3cd31f30268101012259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f2830120d01c68116fb05c00115f2f470f823106710571443308101015088c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9103812206e953059f45a30944133f415e2051a02fa30f8416f246c31108a107910681057104610354430128018db3cd31fd307288101012459f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f28120f01e08200c69d06c00016f2f481416f02c00012f2f48200f4a75385baf2f427a45280a8ab00237093530ab98e3009fa4053baa15230a824a9040211110281010b02111201810101216e955b59f4593098c801cf004133f441e209a4109fe85f03363672f823105614435010278101015028c810019455705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9103812206e953059f45a30944133f415e2051a02fe30f8416f246c31108a107910681057104610354430128013db3cd31ffa403081010154481359f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f2812130016018020d72101a4aa02d72102fc10565f068127e732c002f2f42481010b228101014133f40a6fa19401d70030925b6de2811851216eb3f2f4702581010b248101014133f40a6fa19401d70030925b6de2206eb39631206ef2d0809130e201206ef2d08021a18200a88121c200f2f488702454433070046d03046d5023c8cf8580ca00cf8440ce01fa028069141500200000000052657761726420436c61696d00f4cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000181010b02a0103512810101216e955b59f4593098c801cf004133f441e202c87f01ca005590509ace17ce15810101cf0003c8810101cf0012f400810101cf0012f40012f40012810101cf0002c8810101cf0012cdcdc9ed5401ec82f0ae1f55287d6c4d2042cc5941a8a23c971d49bf5e554d4fa78ae730638e083cb7ba8e5030f8416f24135f0316a0107910680710461035443012c87f01ca005590509ace17ce15810101cf0003c8810101cf0012f400810101cf0012f40012f40012810101cf0002c8810101cf0012cdcdc9ed54e017015482f07e9a4e9c4db87f8cc634e496e2f129f07172c3894b3498755d7d69745e4ba895bae3025f0af2c0821802cc7a8200bfb827c200f2f405a406ab005206a9043524c2008ebef8428841607070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009134e2106810577007105610354430191a002c00000000546f702053636f7265722041697264726f700074c87f01ca005590509ace17ce15810101cf0003c8810101cf0012f400810101cf0012f40012f40012810101cf0002c8810101cf0012cdcdc9ed5471b762ba');
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
    2493: { message: "Entry fee must be positive" },
    5883: { message: "Room is not open" },
    6225: { message: "No reward for this address" },
    10215: { message: "Room is not paid" },
    14103: { message: "Room not found" },
    14506: { message: "Too many winners" },
    16751: { message: "Room already paid" },
    20618: { message: "Room does not exist" },
    27407: { message: "Room already exists" },
    39893: { message: "Winners count must be positive" },
    40266: { message: "Room key must be positive" },
    43137: { message: "No remaining reward to claim" },
    49080: { message: "No airdrop pool available" },
    50845: { message: "Room is not closed" },
    51351: { message: "Entry fee must be exact amount" },
    58501: { message: "Entry fee mismatch" },
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
    "Entry fee must be positive": 2493,
    "Room is not open": 5883,
    "No reward for this address": 6225,
    "Room is not paid": 10215,
    "Room not found": 14103,
    "Too many winners": 14506,
    "Room already paid": 16751,
    "Room does not exist": 20618,
    "Room already exists": 27407,
    "Winners count must be positive": 39893,
    "Room key must be positive": 40266,
    "No remaining reward to claim": 43137,
    "No airdrop pool available": 49080,
    "Room is not closed": 50845,
    "Entry fee must be exact amount": 51351,
    "Entry fee mismatch": 58501,
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
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoomData","header":null,"fields":[{"name":"entry_fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winners_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"total_entries","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"paid_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"created_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"closed_at","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"OpenRoomMessage","header":null,"fields":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"entry_fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winners_count","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EnterRoomMessage","header":null,"fields":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"entry_fee","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Treasury$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"upgrade_authority","type":{"kind":"simple","type":"address","optional":false}},{"name":"airdrop_pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"airdrop_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rooms","type":{"kind":"dict","key":"int","value":"RoomData","valueFormat":"ref"}},{"name":"current_room_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner_rewards","type":{"kind":"dict","key":"address","value":"int"}},{"name":"claimed_rewards","type":{"kind":"dict","key":"address","value":"int"}},{"name":"HOUSE_FEE_BPS","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"HOUSE_FEE_DENOMINATOR","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const Treasury_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
}

const Treasury_getters: ABIGetter[] = [
]

export const Treasury_getterMapping: { [key: string]: string } = {
}

const Treasury_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"open_room_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"enter_room_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"close_room_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"distribute_payouts_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"claim_reward_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"fund_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"distribute_airdrop"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: "open_room_params" | "enter_room_params" | "close_room_params" | "distribute_payouts_params" | "claim_reward_params" | "fund_airdrop" | "distribute_airdrop" | Deploy) {
        
        let body: Cell | null = null;
        if (message === "open_room_params") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "enter_room_params") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "close_room_params") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "distribute_payouts_params") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "claim_reward_params") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "fund_airdrop") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "distribute_airdrop") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
}