module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var request = require('request');
var controller = {
    check: function (req, res) {
        if (req.body && req.body.userId) {
            Sessions.checksession(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    sid: function (req, res) {
        if (req.body && req.body.userId) {
            Sessions.checksession(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    balance: function (req, res) {
        if (req.body && req.body.userId) {
            User.balanceWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    debit: function (req, res) {
        if (req.body && req.body.userId) {
            Transactions.debitWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    credit: function (req, res) {
        if (req.body && req.body.userId) {
            Transactions.creditWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    cancel: function (req, res) {
        if (req.body && req.body.userId) {
            Transactions.cancelWallet(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    }
};
module.exports = _.assign(module.exports, controller);