module.exports = function () {
    console.log("in recommendations.model.server");

    var mongoose = require("mongoose");
    var DistSystemsRecommendationsSchema = require("./recommendations.schema.server.js")();
    var RecommendationsModel = mongoose.model("RecommendationsModel", DistSystemsRecommendationsSchema);
    var model = {};

    var api = {
        setModel: setModel,
        createRecommendations: createRecommendations,
        findRecommendations: findRecommendations
    };
    return api;
    
    function findRecommendations(asin){
        return RecommendationsModel.find({asin:asin});
    }

    function createRecommendations(payload){
        var asins = payload.asins;
        for(i=0; i<asins.length; i++){
            var recommendedAsins = [];
            for(x=0; x<asins.length; x++){
                if(asins[x]!=asins[i]){
                    recommendedAsins.push(asins[x])
                }
            }
            return createRecommendation(asins[i], recommendedAsins);
        }
    }

    function createRecommendation(asin, recommendedAsins){
        RecommendationsModel.find(asin)
            .then(function(result){
                if(result==null||[]){
                    var recommended = [];
                    for(i=0; i<recommendedAsins.length; i++){
                        var recommend = {asin:recommendedAsins[i], count: 1};
                        recommended.push(recommend);
                    }
                    var newRecommendation = {asin:asin, recommendations:recommended};
                    return RecommendationsModel.create(newRecommendation);
                }else return updateRecommendations(result, recommendedAsins);
            });
    }

    function updateRecommendations(result, recommendedAsins){
        for(i=0; i<result.recommendations.length; i++){
            for(x=0; x<recommendedAsins.length; x++){
                if(recommendedAsins[x]==result.asins[i]){
                    result.asin.count++;
                    break;
                }
            }
        }
        RecommendationsModel.remove({asin:result.asin});
        return RecommendationsModel.create(result);
    }

    function setModel(_model) {
        model = _model;
    }

};