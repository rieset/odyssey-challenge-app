"use strict";
/**
 * @module nodeInteraction
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const marshall_1 = require("@waves/marshall");
const delay = (timeout) => {
    const t = {};
    const p = new Promise((resolve, _) => {
        t.resolve = resolve;
        t.id = setTimeout(() => resolve(), timeout);
    });
    p.cancel = () => {
        t.resolve();
        clearTimeout(t.id);
    };
    return p;
};
const rerun = (f, expired, t = 1000) => delay(t).then(_ => expired ?
    Promise.reject(new Error('Tx wait stopped: timeout')) :
    f());
const DEFAULT_NODE_REQUEST_OPTIONS = {
    timeout: 120000,
    apiBase: "https://nodes.wavesplatform.com"
};
exports.currentHeight = (apiBase) => __awaiter(this, void 0, void 0, function* () {
    return yield axios_1.default.get('/blocks/height', { baseURL: apiBase })
        .then(res => res.data && res.data.height);
});
function waitForHeight(height, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { timeout, apiBase } = Object.assign({}, DEFAULT_NODE_REQUEST_OPTIONS, options);
        let expired = false;
        const to = delay(timeout);
        to.then(() => expired = true);
        const promise = () => exports.currentHeight(apiBase)
            .then(x => {
            if (x >= height) {
                to.cancel();
                return x;
            }
            else {
                return rerun(promise, expired, 10000);
            }
        }).catch(_ => rerun(promise, expired));
        return promise();
    });
}
exports.waitForHeight = waitForHeight;
/**
 * Resolves when specified txId is mined into block
 * @param txId - waves address as base58 string
 * @param options
 */
function waitForTx(txId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { timeout, apiBase } = Object.assign({}, DEFAULT_NODE_REQUEST_OPTIONS, options);
        let expired = false;
        const to = delay(timeout);
        to.then(() => expired = true);
        const promise = () => axios_1.default.get(`transactions/info/${txId}`, { baseURL: apiBase })
            .then(x => {
            to.cancel();
            return x.data;
        })
            .catch(_ => delay(1000)
            .then(_ => expired ?
            Promise.reject(new Error('Tx wait stopped: timeout')) :
            promise()));
        return promise();
    });
}
exports.waitForTx = waitForTx;
const process400 = (resp) => resp.status === 400
    ? Promise.reject(Object.assign(new Error(), resp.data))
    : resp;
const validateStatus = (status) => status === 400 || status >= 200 && status < 300;
function waitForTxWithNConfirmations(txId, confirmations, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { timeout } = Object.assign({}, DEFAULT_NODE_REQUEST_OPTIONS, options);
        let expired = false;
        const to = delay(timeout);
        to.then(() => expired = true);
        let tx = yield waitForTx(txId, options);
        let txHeight = tx.height;
        let currentHeight = tx.height;
        while (txHeight + confirmations > currentHeight) {
            if (expired)
                throw new Error('Tx wait stopped: timeout');
            yield waitForHeight(txHeight + confirmations, options);
            tx = yield waitForTx(txId, options);
            txHeight = tx.height;
        }
        return tx;
    });
}
exports.waitForTxWithNConfirmations = waitForTxWithNConfirmations;
function waitNBlocks(blocksCount, options = DEFAULT_NODE_REQUEST_OPTIONS) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiBase } = Object.assign({}, DEFAULT_NODE_REQUEST_OPTIONS, options);
        const height = yield exports.currentHeight(apiBase);
        const target = height + blocksCount;
        // console.log(`current height: ${height} target: ${target}`)
        return yield waitForHeight(target, options);
    });
}
exports.waitNBlocks = waitNBlocks;
/**
 * Get account effective balance
 * @param txId - transaction ID as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
function transactionById(txId, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`transactions/info/${txId}`, {
            baseURL: nodeUrl,
            validateStatus: (status) => status === 404 || validateStatus(status)
        }).then(resp => resp.data.error === 311 ? null : resp.data);
    });
}
exports.transactionById = transactionById;
/**
 * Get account effective balance
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
function balance(address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`addresses/balance/${address}`, { baseURL: nodeUrl, validateStatus })
            .then(process400)
            .then(x => x.data.balance);
    });
}
exports.balance = balance;
/**
 * Retrieve full information about waves account balance. Effective, generating etc
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
function balanceDetails(address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`addresses/balance/details/${address}`, { baseURL: nodeUrl, validateStatus })
            .then(process400)
            .then(x => x.data);
    });
}
exports.balanceDetails = balanceDetails;
/**
 * Retrieve information about specific asset account balance
 * @param assetId - id of asset
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
function assetBalance(assetId, address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`assets/balance/${address}/${assetId}`, { baseURL: nodeUrl, validateStatus })
            .then(process400)
            .then(x => x.data.balance);
    });
}
exports.assetBalance = assetBalance;
function accountData(options, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let address;
        let match;
        if (typeof options === 'string') {
            address = options;
            match = undefined;
        }
        else {
            address = options.address;
            match = options.match && encodeURIComponent(typeof options.match === 'string'
                ? options.match
                : options.match.source);
        }
        const url = `addresses/data/${address}`;
        const config = {
            baseURL: nodeUrl,
            params: {
                matches: match
            },
            validateStatus
        };
        const data = yield axios_1.default.get(url, config)
            .then(process400)
            .then(x => x.data);
        return data.reduce((acc, item) => (Object.assign({}, acc, { [item.key]: item })), {});
    });
}
exports.accountData = accountData;
/**
 * Get data from account dictionary by key
 * @param address - waves address as base58 string
 * @param key - dictionary key
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
function accountDataByKey(key, address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`addresses/data/${address}/${key}`, { baseURL: nodeUrl, validateStatus: (status) => status === 404 || validateStatus(status) })
            .then(process400)
            .then(resp => resp.status === 404 ? null : resp.data);
    });
}
exports.accountDataByKey = accountDataByKey;
/**
 * Get account script info
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
function scriptInfo(address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`addresses/scriptInfo/${address}`, { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
            .then(process400)
            .then(resp => resp.data);
    });
}
exports.scriptInfo = scriptInfo;
/**
 * Get account script meta, i.e., available callable functions
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
function scriptMeta(address, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`addresses/scriptInfo/${address}/meta`, { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
            .then(process400)
            .then(resp => resp.data);
    });
}
exports.scriptMeta = scriptMeta;
function rewards(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        let endpoint = `blockchain/rewards/`;
        let nodeUrl;
        if (args[1] !== undefined) {
            endpoint += args[0].toString();
            nodeUrl = args[1];
        }
        else {
            nodeUrl = args[0];
        }
        return axios_1.default.get(endpoint, { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
            .then(process400)
            .then(resp => resp.data);
    });
}
exports.rewards = rewards;
/**
 * Get invokeScript tx state changes
 * @param transactionId - invokeScript transaction id as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
function stateChanges(transactionId, nodeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`debug/stateChanges/info/${transactionId}`, { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
            .then(process400)
            .then(resp => resp.data && resp.data.stateChanges);
    });
}
exports.stateChanges = stateChanges;
/**
 * Sends transaction to waves node
 * @param tx - transaction to send
 * @param nodeUrl - node address to send tx to. E.g. https://nodes.wavesplatform.com/
 */
function broadcast(tx, nodeUrl) {
    return axios_1.default.post('transactions/broadcast', marshall_1.json.stringifyTx(tx), {
        baseURL: nodeUrl,
        headers: { 'content-type': 'application/json' },
        validateStatus,
    }).then(process400)
        .then(x => x.data);
}
exports.broadcast = broadcast;
//# sourceMappingURL=nodeInteraction.js.map