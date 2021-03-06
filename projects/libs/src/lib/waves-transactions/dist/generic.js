"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
exports.mapObj = (obj, f) => Object.entries(obj).map(([k, v]) => [k, f(v)])
    .reduce((acc, [k, v]) => (Object.assign({}, acc, { [k]: v })), {});
function getSenderPublicKey(seedsAndIndexes, params) {
    if (seedsAndIndexes.length === 0 && params.senderPublicKey == null)
        throw new Error('Please provide either seed or senderPublicKey');
    else {
        return params.senderPublicKey == null ? ts_lib_crypto_1.publicKey(seedsAndIndexes[0][0]) : params.senderPublicKey;
    }
}
exports.getSenderPublicKey = getSenderPublicKey;
exports.base64Prefix = (str) => str == null || str.slice(0, 7) === 'base64:' ? str : 'base64:' + str;
function addProof(tx, proof, index) {
    if (index == null) {
        tx.proofs = [...tx.proofs, proof];
        return tx;
    }
    if (tx.proofs != null && !!tx.proofs[index])
        throw new Error(`Proof at index ${index} already exists.`);
    for (let i = tx.proofs.length; i < index; i++)
        tx.proofs.push('');
    tx.proofs[index] = proof;
    return tx;
}
exports.addProof = addProof;
function convertToPairs(seedObj) {
    //Due to typescript duck typing, 'string' type satisfies IIndexSeedMap interface. Because of this we should typecheck against string first
    if (seedObj == null) {
        return [];
    }
    else if (typeof seedObj === 'string') {
        return [[seedObj, undefined]];
    }
    else if ('privateKey' in seedObj) {
        return [[seedObj, undefined]];
    }
    else if (Array.isArray(seedObj)) {
        return seedObj.map((s, i) => [s, i]).filter(([s, _]) => s);
    }
    else {
        const keys = Object.keys(seedObj).map(k => parseInt(k)).filter(k => !isNaN(k)).sort();
        return keys.map(k => [seedObj[k], k]);
    }
}
exports.convertToPairs = convertToPairs;
exports.isOrder = (p) => p.assetPair !== undefined;
function networkByte(p, def) {
    switch (typeof p) {
        case 'string':
            return p.charCodeAt(0);
        case 'number':
            return p;
        default:
            return def;
    }
}
exports.networkByte = networkByte;
function fee(params, def) {
    if (params.fee)
        return params.fee;
    if (!params.additionalFee)
        return def;
    return def + params.additionalFee;
}
exports.fee = fee;
function normalizeAssetId(assetId) {
    assetId = assetId || null;
    return assetId === 'WAVES' ? null : assetId;
}
exports.normalizeAssetId = normalizeAssetId;
//# sourceMappingURL=generic.js.map