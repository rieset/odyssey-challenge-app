"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const transactions_1 = require("../transactions");
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const generic_1 = require("../generic");
const validators_1 = require("../validators");
const marshall_1 = require("@waves/marshall");
function transfer(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.TRANSFER;
    const version = paramsOrTx.version || 2;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    const tx = {
        type,
        version,
        senderPublicKey,
        assetId: generic_1.normalizeAssetId(paramsOrTx.assetId),
        recipient: paramsOrTx.recipient,
        amount: paramsOrTx.amount,
        attachment: paramsOrTx.attachment || '',
        fee: generic_1.fee(paramsOrTx, 100000),
        feeAssetId: generic_1.normalizeAssetId(paramsOrTx.feeAssetId),
        timestamp: paramsOrTx.timestamp || Date.now(),
        proofs: paramsOrTx.proofs || [],
        id: '',
    };
    validators_1.validate.transfer(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    return tx;
}
exports.transfer = transfer;
//# sourceMappingURL=transfer.js.map