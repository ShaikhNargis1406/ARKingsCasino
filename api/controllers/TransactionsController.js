module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var request = require('request');

var controller = {
    check: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            User.checksession(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    },
    sid: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            User.createSid(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    },
    balance: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            User.balanceWallet(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    },
    debit: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            Transactions.debitWallet(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    },
    credit: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            Transactions.creditWallet(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    },
    cancel: function (req, res) {
        if (req.body && req.body.userId && req.query.authToken==global["env"].authToken) {
            Transactions.cancelWallet(req.body, res.callback);
        } else {
            res.callback("INVALID_TOKEN_ID", null);
        }
    }
};
module.exports = _.assign(module.exports, controller);