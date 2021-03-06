"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const marshall_1 = require("@waves/marshall");
const { STRING, LEN, SHORT } = marshall_1.serializePrimitives;
const generic_1 = require("../generic");
const validators_1 = require("../validators");
exports.serializeAuthData = (auth) => ts_lib_crypto_1.concat(LEN(SHORT)(STRING)('WavesWalletAuthentication'), LEN(SHORT)(STRING)(auth.host || ''), LEN(SHORT)(STRING)(auth.data || ''));
function auth(params, seed, chainId) {
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const publicKey = params.publicKey || generic_1.getSenderPublicKey(seedsAndIndexes, { senderPublicKey: undefined });
    validators_1.validate.auth(params);
    const rx = {
        hash: '',
        signature: '',
        host: params.host,
        data: params.data,
        publicKey,
        address: ts_lib_crypto_1.address({ publicKey }, chainId)
    };
    const bytes = exports.serializeAuthData(rx);
    rx.signature = (seed != null && ts_lib_crypto_1.signBytes(seed, bytes)) || '';
    rx.hash = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(Uint8Array.from(bytes)));
    return rx;
}
exports.auth = auth;
//# sourceMappingURL=auth.js.map