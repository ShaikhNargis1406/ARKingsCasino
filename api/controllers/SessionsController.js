module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var request = require('request');
var controller = {
    createLoginSid: function (req, res) {
        if (req.body && req.body.userId) {
            Sessions.createLoginSid(req.body, res.callback);
        } else {
            var responseData = {}
            responseData.status = "INVALID_TOKEN_ID";
            res.callback(null, responseData);
        }
    }
};
module.exports = _.assign(module.exports, controller);