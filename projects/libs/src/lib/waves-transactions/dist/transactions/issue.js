"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const transactions_1 = require("../transactions");
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const generic_1 = require("../generic");
const marshall_1 = require("@waves/marshall");
const validators_1 = require("../validators");
function issue(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.ISSUE;
    const version = paramsOrTx.version || 2;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    const tx = {
        type,
        version,
        senderPublicKey,
        name: paramsOrTx.name,
        description: paramsOrTx.description,
        quantity: paramsOrTx.quantity,
        script: paramsOrTx.script == null ? undefined : generic_1.base64Prefix(paramsOrTx.script),
        decimals: paramsOrTx.decimals == null ? 8 : paramsOrTx.decimals,
        reissuable: paramsOrTx.reissuable || false,
        fee: paramsOrTx.quantity === 1 ? generic_1.fee(paramsOrTx, 1000000) : generic_1.fee(paramsOrTx, 100000000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: generic_1.networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    };
    validators_1.validate.issue(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    return tx;
}
exports.issue = issue;
//# sourceMappingURL=issue.js.map