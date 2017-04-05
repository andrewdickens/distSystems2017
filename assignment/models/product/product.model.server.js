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
        isUniqueASIN: isUniqueASIN,
        removeAll: removeAll
    };
    return api;

    function removeAll(){
        return ProductModel.remove({});
    }

    function isUniqueASIN(product) {
        console.log(product.asin);
        // console.log(ProductModel.findOne({asin:product.asin}));
        return ProductModel.find({asin: product.asin});
    }

    function noValues(asin, keyword, group) {
        return asin == undefined && keyword == undefined && group == undefined;
    }

    function groupOnly(asin, keyword, group) {
        return asin == undefined && keyword == undefined && group != undefined;
    }

    function asinOnly(asin, keyword, group) {
        return group == undefined && keyword == undefined && asin != undefined;
    }

    function productName(asin, keyword, group) {
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
        var productName = payload.productName;
        var group = payload.group;

        console.log("asin is " + asin);

        if (noValues(asin, productName, group)) {
            return ProductModel
                .find({});
        } else if (groupOnly(asin, productName, group)) {
            return ProductModel
                .find({group: group})
        } else if (asinOnly(asin, productName, group)) {
            return ProductModel
                .find({asin: asin});
        } else if (productName(asin, productName, group)) {
            console.log("in keyword only");
            console.log(productName);
            return ProductModel
                .find({
                    $or: [{
                        productName: {
                            '$regex': productName,
                            '$options': 'i'
                        }
                    }, {productDescription: {'$regex': productName, '$options': 'i'}}]
                });
        } else if (groupAndAsin(asin, productName, group)) {
            return ProductModel
                .find({$and: [{group: group, asin: asin}]});
        } else if (groupAndKeyword(asin, productName, group)) {
            return ProductModel
                .find({
                    $and: [{
                        $or: [{
                            productName: {
                                '$regex': productName,
                                '$options': 'i'
                            }
                        }, {productDescription: {'$regex': productName, '$options': 'i'}}]
                    }, {group: group}]
                });
        } else if (asinAndKeyword(asin, productName, group)) {
            return ProductModel
                .find({
                    $and: [{
                        $or: [{
                            productName: {
                                '$regex': productName,
                                '$options': 'i'
                            }
                        }, {productDescription: {'$regex': productName, '$options': 'i'}}]
                    }, {asin: asin}]
                });
        } else return ProductModel
            .find({
                $and: [{
                    $or: [{
                        productName: {
                            '$regex': productName,
                            '$options': 'i'
                        }
                    }, {productDescription: {'$regex': productName, '$options': 'i'}}]
                }, {group: group}, {asin: asin}]
            });
    }

    function modifyProducts(product) {
        console.log("product name is " + product.productName);
        return ProductModel
            .findOneAndUpdate({asin: product.asin}, {
                productName: product.productName,
                productDescription: product.productDescription
        });
    }

    function addProducts(product) {
        console.log("product name is " + product.productName);
        return ProductModel.create(product);
    }

    function setModel(_model) {
        model = _model;
    }

};