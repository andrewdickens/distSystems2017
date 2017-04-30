module.exports = function () {
    console.log("in purchases.model.server");

    var mongoose = require("mongoose");
    var DistSystemsPurchasesSchema = require("./purchases.schema.server.js")();
    var PurchasesModel = mongoose.model("PurchasesModel", DistSystemsPurchasesSchema);
    var model = {};

    var api = {
        setModel: setModel,
        buyProducts: buyProducts,
        productsPurchased: productsPurchased
        // addProducts: addProducts,
        // modifyProducts: modifyProducts,
        // viewProducts: viewProducts,
        // isUniqueASIN: isUniqueASIN,
        // removeAll: removeAll
    };
    return api;
    
    function productsPurchased(username){
        return PurchasesModel.find({username:username});
    }
    
    function buyProducts(payload){
        console.log("in buyProducts");
        console.log(payload.asins[0]);
        console.log(payload);

        var asinArray = [];

        for(var x=0; x<payload.asins.length; x++){
            console.log("in loop");
            console.log(payload.asins[x].asin);
            asinArray.push(payload.asins[x].asin);
        }
        console.log(asinArray);

        return PurchasesModel.create({username: payload.username, asins: asinArray});
    }

    function setModel(_model) {
        model = _model;
    }

};