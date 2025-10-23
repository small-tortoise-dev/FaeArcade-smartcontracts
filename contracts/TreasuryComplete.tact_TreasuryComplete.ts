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

export type TreasuryComplete$Data = {
    $$type: 'TreasuryComplete$Data';
    owner: Address;
    upgrade_authority: Address;
    airdrop_pool: bigint;
    airdrop_id: bigint;
    rooms: Dictionary<bigint, RoomData>;
    current_room_id: bigint;
    winner_rewards: Dictionary<bigint, bigint>;
    claimed_rewards: Dictionary<bigint, bigint>;
    HOUSE_FEE_BPS: bigint;
    HOUSE_FEE_DENOMINATOR: bigint;
    EVENT_ROOM_OPENED: bigint;
    EVENT_ROOM_CLOSED: bigint;
    EVENT_PAYOUT_DISTRIBUTED: bigint;
    EVENT_AIRDROP_DISTRIBUTED: bigint;
    EVENT_REWARD_CLAIMED: bigint;
    EVENT_ROOM_ENTRY: bigint;
}

export function storeTreasuryComplete$Data(src: TreasuryComplete$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.upgrade_authority);
        b_0.storeInt(src.airdrop_pool, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.airdrop_id, 257);
        b_1.storeDict(src.rooms, Dictionary.Keys.BigInt(257), dictValueParserRoomData());
        b_1.storeInt(src.current_room_id, 257);
        b_1.storeDict(src.winner_rewards, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_1.storeDict(src.claimed_rewards, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_1.storeInt(src.HOUSE_FEE_BPS, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.HOUSE_FEE_DENOMINATOR, 257);
        b_2.storeInt(src.EVENT_ROOM_OPENED, 257);
        b_2.storeInt(src.EVENT_ROOM_CLOSED, 257);
        const b_3 = new Builder();
        b_3.storeInt(src.EVENT_PAYOUT_DISTRIBUTED, 257);
        b_3.storeInt(src.EVENT_AIRDROP_DISTRIBUTED, 257);
        b_3.storeInt(src.EVENT_REWARD_CLAIMED, 257);
        const b_4 = new Builder();
        b_4.storeInt(src.EVENT_ROOM_ENTRY, 257);
        b_3.storeRef(b_4.endCell());
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTreasuryComplete$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _upgrade_authority = sc_0.loadAddress();
    const _airdrop_pool = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _airdrop_id = sc_1.loadIntBig(257);
    const _rooms = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), sc_1);
    const _current_room_id = sc_1.loadIntBig(257);
    const _winner_rewards = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_1);
    const _claimed_rewards = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_1);
    const _HOUSE_FEE_BPS = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _HOUSE_FEE_DENOMINATOR = sc_2.loadIntBig(257);
    const _EVENT_ROOM_OPENED = sc_2.loadIntBig(257);
    const _EVENT_ROOM_CLOSED = sc_2.loadIntBig(257);
    const sc_3 = sc_2.loadRef().beginParse();
    const _EVENT_PAYOUT_DISTRIBUTED = sc_3.loadIntBig(257);
    const _EVENT_AIRDROP_DISTRIBUTED = sc_3.loadIntBig(257);
    const _EVENT_REWARD_CLAIMED = sc_3.loadIntBig(257);
    const sc_4 = sc_3.loadRef().beginParse();
    const _EVENT_ROOM_ENTRY = sc_4.loadIntBig(257);
    return { $$type: 'TreasuryComplete$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, EVENT_ROOM_OPENED: _EVENT_ROOM_OPENED, EVENT_ROOM_CLOSED: _EVENT_ROOM_CLOSED, EVENT_PAYOUT_DISTRIBUTED: _EVENT_PAYOUT_DISTRIBUTED, EVENT_AIRDROP_DISTRIBUTED: _EVENT_AIRDROP_DISTRIBUTED, EVENT_REWARD_CLAIMED: _EVENT_REWARD_CLAIMED, EVENT_ROOM_ENTRY: _EVENT_ROOM_ENTRY };
}

