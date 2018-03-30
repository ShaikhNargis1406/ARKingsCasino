var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
        Sessions.findOneAndUpdate({
            userId: data.userId,
            _id: data.sid,
            status: "Active"
        }, {
            status: "Inactive"
        }).exec(function (err, found) {
            console.log("error---data", err, found);
            if (err) {
                console.log('error');
                callback(err, null);
            } else if (found) {
                console.log(found);
                var newData = {}
                newData.userId = data.userId
                Sessions.saveData(newData, function (err, savedData) {
                    if (err) {
                        console.log("error occured");
                        callback(err, null);
                    } else {
                        var responseData = {}
                        responseData.status = "OK";
                        responseData.sid = savedData._id;
                        responseData.uuid = data.uuid;
                        callback(null, responseData);
                    }
                });

            }
            else{
                callback(null, {}); 
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);