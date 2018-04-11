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
    checksession: function (data, callback) {
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
                User.findOne({
                    _id: data.userId,
                }).exec(function (err, foundUser) {
                    if (err) {
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else if (foundUser) {
                        // console.log("found.balance;",found)
                        found.sessionId = uuidv1();
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
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    }
                });
            } else {
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
                console.log("found");
                User.findOne({
                    _id: data.userId,
                }).exec(function (err, foundUser) {
                    if (err) {
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else if (foundUser) {
                        // console.log("found.balance;",found)
                        found.sessionId = uuidv1();
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
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    }
                });
            } else {
                console.log(data);
                User.findOne({
                    _id: data.userId,
                }).exec(function (err, foundUser) {
                    if (err) {
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else if (foundUser) {
                        // console.log("found.balance;",found)
                        data.userId = data.userId
                        data.sessionId = uuidv1();
                        data.status = "Active"
                        Sessions.saveData(data, function (err, savedData) {
                            if (err) {
                                console.log("error occured");
                                var responseData = {}
                                responseData.status = "INVALID_PARAMETER";
                                callback(null, responseData);
                            } else {
                                var responseData = {}
                                responseData.status = "OK";
                                responseData.sid = savedData.sessionId;
                                callback(null, responseData);
                            }
                        });
                    } else {
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    }
                });

            }
        })

    },
    createSid: function (data, callback) {
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
                var responseData = {}
                responseData.status = "INVALID_USERID";
                callback(null, responseData);
            }
        })
    }

};
module.exports = _.assign(module.exports, exports, model);