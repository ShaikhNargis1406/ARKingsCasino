var request = require('request');
const uuidv1 = require('uuid/v1');
var schema = new Schema({
    userId: String,
    sessionId: String,
    status: {
        type: String,
        default: "Active"
    }
});


schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Sessions', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "sessions", "sessions"));
var model = {
    balanceWallet: function (data, callback) {
        Sessions.findOne({
            sessionId: data.sid,
            status: "Active"
        }).exec(function (err, found) {
            if (err || _.isEmpty(found)) {
                console.log('error');
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            } else if (found) {
                var userData = {};
                userData.id = data.userId;
                request.post({
                    url: global["env"].mainServer + 'AR/getCurrentBalance',
                    body: userData,
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
                        responseData.uuid = data.uuid;
                        callback(null, responseData);
                    }
                });
            } else {
                console.log('inside else');
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            }
        })


    },
    createLoginSid: function (data, callback) {
        Sessions.findOne({
            userId: data.userId
        }).exec(function (err, found) {
            if (err) {
                console.log("error occured");
                var responseData = {}
                responseData.status = "INVALID_USERID";
                callback(null, responseData);
            } else if (found) {
                console.log("found", found);
                var responseData = {}
                responseData.status = "OK";
                responseData.sid = found.sessionId;
                callback(null, responseData);
            } else {
                console.log("data in else ", data);
                Sessions.checkUser(data, function (err, userData) {
                    if (err) {
                        console.log("user does not exist");
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else {
                        console.log("user", userData);
                        data.userId = data.userId
                        data.sessionId = uuidv1();
                        data.status = "Active"
                        Sessions.saveData(data, function (err, savedData) {
                            if (err) {
                                console.log("error occured");
                                var responseData = {}
                                responseData.status = "UNKNOWN_ERROR";
                                callback(null, responseData);
                            } else {
                                var responseData = {}
                                responseData.status = "OK";
                                responseData.sid = savedData.sessionId;
                                console.log("responseData", responseData);
                                callback(null, responseData);
                            }
                        });
                    }
                });
            }
        })
    },
    checksession: function (data, callback) {
        console.log("inside checksession ", data);
        Sessions.findOne({
            sessionId: data.sid,
            status: "Active"
        }).exec(function (err, found) {
            if (err) {
                console.log('error');
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            } else if (found) {
                console.log("found");
                if (found.userId == data.userId) {
                    var responseData = {}
                    responseData.status = "OK";
                    responseData.sid = found.sessionId;
                    responseData.uuid = data.uuid;
                    callback(null, responseData);
                } else {
                    console.log("user does not exist");
                    var responseData = {}
                    responseData.status = "INVALID_PARAMETER";
                    callback(null, responseData);
                }

                // Sessions.checkUser(data, function (err, userData) {
                //     if (err) {
                //         console.log("user does not exist");
                //         var responseData = {}
                //         responseData.status = "INVALID_PARAMETER";
                //         callback(null, responseData);
                //     } else {
                //         console.log("user", userData);
                //         found.sessionId = uuidv1();
                //         found.save(function (err, savedData) {
                //             if (err) {
                //                 console.log("error occured");
                //                 var responseData = {}
                //                 responseData.status = "UNKNOWN_ERROR";
                //                 callback(null, responseData);
                //             } else {
                //                 var responseData = {}
                //                 responseData.status = "OK";
                //                 responseData.sid = savedData.sessionId;
                //                 responseData.uuid = data.uuid;
                //                 callback(null, responseData);
                //             }
                //         });
                //     }
                // });
            } else {
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            }
        })
    },

    createSid: function (data, callback) {
        var userData = {};
        userData.accessToken = data.userId;
        request.post({
            url: global["env"].mainServer + 'member/getAccessLevel',
            body: userData,
            json: true
        }, function (error, response, body) {
            if (error) {
                var responseData = {}
                responseData.status = "INVALID_PARAMETER";
                callback(null, responseData);
            } else {
                console.log("body", body);
                Sessions.findOne({
                    userId: data.userId
                }).exec(function (err, found) {
                    if (err) {
                        console.log("error occured");
                        var responseData = {}
                        responseData.status = "INVALID_USERID";
                        callback(null, responseData);
                    } else if (found) {
                        console.log(found);
                        found.sessionId = uuidv1();
                        found.status = "Active"
                        found.save(function (err, savedData) {
                            if (err) {
                                console.log("error occured");
                                var responseData = {}
                                responseData.status = "UNKNOWN_ERROR";
                                callback(null, responseData);
                            } else {
                                var responseData = {}
                                responseData.status = "OK";
                                responseData.sid = savedData.sessionId;
                                responseData.uuid = data.uuid;
                                callback(null, responseData);
                            }
                        });
                    } else {

                        data.userId = data.userId
                        data.sessionId = uuidv1();
                        data.status = "Active"
                        Sessions.saveData(data, function (err, savedData) {
                            if (err) {
                                console.log("error occured");
                                var responseData = {}
                                responseData.status = "UNKNOWN_ERROR";
                                callback(null, responseData);
                            } else {
                                var responseData = {}
                                responseData.status = "OK";
                                responseData.sid = savedData.sessionId;
                                responseData.uuid = data.uuid;
                                console.log("responseData", responseData);
                                callback(null, responseData);
                            }
                        });
                    }
                })
            }
        });
    },
    checkUser: function (data, callback) {
        var userData = {};
        userData._id = data.userId;
        request.post({
            url: global["env"].mainServer + 'member/getOne',
            body: userData,
            json: true
        }, function (error, response, body) {
            if (error) {
                callback(error, null);
            } else if (body.data._id) {
                console.log("body", body.data);
                var responseData = {}
                responseData.status = "OK";
                callback(null, responseData);
            } else {
                console.log("empty");
                callback("empty", null);
            }
        });
    },
    sessionExists: function (data, callback) {
        Sessions.findOne({
            sessionId: data.sid,
            status: "Active"
        }).exec(function (err, found) {
            if (err || _.isEmpty(found)) {
                console.log('error');
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            } else if (found) {
                if (found.userId == data.userId) {
                    var responseData = {}
                    responseData.status = "OK";
                    callback(null, responseData);
                } else {
                    console.log("user does not exist");
                    var responseData = {}
                    responseData.status = "INVALID_PARAMETER";
                    callback(null, responseData);
                }

            } else {
                console.log('inside else');
                var responseData = {}
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            }
        })
    }

};
module.exports = _.assign(module.exports, exports, model);