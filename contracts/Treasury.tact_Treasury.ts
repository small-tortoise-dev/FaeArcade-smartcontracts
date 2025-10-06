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

export type Treasury$Data = {
    $$type: 'Treasury$Data';
    owner: Address;
    upgrade_authority: Address;
    airdrop_pool: bigint;
    current_room_key: bigint;
    current_room_entry_fee: bigint;
    current_room_winners_count: bigint;
    current_room_status: bigint;
    current_room_pool: bigint;
    current_room_total_entries: bigint;
    current_room_paid_hash: bigint;
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
        b_1.storeInt(src.current_room_key, 257);
        b_1.storeInt(src.current_room_entry_fee, 257);
        b_1.storeInt(src.current_room_winners_count, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.current_room_status, 257);
        b_2.storeInt(src.current_room_pool, 257);
        b_2.storeInt(src.current_room_total_entries, 257);
        const b_3 = new Builder();
        b_3.storeInt(src.current_room_paid_hash, 257);
        b_3.storeInt(src.HOUSE_FEE_BPS, 257);
        b_3.storeInt(src.HOUSE_FEE_DENOMINATOR, 257);
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
    const _current_room_key = sc_1.loadIntBig(257);
    const _current_room_entry_fee = sc_1.loadIntBig(257);
    const _current_room_winners_count = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _current_room_status = sc_2.loadIntBig(257);
    const _current_room_pool = sc_2.loadIntBig(257);
    const _current_room_total_entries = sc_2.loadIntBig(257);
    const sc_3 = sc_2.loadRef().beginParse();
    const _current_room_paid_hash = sc_3.loadIntBig(257);
    const _HOUSE_FEE_BPS = sc_3.loadIntBig(257);
    const _HOUSE_FEE_DENOMINATOR = sc_3.loadIntBig(257);
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, current_room_key: _current_room_key, current_room_entry_fee: _current_room_entry_fee, current_room_winners_count: _current_room_winners_count, current_room_status: _current_room_status, current_room_pool: _current_room_pool, current_room_total_entries: _current_room_total_entries, current_room_paid_hash: _current_room_paid_hash, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function loadTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _current_room_key = source.readBigNumber();
    const _current_room_entry_fee = source.readBigNumber();
    const _current_room_winners_count = source.readBigNumber();
    const _current_room_status = source.readBigNumber();
    const _current_room_pool = source.readBigNumber();
    const _current_room_total_entries = source.readBigNumber();
    const _current_room_paid_hash = source.readBigNumber();
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, current_room_key: _current_room_key, current_room_entry_fee: _current_room_entry_fee, current_room_winners_count: _current_room_winners_count, current_room_status: _current_room_status, current_room_pool: _current_room_pool, current_room_total_entries: _current_room_total_entries, current_room_paid_hash: _current_room_paid_hash, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function loadGetterTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _upgrade_authority = source.readAddress();
    const _airdrop_pool = source.readBigNumber();
    const _current_room_key = source.readBigNumber();
    const _current_room_entry_fee = source.readBigNumber();
    const _current_room_winners_count = source.readBigNumber();
    const _current_room_status = source.readBigNumber();
    const _current_room_pool = source.readBigNumber();
    const _current_room_total_entries = source.readBigNumber();
    const _current_room_paid_hash = source.readBigNumber();
    const _HOUSE_FEE_BPS = source.readBigNumber();
    const _HOUSE_FEE_DENOMINATOR = source.readBigNumber();
    return { $$type: 'Treasury$Data' as const, owner: _owner, upgrade_authority: _upgrade_authority, airdrop_pool: _airdrop_pool, current_room_key: _current_room_key, current_room_entry_fee: _current_room_entry_fee, current_room_winners_count: _current_room_winners_count, current_room_status: _current_room_status, current_room_pool: _current_room_pool, current_room_total_entries: _current_room_total_entries, current_room_paid_hash: _current_room_paid_hash, HOUSE_FEE_BPS: _HOUSE_FEE_BPS, HOUSE_FEE_DENOMINATOR: _HOUSE_FEE_DENOMINATOR };
}

