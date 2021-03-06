"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const marshall_1 = require("@waves/marshall");
const marshall_2 = require("@waves/marshall");
const validators_1 = require("../validators");
/**
 * Signs [[TCustomData]]
 */
function customData(cData, seed) {
    validators_1.validate.customData(cData);
    let bytes = serializeCustomData(cData);
    const hash = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    const pk = cData.publicKey ? cData.publicKey : seed && ts_lib_crypto_1.publicKey(seed);
    const signature = seed && ts_lib_crypto_1.signBytes(seed, bytes);
    return Object.assign({}, cData, { hash, publicKey: pk, signature });
}
exports.customData = customData;
function serializeCustomData(d) {
    if (d.version === 1) {
        return ts_lib_crypto_1.concat([255, 255, 255, 1], marshall_1.serializePrimitives.BASE64_STRING(d.binary));
    }
    else if (d.version === 2) {
        const ser = marshall_2.binary.serializerFromSchema(marshall_1.schemas.txFields.data[1]);
        return ts_lib_crypto_1.concat([255, 255, 255, 2], ser(d.data));
    }
    else {
        throw new Error(`Invalid CustomData version: ${d.version}`);
    }
}
exports.serializeCustomData = serializeCustomData;
//# sourceMappingURL=custom-data.js.map