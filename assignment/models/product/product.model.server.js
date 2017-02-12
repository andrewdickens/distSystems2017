module.exports = function () {
    console.log("in product.model.server");

    var mongoose = require("mongoose");
    var DistSystemsProductSchema = require("./product.schema.server")();
    var ProductModel = mongoose.model("ProductModel", DistSystemsProductSchema);
    var model = {};

    var api = {
        setModel: setModel,
        addProducts: addProducts,
        modifyProducts: modifyProducts,
        viewProducts: viewProducts,
        isUniqueASIN: isUniqueASIN
    };
    return api;

    function isUniqueASIN(product) {
        return ProductModel.findOne({asin: product.asin});
    }

    function noValues(asin, keyword, group){
        return asin == undefined && keyword == undefined && group == undefined;
    }

    function groupOnly(asin, keyword, group) {
        return asin == undefined && keyword == undefined && group != undefined;
    }

    function asinOnly(asin, keyword, group) {
        return group == undefined && keyword == undefined && asin != undefined;
    }

    function keywordOnly(asin, keyword, group) {
        return group == undefined && asin == undefined && keyword != undefined;
    }

    function groupAndAsin(asin, keyword, group) {
        return group != undefined && asin != undefined && keyword == undefined;
    }

    function groupAndKeyword(asin, keyword, group) {
        return group != undefined && asin == undefined && keyword != undefined;
    }

    function asinAndKeyword(asin, keyword, group) {
        return group == undefined && asin != undefined && keyword != undefined;
    }

    function viewProducts(payload) {
        var asin = payload.asin;
        var keyword = payload.keyword;
        var group = payload.group;

        console.log(asin);

        if(noValues(asin, keyword, group)){
            return ProductModel
                .find({});
        }else if (groupOnly(asin, keyword, group)) {
            return ProductModel
                .find({group:group})
        } else if (asinOnly(asin, keyword, group)) {
            return ProductModel
                .find({asin: asin});
        } else if (keywordOnly(asin, keyword, group)) {
            return ProductModel
                .find({
                    $or: [{
                        productName: {
                            '$regex': keyword,
                            '$options': 'i'
                        }
                    }, {productDescription: {'$regex': keyword, '$options': 'i'}}]
                });
        } else if (groupAndAsin(asin, keyword, group)) {
            return ProductModel
                .find({$and: [{group: group, asin: asin}]});
        } else if (groupAndKeyword(asin, keyword, group)) {
            return ProductModel
                .find({
                    $and: [{
                        $or: [{
                            productName: {
                                '$regex': keyword,
                                '$options': 'i'
                            }
                        }, {productDescription: {'$regex': keyword, '$options': 'i'}}]
                    }, {group: group}]
                });
        } else if (asinAndKeyword(asin, keyword, group)) {
            return ProductModel
                .find({
                    $and: [{
                        $or: [{
                            productName: {
                                '$regex': keyword,
                                '$options': 'i'
                            }
                        }, {productDescription: {'$regex': keyword, '$options': 'i'}}]
                    }, {asin: asin}]
                });
        } else return ProductModel
            .find({
                $and: [{
                    $or: [{
                        productName: {
                            '$regex': keyword,
                            '$options': 'i'
                        }
                    }, {productDescription: {'$regex': keyword, '$options': 'i'}}]
                }, {group: group}, {asin: asin}]
            });
    }

    function modifyProducts(product) {
        return ProductModel.update({asin: product.username}, {
            ProductName: product.ProductName,
            ProductDescription: product.ProductDescription
        });
    }

    function addProducts(product) {
        console.log(product);
        return ProductModel.create(product);
    }

    function setModel(_model) {
        model = _model;
    }

};