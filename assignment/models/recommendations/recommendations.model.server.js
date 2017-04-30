module.exports = function () {
    console.log("in recommendations.model.server");

    var mongoose = require("mongoose");
    var DistSystemsRecommendationsSchema = require("./recommendations.schema.server.js")();
    var RecommendationsModel = mongoose.model("RecommendationsModel", DistSystemsRecommendationsSchema);
    var model = {};

    var api = {
        setModel: setModel,
        createRecommendations: createRecommendations,
        findRecommendations: findRecommendations,
        createNewRecommendation: createNewRecommendation,
        editRecommendation: editRecommendation,
        matchRecommendations: matchRecommendations
    };
    return api;

    function editRecommendation(asin, payload, result) {
        console.log("in edit Recommendation");

        console.log(payload);
        console.log(asin);
        console.log(result);
        var bool = false;

        for (var x = 0; x < payload.asins.length; x++) {
            for (var y = 0; y < result.recommendations.length; y++) {
                if (payload.asins[x].asin == result.recommendations[y].asin) {
                    result.recommendations[y].count++;
                    bool = true;
                }
            }
        }

        if(bool==false){
            return createNewRecommendation(asin, payload);
        }

        return RecommendationsModel.update({_id: result._id}, result);
    }

    function createNewRecommendation(asin, payload) {
        console.log("in createNewRecommendation");
        var recArray = [];

        for (var x = 0; x < payload.asins.length; x++) {
            if (payload.asins[x].asin != asin.asin) {
                recArray.push({asin: payload.asins[x].asin.toString(), count: 1});
            }
        }
        var returnValue = {asin: asin.asin.toString(), recommendations: recArray};
        console.log(returnValue);

        return RecommendationsModel.create(returnValue);
    }

    function findRecommendations(asin) {
        console.log("in find recommendations");
        console.log(asin);

        return RecommendationsModel.find({asin: asin.asin});
    }

    function matchRecommendations(asin, payload) {
        console.log("in matchRecommendations");
        console.log(asin);

        var json = {asin:asin.asin, recommendations:[]};

        payload.asins.forEach(function(products){
            if(products.asin != asin.asin){
                console.log(products.asin);
                console.log(asin.asin);
                json.recommendations.push(products);
            }
        });

        console.log(json);

        return RecommendationsModel.find(json);
    }

    function createRecommendations(payload) {
        console.log("payload is " + payload);

        var asins = payload.asins;
        for (i = 0; i < asins.length; i++) {
            var recommendedAsins = [];
            for (x = 0; x < asins.length; x++) {
                if (asins[x] != asins[i]) {
                    recommendedAsins.push(asins[x])
                }
            }
            return createRecommendation(asins[i], recommendedAsins);
        }
    }

    function createRecommendation(asin, recommendedAsins) {
        RecommendationsModel.find(asin)
            .then(function (result) {
                if (result == null || []) {
                    var recommended = [];
                    for (i = 0; i < recommendedAsins.length; i++) {
                        var recommend = {asin: recommendedAsins[i], count: 1};
                        recommended.push(recommend);
                    }
                    var newRecommendation = {asin: asin, recommendations: recommended};
                    return RecommendationsModel.create(newRecommendation);
                } else return updateRecommendations(result, recommendedAsins);
            });
    }

    function updateRecommendations(result, recommendedAsins) {
        for (i = 0; i < result.recommendations.length; i++) {
            for (x = 0; x < recommendedAsins.length; x++) {
                if (recommendedAsins[x] == result.asins[i]) {
                    result.asin.count++;
                    break;
                }
            }
        }
        RecommendationsModel.remove({asin: result.asin});
        return RecommendationsModel.create(result);
    }

    function setModel(_model) {
        model = _model;
    }

};