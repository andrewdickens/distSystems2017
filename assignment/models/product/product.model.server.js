module.exports = function () {
    console.log("in product.model.server");

    var mongoose = require("mongoose");
    var DistSystemsProductSchema = require("./product.schema.server")();
    var ProductModel = mongoose.model("ProductModel", DistSystemsProductSchema);
    var model = {};

    var api = {
        setModel: setModel,
        addProducts: addProducts
    };
    return api;
    
    function addProducts(product){
        return ProductModel.create(product);
    }

    function setModel(_model) {
        model = _model;
    }

};