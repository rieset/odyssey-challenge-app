"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const burnScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.BURN),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 2]),
    assetId: validators_1.isAssetId,
    quantity: validators_1.isNumberLike,
    chainId: validators_1.isNumber,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.burnValidator = validators_1.validateByShema(burnScheme, validators_1.getError);
//# sourceMappingURL=burn.js.map