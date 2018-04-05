module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var request = require('request');

var controller = {
    check: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            User.checksession(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    },
    sid: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            User.createSid(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    },
    balance: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            User.balanceWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    },
    debit: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            Transactions.debitWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    },
    credit: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            Transactions.creditWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    },
    cancel: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].apitoken) {
            Transactions.cancelWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AuthToken", null);
        }
    }
};
module.exports = _.assign(module.exports, controller);