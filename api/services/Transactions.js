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
            type: String
        },
        refId: String,

        amount: String,
    },
    type: String
});
schema.index({
    type: 1,
    "transaction.id": 1
}, {
    unique: true
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
                Sessions.sessionExists(data, callback);
            },
            // function (arg, callback) {
            //     if (arg.status == 'OK') {
            //         Sessions.checkUser(data, function (err, userData) {
            //             if (err) {
            //                 console.log("user does not exist");
            //                 var responseData = {}
            //                 responseData.status = "INVALID_PARAMETER";
            //                 callback(err, responseData);
            //             } else {
            //                 console.log("user", userData);
            //                 callback(null, 'found');
            //             }
            //         });
            //     } else {
            //         console.log("inside else");
            //         // var responseData = {}
            //         // responseData.status = 'INVALID_SID';
            //         callback('error', arg);
            //     }
            // },
            function (arg, callback) {
                if (arg.status == 'OK') {
                    Transactions.txExists(data, function (err, txData) {
                        if (err) {
                            console.log("Transactions does not exist");
                            var responseData = {}
                            responseData.status = 'UNKNOWN_ERROR';
                            callback(err, responseData);
                        } else {
                            console.log("Transactions", txData);
                            if (_.isEmpty(txData))
                                callback(null, 'notFound');
                            else {
                                var responseData = {}
                                responseData.status = 'BET_ALREADY_EXIST';
                                callback('BET_ALREADY_EXIST', responseData);
                            }
                        }
                    });
                } else {
                    console.log("inside else");
                    // var responseData = {}
                    // responseData.status = 'INVALID_SID';
                    callback('error', arg);
                }
            },
            function (arg, callback) {
                data.type = "debit";
                Transactions.saveData(data, function (err, savedData) {
                    if (err) {
                        var responseData = {}
                        responseData.status = 'UNKNOWN_ERROR';
                        callback(err, responseData);
                    } else if (savedData) {
                        callback(null, "saved");
                    }
                });
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
                console.log("result--- debit", result);
                callback(null, result);
            }
        });
    },
    creditWallet: function (data, callback) {
        console.log("creditWallet----", data);
        async.waterfall([
            function (callback) {
                Sessions.sessionExists(data, callback);
            },
            // function (arg, callback) {
            //     if (arg.status == 'OK') {
            //         Sessions.checkUser(data, function (err, userData) {
            //             if (err) {
            //                 console.log("user does not exist");
            //                 var responseData = {}
            //                 responseData.status = "INVALID_PARAMETER";
            //                 callback(err, responseData);
            //             } else {
            //                 console.log("user", userData);
            //                 callback(null, 'found');
            //             }
            //         });
            //     } else {
            //         // var responseData = {}
            //         // responseData.status = 'INVALID_SID';
            //         callback('error', arg);
            //     }
            // },
            function (arg, callback) {
                if (arg.status == 'OK') {
                    Transactions.txExists(data, function (err, txData) {
                        if (err) {
                            console.log("Transactions does not exist");
                            var responseData = {}
                            responseData.status = 'UNKNOWN_ERROR';
                            callback(err, responseData);
                        } else {
                            console.log("Transactions", txData);
                            if (_.isEmpty(txData))
                                callback(null, 'notFound');
                            else {
                                var responseData = {}
                                responseData.status = 'BET_ALREADY_SETTLED';
                                callback('BET_ALREADY_SETTLED', responseData);
                            }
                        }
                    });
                } else {
                    // var responseData = {}
                    // responseData.status = 'INVALID_SID';
                    callback('error', arg);
                }
            },
            function (arg, callback) {
                Transactions.findOne({
                    "transaction.refId": data.transaction.refId,
                    type: 'debit'
                }).exec(function (err, found) {
                    if (err) {
                        var responseData = {}
                        responseData.status = 'UNKNOWN_ERROR';
                        callback(err, responseData);
                    } else {
                        if (_.isEmpty(found)) {
                            var responseData = {}
                            responseData.status = 'BET_DOES_NOT_EXIST';
                            callback('BET_DOES_NOT_EXIST', responseData);
                        } else
                            callback(null, 'found');
                    }
                });
            },
            function (arg, callback) {
                // if (arg == 'found') {
                data.type = "credit";
                Transactions.saveData(data, function (err, savedData) {
                    if (err) {
                        var responseData = {}
                        responseData.status = 'UNKNOWN_ERROR';
                        callback(err, responseData);
                    } else if (savedData) {
                        callback(null, "saved");
                    }
                });
                // } else {
                //     var responseData = {}
                //     responseData.status = 'BET_DOES_NOT_EXIST';
                //     callback('BET_DOES_NOT_EXIST', responseData);
                // }
            },
            // function (arg1, callback) {
            //     data.api = 'winMoney';
            //     data.amount = data.transaction.amount;
            //     data.subGame = data.game.type;
            //     Transactions.winLooseApi(data, function (err, userData) {
            //         if (err) {
            //             console.log("user does not exist");
            //             var responseData = {}
            //             responseData.status = "INVALID_PARAMETER";
            //             callback(null, responseData);
            //         } else {
            //             // console.log("user", userData);
            //             callback(null, userData);
            //         }
            //     });
            // },
            function (balance, callback) {
                console.log('inside balance')
                Sessions.balanceWallet(data, function (err, userData) {
                    if (err) {
                        console.log("user does not exist");
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else {
                        // console.log("user", userData);
                        callback(null, userData);
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                callback(null, result);
            } else {
                console.log("result--- credit", result);
                callback(null, result);
                async.parallel({
                    allDebits: function (callback) {
                        model.getDebit(data, callback);
                    },
                    allCredits: function (callback) {
                        model.getCredit(data, callback);
                    }
                }, function (err, diffData) {
                    if (err) {
                        console.log("error in diffData");
                    } else {
                        console.log("diffData", diffData);

                        var difference = Number(diffData.allCredits) - Number(diffData.allDebits);
                        data.api = 'winMoney';
                        data.amount = data.transaction.amount;
                        data.subGame = data.game.type;
                        data.difference = Number(difference);
                        console.log("diffData---data----", data);

                        Transactions.winLooseApi(data, function (err, userData) {
                            if (err) {
                                console.log("user does not exist");

                            } else {
                                console.log("user", userData);
                            }
                        });
                    }
                });
            }
        });
    },
    cancelWallet: function (data, callback) {
        async.waterfall([
                function (callback) {
                    Sessions.sessionExists(data, callback);
                },
                // function (arg, callback) {
                //     if (arg.status == 'OK') {
                //         Sessions.checkUser(data, function (err, userData) {
                //             if (err) {
                //                 console.log("user does not exist");
                //                 var responseData = {}
                //                 responseData.status = "INVALID_PARAMETER";
                //                 callback(null, responseData);
                //             } else {
                //                 // console.log("user", userData);
                //                 callback(null, 'found');
                //             }
                //         });
                //     } else {
                //         // var responseData = {}
                //         // responseData.status = 'INVALID_SID';
                //         callback('error', arg);
                //     }
                // },
                function (arg, callback) {
                    if (arg.status == 'OK') {
                        Transactions.txExists(data, function (err, txData) {
                            if (err) {
                                console.log("Transactions does not exist");
                                var responseData = {}
                                responseData.status = 'UNKNOWN_ERROR';
                                callback(err, responseData);
                            } else {
                                console.log("Transactions", txData);
                                if (!_.isEmpty(txData) && txData.type == 'debit')
                                    callback(null, 'found');
                                else {
                                    var responseData = {}
                                    responseData.status = 'BET_DOES_NOT_EXIST';
                                    callback('BET_DOES_NOT_EXIST', responseData);
                                }
                            }
                        });
                    } else {
                        // var responseData = {}
                        // responseData.status = 'INVALID_SID';
                        callback('error', arg);
                    }
                },
                function (arg, callback) {
                    data.type = "cancel";
                    Transactions.saveData(data, function (err, savedData) {
                        if (err) {
                            var responseData = {}
                            console.log('err-->>>>>>>>>>>>>', err);
                            if (err.toString().includes('ValidationError')) {
                                responseData.status = 'BET_ALREADY_SETTLED';
                                console.log("err----- in saving transaction", err.toString().includes('transaction'));
                            } else
                                responseData.status = 'UNKNOWN_ERROR';
                            callback(err, responseData);
                        } else if (savedData) {
                            callback(null, "saved");
                        }
                    });
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
                Transactions.balanceSocket(transData);
            } else {
                console.log("empty", body);
                callback("empty", null);
            }
        });
    },
    txExists: function (data, callback) {
        Transactions.findOne({
            "transaction.id": data.transaction.id
        }).exec(function (err, found) {
            if (err) {
                console.log('error');
                callback(err, {});
            } else if (found) {
                callback(null, found);
            } else {
                console.log('inside else');
                callback(null, {});
            }
        });
    },
    getDebit: function (data, callback) {
        Transactions.find({
            "game.id": data.game.id,
            "type": "debit"
        }).exec(function (err, found) {
            if (err || _.isEmpty(found)) {
                console.log('error');
                callback(err, {});
            } else {
                var sumAmt = _.sumBy(found, function (o) {
                    return Number(o.transaction.amount);
                });
                console.log("sumAmt", sumAmt);
                callback(null, sumAmt);
            }
        });
    },
    getCredit: function (data, callback) {
        Transactions.find({
            "game.id": data.game.id,
            "type": "credit"
        }).exec(function (err, found) {
            if (err || _.isEmpty(found)) {
                console.log('error');
                callback(err, {});
            } else {
                var sumAmt = _.sumBy(found, function (o) {
                    return Number(o.transaction.amount);
                });
                console.log("sumAmt", sumAmt);
                callback(null, sumAmt);
            }
        });
    },
    balanceSocket: function (transData) {
        console.log("inside balanceSocket transData.id", transData.id);
        request.post({
            url: global["env"].mainServer + 'AR/getCurrentBalance',
            body: transData,
            json: true
        }, function (error, response, body) {
            if (error || body.error) {
                console.log("error found", error)
                var responseData = {}
                responseData.status = "INVALID_PARAMETER";
                callback(null, responseData);
            } else {
                console.log("data found", body.data)
                var responseData = {}
                responseData.status = "OK";
                responseData.balance = body.data.balance.toFixed(2);
                sails.sockets.blast('balanceSocket' + transData.id, {
                    balance: body.data.balance.toFixed(2)
                });
                // callback(null, responseData);
            }
        });

    }


};
module.exports = _.assign(module.exports, exports, model);