export function storeTupleTreasury$Data(source: Treasury$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.upgrade_authority);
    builder.writeNumber(source.airdrop_pool);
    builder.writeNumber(source.current_room_key);
    builder.writeNumber(source.current_room_entry_fee);
    builder.writeNumber(source.current_room_winners_count);
    builder.writeNumber(source.current_room_status);
    builder.writeNumber(source.current_room_pool);
    builder.writeNumber(source.current_room_total_entries);
    builder.writeNumber(source.current_room_paid_hash);
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
    const __code = Cell.fromHex('b5ee9c7241023401000c53000262ff008e88f4a413f4bcf2c80bed53208e9c30eda2edfb01d072d721d200d200fa4021103450666f04f86102f862e1ed43d9011b020271020d020120030501e3bb084ed44d0d200018e48fa40fa40810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d70030109c109b109a6c1c8e18fa40fa405902d1018100fa81271070547000547000205517e2db3c6cc1804000227020120060801e3b7e8fda89a1a400031c91f481f481020203ae01a803a1020203ae01020203ae01020203ae01a861a1020203ae01020203ae01020203ae01a861a1020203ae01020203ae01020203ae0060213821362134d8391c31f481f480b205a2030201f5024e20e0a8e000a8e00040aa2fc5b678d983007000224020158090b01e3ad6476a268690000c7247d207d20408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb8018084e084d884d360e470c7d207d202c816880c0807d409388382a38002a3800102a8bf16d9e3660c00a00022901e3ad91f6a268690000c7247d207d20408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb8018084e084d884d360e470c7d207d202c816880c0807d409388382a38002a3800102a8bf16d9e3660c00c0002260201200e130202710f1101e2a948ed44d0d200018e48fa40fa40810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d70030109c109b109a6c1c8e18fa40fa405902d1018100fa81271070547000547000205517e2db3c6cc11000022301e2aa89ed44d0d200018e48fa40fa40810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d70030109c109b109a6c1c8e18fa40fa405902d1018100fa81271070547000547000205517e2db3c6cc11200022b020158141601e3b031fb513434800063923e903e9020404075c035007420404075c020404075c020404075c0350c3420404075c020404075c020404075c0350c3420404075c020404075c020404075c00c04270426c4269b0723863e903e901640b44060403ea049c41c151c00151c00081545f8b6cf1b306015000221020120171901e3ac93f6a268690000c7247d207d20408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb8018084e084d884d360e470c7d207d202c816880c0807d409388382a38002a3800102a8bf16d9e3660c01800022501e3af9cf6a268690000c7247d207d20408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb806a1868408080eb80408080eb80408080eb8018084e084d884d360e470c7d207d202c816880c0807d409388382a38002a3800102a8bf16d9e3660c01a00022a02f6ed44d0d200018e48fa40fa40810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d70030109c109b109a6c1c8e18fa40fa405902d1018100fa81271070547000547000205517e20d925f0de02bd749c21fe3000bf901201c1e01ac0bd31f018210946a98b6ba8ec7d33f30c8018210aff90f5758cb1fcb3fc910ac109b108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e00b1d00a8c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed54db3104e482f090749feb14c2fda253536c99587706f062ad151ec413d58a3a06028f7cced1a7bae3022082f01965172e995d3dfe36ccfac1fd31d9136f9e96ef54ab2dcf5e85043fc7c57a7ebae3022082f0da18ac76f0b7a9f079b0d3acde58803199dd9e46738a934e5c963bc0a2485b95bae302201f20212200f410475f0781303982103b9aca008064816b0f04c00014f2f471705300109b108a1079105810475513c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed540182308116fb24c001f2f4258200eb66f8416f24135f0358baf2f4f8416f24135f032ba82ca904f8416f24135f0301a113a001a4109b108a10791068105710460350452900d8308116fb04c00114f2f4108a1079106810571046103570443512c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed5404e282f0f23c37f73cab6a0fcf1f42d30f11c93ebbe3d3616094c478390d4ce10207c871bae3022082f0ae1f55287d6c4d2042cc5941a8a23c971d49bf5e554d4fa78ae730638e083cb7bae3022082f00b6d2c55bb90818ec916f0561c56fe51465f66acabbf47bb6271becfcbbf2d0cbae302232a2b3204fe308200c69d04c00014f2f481416f03c00013f2f473238200f4a701c003f2f45210a9048d086007c0a7d5f1e88713d9205491662a68da90795ce284555c7a5ffe6b93354d074f5c8d0860037ade33cc37032184b0ecef80219c935266c972cbeeec553021b22d6105e8bc148988542340706d50426d50427fc8cf8580ca008924272526004380107bfaaa5cc6e5368e5f9799188bd798cd22e04ab16d1d8ea4fc37480741e6351000011003fecf16ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00885230706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb008812706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf402727280014000000005061796f75740164025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00107910681057104610351024725034813039592900a4c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed5400d830f8416f24135f0318a0109b108a091068105710461035443012c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed5404fe3007ab0020ab008d086007c0a7d5f1e88713d9205491662a68da90795ce284555c7a5ffe6b93354d074f5c8d0860037ade33cc37032184b0ecef80219c935266c972cbeeec553021b22d6105e8bc1488542230706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb00882c312c2d002a00000000546f702057696e6e6572205061796f757403fe12706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb008d0860041efeaa9731b94da397e5e64622f5e63348b812ac5b4763a93f0dd201d0798d448812706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a2e2f3000300000000053747265616b2057696e6e6572205061796f757400065bcf8101d68ae2f400c901fb00108a107970091068105710461035443012c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed5431001a58cf8680cf8480f400f400cf8101fc82f0c6f7cca7186d0118c20b0711c5681080e5eeb8059ad9c80230abff857605a67eba8e56109b5518c87f01ca0055b050bcce19ce17810101cf0005c8810101cf0014810101cf0012810101cf0001c8810101cf0012810101cf0013810101cf0003c8810101cf0014810101cf0014810101cf00cd12cdcdc9ed54e05f0c330006f2c08250aaca37');
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
    16751: { message: "Room already paid" },
    27407: { message: "Room already exists" },
    50845: { message: "Room is not closed" },
    60262: { message: "Incorrect entry fee" },
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
    "Room already paid": 16751,
    "Room already exists": 27407,
    "Room is not closed": 50845,
    "Incorrect entry fee": 60262,
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
    {"name":"Treasury$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"upgrade_authority","type":{"kind":"simple","type":"address","optional":false}},{"name":"airdrop_pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_key","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_entry_fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_winners_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_total_entries","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"current_room_paid_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"HOUSE_FEE_BPS","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"HOUSE_FEE_DENOMINATOR","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const Treasury_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
}

