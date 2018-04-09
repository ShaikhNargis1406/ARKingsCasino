module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var request = require('request');

var controller = {
    check: function (req, res) {
        if (req.body && req.body.userId ) {
            User.checksession(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    },
    sid: function (req, res) {
        if (req.body && req.body.userId ) {
            User.createSid(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    },
    balance: function (req, res) {
        if (req.body && req.body.userId ) {
            User.balanceWallet(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    },
    debit: function (req, res) {
        if (req.body && req.body.userId ) {
            Transactions.debitWallet(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    },
    credit: function (req, res) {
        if (req.body && req.body.userId ) {
            Transactions.creditWallet(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    },
    cancel: function (req, res) {
        if (req.body && req.body.userId ) {
            Transactions.cancelWallet(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    }
};
module.exports = _.assign(module.exports, controller);