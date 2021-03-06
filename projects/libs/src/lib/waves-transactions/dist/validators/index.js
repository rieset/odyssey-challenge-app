"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./validators"));
const transfer_1 = require("./transfer");
const mass_transfer_1 = require("./mass-transfer");
const alias_1 = require("./alias");
const burn_1 = require("./burn");
const cancel_lease_1 = require("./cancel-lease");
const data_1 = require("./data");
const sponsorship_1 = require("./sponsorship");
const set_asset_script_1 = require("./set-asset-script");
const set_script_1 = require("./set-script");
const reissue_1 = require("./reissue");
const issue_1 = require("./issue");
const lease_1 = require("./lease");
const invoke_script_1 = require("./invoke-script");
const exchange_1 = require("./exchange");
const order_1 = require("./order");
const cancel_order_1 = require("./cancel-order");
const custom_data_1 = require("./custom-data");
const auth_1 = require("./auth");
const wavesAuth_1 = require("./wavesAuth");
exports.validate = {
    transfer: transfer_1.transferValidator,
    massTransfer: mass_transfer_1.massTransferValidator,
    alias: alias_1.aliasValidator,
    issue: issue_1.issueValidator,
    reissue: reissue_1.reissueValidator,
    sponsorship: sponsorship_1.sponsorshipValidator,
    burn: burn_1.burnValidator,
    setAssetScript: set_asset_script_1.setAssetScriptValidator,
    cancelLease: cancel_lease_1.cancelLeaseValidator,
    data: data_1.dataValidator,
    lease: lease_1.leaseValidator,
    setScript: set_script_1.setScriptValidator,
    invokeScript: invoke_script_1.invokeValidator,
    exchange: exchange_1.exchangeValidator,
    cancelOrder: cancel_order_1.cancelOrderValidator,
    customData: custom_data_1.customDataValidator,
    order: order_1.orderValidator,
    wavesAuth: wavesAuth_1.authValidator,
    auth: auth_1.authValidator
};
//# sourceMappingURL=index.js.map