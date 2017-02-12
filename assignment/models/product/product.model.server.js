module.exports = function () {
    console.log("in product.model.server");

    var mongoose = require("mongoose");
    var DistSystemsProductSchema = require("./product.schema.server")();
    // var searchable = require('mongoose-searchable');
    var ProductModel = mongoose.model("ProductModel", DistSystemsProductSchema);
    var model = {};

    var api = {
        setModel: setModel,
        addProducts: addProducts,
        modifyProducts: modifyProducts,
        viewProducts: viewProducts
    };
    return api;
    
    function viewProducts(payload){
        var asin = payload.asin;
        var keyword = payload.keyword;
        var group = payload.group;

        // console.log(keyword);

        return ProductModel
            // .find({$or:[{productName:{'$regex': keyword, '$options': 'i'}}, {productDescription:{'regex': keyword, '$options': 'i'}}]})
            .find({productName:{"$regex": keyword, "$options": "i"}})
            .where('group').equals(group)
            .where('asin').equals(asin);
        
        // return ProductModel
        //     .find({$or:[{asin:"BOX000"}, {asin:'COHDI'}]});
    }
    
    function modifyProducts(product){
        return ProductModel.update({asin: product.username}, {ProductName: product.ProductName, ProductDescription: product.ProductDescription});
    }
    
    function addProducts(product){
        console.log(product);
        return ProductModel.create(product);
    }

    function setModel(_model) {
        model = _model;
    }

};