export function loadTupleTreasuryComplete$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    const _EVENT_ROOM_OPENED = source.readBigNumber();
    const _EVENT_ROOM_CLOSED = source.readBigNumber();
    const _EVENT_PAYOUT_DISTRIBUTED = source.readBigNumber();
    const _EVENT_AIRDROP_DISTRIBUTED = source.readBigNumber();
    source = source.readTuple();
    const _EVENT_REWARD_CLAIMED = source.readBigNumber();
    const _EVENT_ROOM_ENTRY = source.readBigNumber();
    return { $$type: 'TreasuryComplete$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, EVENT_ROOM_OPENED: _EVENT_ROOM_OPENED, EVENT_ROOM_CLOSED: _EVENT_ROOM_CLOSED, EVENT_PAYOUT_DISTRIBUTED: _EVENT_PAYOUT_DISTRIBUTED, EVENT_AIRDROP_DISTRIBUTED: _EVENT_AIRDROP_DISTRIBUTED, EVENT_REWARD_CLAIMED: _EVENT_REWARD_CLAIMED, EVENT_ROOM_ENTRY: _EVENT_ROOM_ENTRY };
}

export function loadGetterTupleTreasuryComplete$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _airdrop_id = source.readBigNumber();
    const _rooms = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoomData(), source.readCellOpt());
    const _current_room_id = source.readBigNumber();
    const _winner_rewards = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _claimed_rewards = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    const _EVENT_ROOM_OPENED = source.readBigNumber();
    const _EVENT_ROOM_CLOSED = source.readBigNumber();
    const _EVENT_PAYOUT_DISTRIBUTED = source.readBigNumber();
    const _EVENT_AIRDROP_DISTRIBUTED = source.readBigNumber();
    const _EVENT_REWARD_CLAIMED = source.readBigNumber();
    const _EVENT_ROOM_ENTRY = source.readBigNumber();
    return { $$type: 'TreasuryComplete$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, airdrop_id: _airdrop_id, rooms: _rooms, current_room_id: _current_room_id, winner_rewards: _winner_rewards, claimed_rewards: _claimed_rewards, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR, EVENT_ROOM_OPENED: _EVENT_ROOM_OPENED, EVENT_ROOM_CLOSED: _EVENT_ROOM_CLOSED, EVENT_PAYOUT_DISTRIBUTED: _EVENT_PAYOUT_DISTRIBUTED, EVENT_AIRDROP_DISTRIBUTED: _EVENT_AIRDROP_DISTRIBUTED, EVENT_REWARD_CLAIMED: _EVENT_REWARD_CLAIMED, EVENT_ROOM_ENTRY: _EVENT_ROOM_ENTRY };
}

export function storeTupleTreasuryComplete$Data(source: TreasuryComplete$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.upgrade_authority);
    builder.writeNumber(source.airdrop_pool);
    builder.writeNumber(source.airdrop_id);
    builder.writeCell(source.rooms.size > 0 ? beginCell().storeDictDirect(source.rooms, Dictionary.Keys.BigInt(257), dictValueParserRoomData()).endCell() : null);
    builder.writeNumber(source.current_room_id);
    builder.writeCell(source.winner_rewards.size > 0 ? beginCell().storeDictDirect(source.winner_rewards, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.claimed_rewards.size > 0 ? beginCell().storeDictDirect(source.claimed_rewards, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.HOUSE_FEE_BPS);
    builder.writeNumber(source.HOUSE_FEE_DENOMINATOR);
    builder.writeNumber(source.EVENT_ROOM_OPENED);
    builder.writeNumber(source.EVENT_ROOM_CLOSED);
    builder.writeNumber(source.EVENT_PAYOUT_DISTRIBUTED);
    builder.writeNumber(source.EVENT_AIRDROP_DISTRIBUTED);
    builder.writeNumber(source.EVENT_REWARD_CLAIMED);
    builder.writeNumber(source.EVENT_ROOM_ENTRY);
    return builder.build();
}

export function dictValueParserTreasuryComplete$Data(): DictionaryValue<TreasuryComplete$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryComplete$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryComplete$Data(src.loadRef().beginParse());
        }
    }
}

 type TreasuryComplete_init_args = {
    $$type: 'TreasuryComplete_init_args';
    owner: Address;
    upgrade_authority: Address;
}

