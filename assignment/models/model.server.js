module.exports = function () {
    console.log("in model.server");

    var mongoose = require('mongoose');
   mongoose.connect('mongodb://localhost/DistSystems-Spring-2017');
   //   mongoose.connect('mongodb://user:user@ds137149.mlab.com:37149/distsystemsspring2017');

    // mongoose.connect('mongodb://root:mCjEkPqFmdk6@ec2-54-191-160-5.us-west-2.compute.amazonaws.com');

    var userModel = require("./user/user.model.server")();
    var productModel = require("./product/product.model.server")();
    var purchasesModel = require("./purchases/purchases.model.server")();
    var recommendationsModel = require("./recommendations/recommendations.model.server")();

    var model = {
        userModel: userModel,
        productModel: productModel,
        purchasesModel: purchasesModel,
        recommendationsModel: recommendationsModel
    };

    userModel.setModel(model);
    productModel.setModel(model);
    purchasesModel.setModel(model);
    recommendationsModel.setModel(model);
    
    return model;

};
