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
  
};
module.exports = _.assign(module.exports, exports, model);