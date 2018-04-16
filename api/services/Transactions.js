var schema = new Schema({
    sid: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    currency: {
        type: String,
    },
    game: {},
    transaction: {
        id: {
            type: String,
            unique: true
        },
        refId: String,

        amount: String,
    },
});

schema.plugin(deepPopulate, {
    populate: {
        'transactions': {
            select: '_id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Transactions', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "transactions", "transactions"));
var model = {
    debitWallet: function (data, callback) {
        async.waterfall([
            function (callback) {
                Sessions.findOne({
                    sessionId: data.sid,
                    status: "Active"
                }).exec(function (err, found) {
                    if (err) {
                        var responseData = {}
                        responseData.status = 'INVALID_SID';
                        callback(err, responseData);
                    } else if (found) {
                        callback(null, 'found');
                    } else {
                        var responseData = {}
                        responseData.status = 'INVALID_SID';
                        callback("INVALID_SID", responseData);
                    }
                });
            },
            function (arg, callback) {
                if (arg == 'found') {
                    Sessions.checkUser(data, function (err, userData) {
                        if (err) {
                            console.log("user does not exist");
                            var responseData = {}
                            responseData.status = "INVALID_PARAMETER";
                            callback(null, responseData);
                        } else {
                            console.log("user", userData);
                            callback(null, 'found');
                        }
                    });
                } else {
                    var responseData = {}
                    responseData.status = 'INVALID_SID';
                    callback('INVALID_SID', responseData);
                }
            },
            function (arg, callback) {
                if (arg == 'found') {
                    Transactions.saveData(data, function (err, savedData) {
                        if (err) {
                            var responseData = {}
                            if (err.toString().includes('transaction')) {
                                responseData.status = 'BET_ALREADY_EXIST';
                                console.log("err----- in saving transaction", err.toString().includes('transaction'));
                            } else
                                responseData.status = 'UNKNOWN_ERROR';
                            callback(err, responseData);
                        } else if (savedData) {
                            callback(null, "saved");
                        }
                    });
                } else {
                    var responseData = {}
                    responseData.status = 'INVALID_PARAMETER';
                    callback('INVALID_PARAMETER', responseData);
                }
            },
            function (arg1, callback) {
                data.api = 'loseMoney';
                data.amount = data.transaction.amount;
                data.subGame = data.game.type;
                Transactions.winLooseApi(data, function (err, userData) {
                    if (err) {
                        console.log("winLooseApi", err);
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback("error", responseData);
                    } else {
                        console.log("user", userData);
                        callback(null, userData);
                    }
                });
            },
            function (balance, callback) {
                Sessions.balanceWallet(data, function (err, userData) {
                    if (err) {
                        console.log("balanceWallet", err);
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else {
                        console.log("user", userData);
                        callback(null, userData);
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                // console.log(err);
                callback(null, result);
            } else {
                callback(null, result);
            }
        });
    },
    creditWallet: function (data, callback) {
        async.waterfall([
            function (callback) {
                Sessions.findOne({
                    sessionId: data.sid,
                    status: "Active"
                }).exec(function (err, found) {
                    if (err) {
                        var responseData = {}
                        responseData.status = 'INVALID_SID';
                        callback(err, responseData);
                    } else if (found) {
                        callback(null, 'found');
                    } else {
                        var responseData = {}
                        responseData.status = 'INVALID_SID';
                        callback('INVALID_SID', responseData);
                    }
                });

            },
            function (arg, callback) {
                if (arg == 'found') {
                    Sessions.checkUser(data, function (err, userData) {
                        if (err) {
                            console.log("user does not exist");
                            var responseData = {}
                            responseData.status = "INVALID_PARAMETER";
                            callback(null, responseData);
                        } else {
                            console.log("user", userData);
                            callback(null, 'found');
                        }
                    });
                } else {
                    var responseData = {}
                    responseData.status = 'INVALID_SID';
                    callback('INVALID_SID', responseData);
                }
            },
            function (arg, callback) {
                if (arg == 'found') {
                    Transactions.saveData(data, function (err, savedData) {
                        if (err) {
                            var responseData = {}
                            if (err.toString().includes('transaction')) {
                                responseData.status = ' BET_ALREADY_SETTLED';
                                console.log("err----- in saving transaction", err.toString().includes('transaction'));
                            } else
                                responseData.status = 'UNKNOWN_ERROR';
                            callback(err, responseData);
                        } else if (savedData) {
                            callback(null, "saved");
                        }
                    });
                } else {
                    var responseData = {}
                    responseData.status = 'INVALID_PARAMETER';
                    callback('INVALID_PARAMETER', responseData);
                }
            },
            function (arg1, callback) {
                data.api = 'winMoney';
                data.amount = data.transaction.amount;
                data.subGame = data.game.type;
                Transactions.winLooseApi(data, function (err, userData) {
                    if (err) {
                        console.log("user does not exist");
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else {
                        console.log("user", userData);
                        callback(null, userData);
                    }
                });
            },
            function (balance, callback) {
                console.log('inside balance')
                Sessions.balanceWallet(data, function (err, userData) {
                    if (err) {
                        console.log("user does not exist");
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else {
                        console.log("user", userData);
                        callback(null, userData);
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                callback(null, result);
            } else {

                callback(null, result);
            }
        });
    },
    cancelWallet: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Sessions.findOne({
                        sessionId: data.sid,
                        status: "Active"
                    }).exec(function (err, found) {
                        if (err) {
                            var responseData = {}
                            responseData.status = 'INVALID_SID';
                            callback(err, responseData);
                        } else if (found) {
                            callback(null, 'found');
                        } else {
                            var responseData = {}
                            responseData.status = 'INVALID_SID';
                            callback(err, responseData);
                        }
                    });
                },
                function (arg, callback) {
                    if (arg == 'found') {
                        Sessions.checkUser(data, function (err, userData) {
                            if (err) {
                                console.log("user does not exist");
                                var responseData = {}
                                responseData.status = "INVALID_PARAMETER";
                                callback(null, responseData);
                            } else {
                                // console.log("user", userData);
                                callback(null, 'found');
                            }
                        });
                    } else {
                        var responseData = {}
                        responseData.status = 'INVALID_SID';
                        callback('INVALID_SID', responseData);
                    }
                },
                function (arg, callback) {
                    if (arg == 'found') {
                        Transactions.saveData(data, function (err, savedData) {
                            if (err) {
                                var responseData = {}
                                if (err.toString().includes('transaction')) {
                                    responseData.status = ' BET_ALREADY_SETTLED';
                                    console.log("err----- in saving transaction", err.toString().includes('transaction'));
                                } else
                                    responseData.status = 'UNKNOWN_ERROR';
                                callback(err, responseData);
                            } else if (savedData) {
                                callback(null, "saved");
                            }
                        });
                    } else {
                        var responseData = {}
                        responseData.status = 'INVALID_PARAMETER';
                        callback('INVALID_PARAMETER', responseData);
                    }
                },
                function (arg1, callback) {
                    data.api = 'winMoney'
                    Transactions.winLooseApi(data, function (err, userData) {
                        if (err) {
                            console.log("user does not exist");
                            var responseData = {}
                            responseData.status = "INVALID_PARAMETER";
                            callback(null, responseData);
                        } else {
                            console.log("user", userData);
                            callback(null, userData);
                        }
                    });
                },
                function (balance, callback) {
                    Sessions.balanceWallet(data, function (err, userData) {
                        if (err) {
                            console.log("user does not exist");
                            var responseData = {}
                            responseData.status = "INVALID_PARAMETER";
                            callback(null, responseData);
                        } else {
                            console.log("user", userData);
                            callback(null, userData);
                        }
                    });
                }
            ],
            function (err, result) {
                if (err) {
                    callback(null, result);
                } else {
                    callback(null, result);
                }
            });
    },
    winLooseApi: function (data, callback) {
        var transData = {};
        transData.amount = data.transaction.amount;
        transData.subGame = data.game.type;
        transData.id = data.userId;
        console.log("transData", transData);

        request.post({
            url: global["env"].mainServer + 'AR/' + data.api,
            body: transData,
            json: true
        }, function (error, response, body) {
            if (error) {
                callback(error, null);
            } else if (body.data && body.data.transactionData) {
                console.log("body", body.data);
                var responseData = {}
                responseData.status = "OK";
                callback(null, responseData);
            } else {
                console.log("empty", body);
                callback("empty", null);
            }
        });
    }


};
module.exports = _.assign(module.exports, exports, model);