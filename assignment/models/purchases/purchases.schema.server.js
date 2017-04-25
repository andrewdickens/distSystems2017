module.exports = function () {
    console.log("in user.schema.server");

    var mongoose = require("mongoose");
    // var searchable = require('mongoose-searchable');
    
    var DistSystemsPurchasesSchema = mongoose.Schema(
        {
            username: String,
            asins: [String]
        },
        {collection: "distSystemsPurchases"});

    // DistSystemsPurchasesSchema.plugin(searchable,{
    //     keywordField:'keywords',
    //     language:'english',
    //     fields:['productName','productDescription'],
    //     extract: function(content, done){
    //         done(null, content.split(' '));
    //     }
    // });

    return DistSystemsPurchasesSchema;
};
