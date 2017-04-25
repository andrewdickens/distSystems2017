module.exports = function () {
    console.log("in recommendations.schema.server");

    var mongoose = require("mongoose");
    // var searchable = require('mongoose-searchable');
    
    var DistSystemsRecommendationsSchema = mongoose.Schema(
        {
            asin: String,
            recommendations:[{asin: String, count : Number}]
        },
        {collection: "distSystemsRecommendations"});
    
    return DistSystemsRecommendationsSchema;
};