function initTreasuryComplete_init_args(src: TreasuryComplete_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.upgrade_authority);
    };
}

async function TreasuryComplete_init(owner: Address, upgrade_authority: Address) {
    const __code = Cell.fromHex('b5ee9c72410242010011da000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9011e0202710210020120030e020120040c020120050702bbb2773b513434800063907e903e901640b4405b5b5b60403ea049c42084048d159e2084048d159e6084048d159ea084048d159ee084048d159f2084048d159f5c150eeed2f29225d1591400f8c343c44443c3844403954776cf15c417c3e01f060146db3c810101530b50334133f40c6fa19401d70030925b6de2206e923070e0206ef2d08037020273080a02dda387b513434800063907e903e901640b4405b5b5b60403ea049c42084048d159e2084048d159e6084048d159ea084048d159ee084048d159f2084048d159f5c150eeed2f29225d1591400f8c343c44403d543b6cf15c417c3c81ba48c1b66481bbcb4201bca1bc238881ba48c1b77a1f0900a08101012d0259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e202a5a0f3b513434800063907e903e901640b4405b5b5b60403ea049c42084048d159e2084048d159e6084048d159ea084048d159ee084048d159f2084048d159f5c150eeed2f29225d1591400f8c376cf15c417c3e1f0b00022602a7b73f5da89a1a400031c83f481f480b205a202dadadb0201f5024e2104202468acf104202468acf304202468acf504202468acf704202468acf904202468acfae0a877769794912e8ac8a007c61bb678ae20be1f01f0d00022a02a7bb2c8ed44d0d200018e41fa40fa405902d1016d6d6d8100fa81271082101234567882101234567982101234567a82101234567b82101234567c82101234567d70543bbb4bca489745645003e30ddb3c57105f0f81f0f00022d020120111302a7b8e89ed44d0d200018e41fa40fa405902d1016d6d6d8100fa81271082101234567882101234567982101234567a82101234567b82101234567c82101234567d70543bbb4bca489745645003e30ddb3c57105f0f81f1200022f020158141c020120151a020120161802a6a8c7ed44d0d200018e41fa40fa405902d1016d6d6d8100fa81271082101234567882101234567982101234567a82101234567b82101234567c82101234567d70543bbb4bca489745645003e30ddb3c57105f0f1f1700022702a6a889ed44d0d200018e41fa40fa405902d1016d6d6d8100fa81271082101234567882101234567982101234567a82101234567b82101234567c82101234567d70543bbb4bca489745645003e30ddb3c57105f0f1f1900022c02bbac26f6a268690000c720fd207d202c816880b6b6b6c0807d4093884108091a2b3c4108091a2b3cc108091a2b3d4108091a2b3dc108091a2b3e4108091a2b3eb82a1ddda5e5244ba2b22801f18687888887870888072a8eed9e2b882f87c01f1b0146db3c810101530a50334133f40c6fa19401d70030925b6de2206e923070e0206ef2d0803702a7b3ce7b513434800063907e903e901640b4405b5b5b60403ea049c42084048d159e2084048d159e6084048d159ea084048d159ee084048d159f2084048d159f5c150eeed2f29225d1591400f8c376cf15c417c3e01f1d00022e03f230eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e41fa40fa405902d1016d6d6d8100fa81271082101234567882101234567982101234567a82101234567b82101234567c82101234567d70543bbb4bca489745645003e30d1111935f0f5be02fd749c21fe3000ff901201f202200b4fa40fa40810101d700d401d0810101d700f404810101d700f404f404810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101d700300d11100d10df10de5710550e01c00fd31f018210946a98b6ba8ed1d33f30c8018210aff90f5758cb1fcb3fc90e11100e10df10ce10bd10ac109b108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e00f2100d2c87f01ca00111055e011101fce1dce1b810101cf0009c8810101cf0018f40016810101cf0014f40012f400810101cf0001c8810101cf0012810101cf0012810101cf0003c8810101cf0014810101cf0014810101cf0004c8810101cf0014cd13cd12cdcdc9ed54db3104e482f090749feb14c2fda253536c99587706f062ad151ec413d58a3a06028f7cced1a7bae3022082f01965172e995d3dfe36ccfac1fd31d9136f9e96ef54ab2dcf5e85043fc7c57a7ebae3022082f078f481cc938c19046a2dbeed444b8cf7b65aa38154efdaef2a7d5dd15d2dab6cbae3022023262c2f01fa3038813039821059682f0080642b8101012459f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2816b0f016ef2f471705300f823531651670655310706050443138101015028c82402da55705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc924103e01206e953059f45a30944133f415e2221110111211100f11110f0e11100e0d50ef10ac109b108a107910681057044336db3c2540009e70c852a0cb1f14cb1f58fa02cb07f82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fc308130392a8101012259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f288116fb26c001f2f48200eb66f8416f24135f0329baf2f4f8416f242702d6135f032fa82ea90420c2008ebf8870561954433070046d03046d5023c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00def8416f24135f0321a15166a005a4106910581047103850728101015099c82829001a00000000486f7573652046656501fe55705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc94ee05240206e953059f45a30944133f415e2f842f8416f24135f031112111411121111111311111110111211100f11110f0211100210df10ce10bd10ac109b108a1079106810572a01da10564035db3cc87f01ca00111055e011101fce1dce1b810101cf0009c8810101cf0018f40016810101cf0014f40012f400810101cf0001c8810101cf0012810101cf0012810101cf0003c8810101cf0014810101cf0014810101cf0004c8810101cf0014cd13cd12cdcdc9ed542b00ae70c85270cb1f16cb1f5004cf1658fa0201fa0201fa02f82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fe30f8416f246c31d31f302a8101012259f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f28308116fb05c00115f2f470f8231047103612810101c82d02ee2951494934500955705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc924103f01206e953059f45a30944133f415e21110111211100f11110f0e11100e10df0e10bd10ac109b108a1079106810571046030504db3c2e40009e70c85290cb1f14cb1f58fa02cb1ff82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0004e482f03eefb0952b6918ad8b478603bade6f3639a4230c05b7f2e2282ffa77fede55e5bae3022082f098e91200d96b01eb7c70c724a4d16a71e36dd0752ec2220accce37d2ea4be77cbae3022082f0ae1f55287d6c4d2042cc5941a8a23c971d49bf5e554d4fa78ae730638e083cb7bae3022030363b3c01fa30f8416f246c31d31fd3072c8101012459f40d6fa192306ddf206e92306d8e3ad0810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700301058105710566c186f08e2813717216eb3f2f4206ef2d0806f288200c69d06c00016f2f481416f02c00012f2f43102f88200f4a75385baf2f427a45280a8ab00237093530ab98ae85f033672f82310561046138101012210345098c855705078810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc94ee05240206e953059f45a30944133f415e2111011121110323402fe09fa4053baa15230a824a9041110111b11100f111a0f0e11190e0d11180d0c11170c0b11160b0a11150a0911140908111308071112070611110605111b0504111a040311190302111c0201111d01561801111ddb3c81010120104c1301111e01216e955b59f45a3098c801cf004133f442e21114a4111a111b111a08111a08373300600e11190e0d11180d0c11170c0b11160b0a11150a0911140909111309071112070611110605111005104f103e4dc0108902420f11110f0e11100e10df0e10bd10ac109b108a107910681057104603055044db3c3540009e70c85280cb1f14cb1f58fa02cb07f82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003f030f8416f246c31d31ffa403001111001111156105612db3c810101545b0052304133f40c6fa19401d70030925b6de28200f7f3216eb3f2f4206ef2d0808200f7f321c200f2f4810101545b0052404133f40c6fa19401d70030925b6de270216eb39630206ef2d0809131e2810d0701c000f2f48856145222373839001a308130390182080f4240a801a000200000000052657761726420436c61696d02de706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0081010120103c41c052c0216e955b59f45a3098c801cf004133f442e21110111211100f11110f0e11100e10df10ce10bd10ac0b5518db3c3a4000a070c85260cb1f14cb1f58cf1601fa02f82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00014430f8416f24135f031ca010df10ce0d10ac109b108a107910681057104610354430124002a082f07e9a4e9c4db87f8cc634e496e2f129f07172c3894b3498755d7d69745e4ba895bae30282f0c6f7cca7186d0118c20b0711c5681080e5eeb8059ad9c80230abff857605a67ebae3025f0f30f2c0823d4103fc30717a758200bfb82fc200f2f40da40eab005301a9043120c2008ebcf8428812706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009130e20f11110f0e11100e70111010ef10ce10bd10ac109b108a10791068105710460305db3c3e3f40002c00000000546f702053636f7265722041697264726f70009e70c85270cb1f14cb1f12cb07cb07f82301cb1fc9561159706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0000cec87f01ca00111055e011101fce1dce1b810101cf0009c8810101cf0018f40016810101cf0014f40012f400810101cf0001c8810101cf0012810101cf0012810101cf0003c8810101cf0014810101cf0014810101cf0004c8810101cf0014cd13cd12cdcdc9ed5400ec8200c241f8422ec705f2f410df551cc87f01ca00111055e011101fce1dce1b810101cf0009c8810101cf0018f40016810101cf0014f40012f400810101cf0001c8810101cf0012810101cf0012810101cf0003c8810101cf0014810101cf0014810101cf0004c8810101cf0014cd13cd12cdcdc9ed540fd0683a');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initTreasuryComplete_init_args({ $$type: 'TreasuryComplete_init_args', owner, upgrade_authority })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const TreasuryComplete_errors = {
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
    3335: { message: "Reward already claimed" },
    5883: { message: "Room is not open" },
    14103: { message: "Room not found" },
    14506: { message: "Too many winners" },
    16751: { message: "Room already paid" },
    27407: { message: "Room already exists" },
    39893: { message: "Winners count must be positive" },
    49080: { message: "No airdrop pool available" },
    49729: { message: "Unauthorized" },
    50845: { message: "Room is not closed" },
    60262: { message: "Incorrect entry fee" },
    62631: { message: "Winners count mismatch" },
    63475: { message: "No rewards to claim" },
} as const

export const TreasuryComplete_errors_backward = {
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
    "Reward already claimed": 3335,
    "Room is not open": 5883,
    "Room not found": 14103,
    "Too many winners": 14506,
    "Room already paid": 16751,
    "Room already exists": 27407,
    "Winners count must be positive": 39893,
    "No airdrop pool available": 49080,
    "Unauthorized": 49729,
    "Room is not closed": 50845,
    "Incorrect entry fee": 60262,
    "Winners count mismatch": 62631,
    "No rewards to claim": 63475,
} as const

const TreasuryComplete_types: ABIType[] = [
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
    {"name":"TreasuryComplete$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"upgrade_authority","type":{"kind":"simple","type":"address","optional":false}},{"name":"airdrop_pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"airdrop_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rooms","type":{"kind":"dict","key":"int","value":"RoomData","valueFormat":"ref"}},{"name":"current_room_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner_rewards","type":{"kind":"dict","key":"int","value":"int"}},{"name":"claimed_rewards","type":{"kind":"dict","key":"int","value":"int"}},{"name":"HOUSE_FEE_BPS","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"HOUSE_FEE_DENOMINATOR","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_ROOM_OPENED","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_ROOM_CLOSED","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_PAYOUT_DISTRIBUTED","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_AIRDROP_DISTRIBUTED","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_REWARD_CLAIMED","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"EVENT_ROOM_ENTRY","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const TreasuryComplete_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
}

const TreasuryComplete_getters: ABIGetter[] = [
    {"name":"getOwner","methodId":102025,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getUpgradeAuthority","methodId":130873,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getAirdropPool","methodId":94920,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getAirdropId","methodId":124041,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomId","methodId":80378,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getRoomData","methodId":71393,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"RoomData","optional":true}},
    {"name":"getWinnerReward","methodId":68060,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner_address","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getClaimedReward","methodId":125005,"arguments":[{"name":"room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner_address","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getHouseFeeBps","methodId":123079,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getHouseFeeDenominator","methodId":71484,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const TreasuryComplete_getterMapping: { [key: string]: string } = {
    'getOwner': 'getGetOwner',
    'getUpgradeAuthority': 'getGetUpgradeAuthority',
    'getAirdropPool': 'getGetAirdropPool',
    'getAirdropId': 'getGetAirdropId',
    'getCurrentRoomId': 'getGetCurrentRoomId',
    'getRoomData': 'getGetRoomData',
    'getWinnerReward': 'getGetWinnerReward',
    'getClaimedReward': 'getGetClaimedReward',
    'getHouseFeeBps': 'getGetHouseFeeBps',
    'getHouseFeeDenominator': 'getGetHouseFeeDenominator',
}

const TreasuryComplete_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"open_room"}},
    {"receiver":"internal","message":{"kind":"text","text":"enter_paid"}},
    {"receiver":"internal","message":{"kind":"text","text":"close_room_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"distribute_payouts_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"claim_reward_params"}},
    {"receiver":"internal","message":{"kind":"text","text":"fund_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"distribute_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"upgrade"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class TreasuryComplete implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = TreasuryComplete_errors_backward;
    public static readonly opcodes = TreasuryComplete_opcodes;
    
    static async init(owner: Address, upgrade_authority: Address) {
        return await TreasuryComplete_init(owner, upgrade_authority);
    }
    
    static async fromInit(owner: Address, upgrade_authority: Address) {
        const __gen_init = await TreasuryComplete_init(owner, upgrade_authority);
        const address = contractAddress(0, __gen_init);
        return new TreasuryComplete(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new TreasuryComplete(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TreasuryComplete_types,
        getters: TreasuryComplete_getters,
        receivers: TreasuryComplete_receivers,
        errors: TreasuryComplete_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: "open_room" | "enter_paid" | "close_room_params" | "distribute_payouts_params" | "claim_reward_params" | "fund_airdrop" | "distribute_airdrop" | "upgrade" | Deploy) {
        
        let body: Cell | null = null;
        if (message === "open_room") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "enter_paid") {
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
        if (message === "upgrade") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
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
    
    async getGetRoomData(provider: ContractProvider, room_key: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        const source = (await provider.get('getRoomData', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleRoomData(result_p) : null;
        return result;
    }
    
    async getGetWinnerReward(provider: ContractProvider, room_key: bigint, winner_address: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        builder.writeAddress(winner_address);
        const source = (await provider.get('getWinnerReward', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetClaimedReward(provider: ContractProvider, room_key: bigint, winner_address: Address) {
        const builder = new TupleBuilder();
        builder.writeNumber(room_key);
        builder.writeAddress(winner_address);
        const source = (await provider.get('getClaimedReward', builder.build())).stack;
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
    
}