const Treasury_getters: ABIGetter[] = [
    {"name":"getOwner","methodId":102025,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getUpgradeAuthority","methodId":130873,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getAirdropPool","methodId":94920,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomEntryFee","methodId":77956,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomWinnersCount","methodId":97059,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomStatus","methodId":127271,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomPool","methodId":89927,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCurrentRoomTotalEntries","methodId":100680,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getHouseFeeBps","methodId":123079,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const Treasury_getterMapping: { [key: string]: string } = {
    'getOwner': 'getGetOwner',
    'getUpgradeAuthority': 'getGetUpgradeAuthority',
    'getAirdropPool': 'getGetAirdropPool',
    'getCurrentRoomEntryFee': 'getGetCurrentRoomEntryFee',
    'getCurrentRoomWinnersCount': 'getGetCurrentRoomWinnersCount',
    'getCurrentRoomStatus': 'getGetCurrentRoomStatus',
    'getCurrentRoomPool': 'getGetCurrentRoomPool',
    'getCurrentRoomTotalEntries': 'getGetCurrentRoomTotalEntries',
    'getHouseFeeBps': 'getGetHouseFeeBps',
}

const Treasury_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"open_room"}},
    {"receiver":"internal","message":{"kind":"text","text":"enter_paid"}},
    {"receiver":"internal","message":{"kind":"text","text":"close_room"}},
    {"receiver":"internal","message":{"kind":"text","text":"payout_paid"}},
    {"receiver":"internal","message":{"kind":"text","text":"fund_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"payout_airdrop"}},
    {"receiver":"internal","message":{"kind":"text","text":"upgrade"}},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: "open_room" | "enter_paid" | "close_room" | "payout_paid" | "fund_airdrop" | "payout_airdrop" | "upgrade" | Deploy) {
        
        let body: Cell | null = null;
        if (message === "open_room") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "enter_paid") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "close_room") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "payout_paid") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "fund_airdrop") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "payout_airdrop") {
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
    
    async getGetCurrentRoomEntryFee(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomEntryFee', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCurrentRoomWinnersCount(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomWinnersCount', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCurrentRoomStatus(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomStatus', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCurrentRoomPool(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomPool', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCurrentRoomTotalEntries(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCurrentRoomTotalEntries', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetHouseFeeBps(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getHouseFeeBps', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}