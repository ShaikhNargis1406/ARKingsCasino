var schema = new Schema({
    sid: {
        type: Schema.Types.ObjectId,
        ref: 'Sessions'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    currency: {
        type: String,
    },
    game: {},
    transaction: {
        id: String,
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
                Sessions.find({
                    userId: data.userId,
                    _id: data.sid,
                    status: "Active"
                }).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else if (found) {
                        callback(null, 'found');
                    }
                });

            },
            function (arg1, callback) {
                if (arg1 == 'found') {
                    User.findOne({
                        _id: data.userId
                    }).exec(function (err, found) {
                        if (err) {
                            callback(err, null);
                        } else if (found && found.balance >= Number(data.transaction.amount)) {
                            found.balance = found.balance - Number(data.transaction.amount)
                            found.save(function (err, data) {
                                if (err) {
                                    console.log("error occured");
                                    callback(err, null);
                                } else {
                                    console.log("balance updated");
                                    callback(null, found.balance);
                                }
                            });
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback("Invalid amount", null);
                }
            },
            function (balance, callback) {
                if (balance!=null) {
                    Transactions.saveData(data, function (err, savedData) {
                        if (err) {
                            console.log("error occured");
                            callback(err, null);
                        } else if (savedData) {
                            callback(null, balance);
                        }
                    });
                } else {
                    callback("Invalid amount", null);
                }

            }
        ], function (err, result) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                var responseData = {}
                responseData.status = "OK";
                responseData.balance = result;
                responseData.bonus = 1.00;
                responseData.uuid = data.uuid;
                callback(null, responseData);
            }
        });
    },
    creditWallet: function (data, callback) {
        async.waterfall([
            function (callback) {
                Sessions.find({
                    userId: data.userId,
                    _id: data.sid,
                    status: "Active"
                }).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else if (found) {
                        callback(null, 'found');
                    }
                });

            },
            function (arg1, callback) {
                User.findOne({
                    _id: data.userId
                }).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else if (found) {
                        found.balance = found.balance + Number(data.transaction.amount)
                        found.save(function (err, data) {
                            if (err) {
                                console.log("error occured");
                                callback(err, null);
                            } else {
                                console.log("balance updated");
                                callback(null, found.balance);
                            }
                        });
                    }
                });
            },
            function (balance, callback) {
                Transactions.saveData(data, function (err, savedData) {
                    if (err) {
                        console.log("error occured");
                        callback(err, null);
                    } else if (savedData) {
                        callback(null, balance);
                    }
                });
            }
        ], function (err, result) {

            if (err) {
                console.log(err);
                callback(err, null);
                
            } else {
                var responseData = {}
                responseData.status = "OK";
                responseData.balance = result;
                responseData.bonus = 1.00;
                responseData.uuid = data.uuid;
                callback(null, responseData);
            }
        });
    },
    cancelWallet: function (data, callback) {
        async.waterfall([
            function (callback) {
                Sessions.find({
                    userId: data.userId,
                    _id: data.sid,
                    status: "Active"
                }).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else if (found) {
                        callback(null, 'found');
                    }
                });

            },
            function (arg1, callback) {
                User.findOne({
                    _id: data.userId
                }).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else if (found) {
                        found.balance = found.balance + Number(data.transaction.amount)
                        found.save(function (err, data) {
                            if (err) {
                                console.log("error occured");
                                callback(err, null);
                            } else {
                                console.log("balance updated");
                                callback(null, found.balance);
                            }
                        });
                    }
                });
            },
            function (balance, callback) {
                Transactions.saveData(data, function (err, savedData) {
                    if (err) {
                        console.log("error occured");
                        callback(err, null);
                    } else if (savedData) {
                        callback(null, balance);
                    }
                });
            }
        ], function (err, result) {

            if (err) {
                console.log(err);
            } else {
                var responseData = {}
                responseData.status = "OK";
                responseData.balance = result;
                responseData.bonus = 1.00;
                responseData.uuid = data.uuid;
                callback(null, responseData);
            }
        });
    }


};
module.exports = _.assign(module.exports, exports, model);