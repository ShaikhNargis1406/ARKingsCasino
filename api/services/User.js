const uuidv1 = require('uuid/v1');
var schema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    currency: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        validate: validators.isEmail()
    },
    sessionId: {
        type: String
    },
    status: String,
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    address: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    add: function () {
        var sum = 0;
        _.each(arguments, function (arg) {
            sum += arg;
        });
        return sum;
    },
    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                console.log(err);
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    /**
     * This function get all the media from the id.
     * @param {userId} data
     * @param {callback} callback
     * @returns  that number, plus one.
     */
    balanceWallet: function (data, callback) {
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
                User.findOne({
                    _id: data.userId,
                }).exec(function (err, foundUser) {
                    if (err) {
                        var responseData = {}
                        responseData.status = "INVALID_PARAMETER";
                        callback(null, responseData);
                    } else if (foundUser) {
                        // console.log("found.balance;",found)
                        var responseData = {}
                        responseData.status = "OK";
                        responseData.balance = foundUser.balance;
                        responseData.uuid = data.uuid;
                        callback(null, responseData);
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
    checksession: function (data, callback) {
        User.findOne({
            _id: data.userId,
            sessionId: data.sid,
            status: "Active"
        }).exec(function (err, found) {
            if (err) {
                console.log('error');
                callback(err, null);
            } else if (found) {
                console.log("found");
                found.sessionId = uuidv1();
                found.save(function (err, savedData) {
                    if (err) {
                        console.log("error occured");
                        callback('INVALID_PARAMETER', null);
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
                responseData.status = "INVALID_SID";
                callback(null, responseData);
            }
        })
    },
    createSid: function (data, callback) {
        User.findOne({
            _id: data.userId
        }).exec(function (err, found) {
            if (err) {
                console.log('error');
                callback(err, null);
            } else if (found) {
                console.log(found);
                found.sessionId = uuidv1();
                found.status = "Active"
                found.save(function (err, savedData) {
                    if (err) {
                        console.log("error occured");
                        callback('INVALID_PARAMETER', null);
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