module.exports = function () {
    console.log("in user.schema.server");

    var mongoose = require("mongoose");
    var searchable = require('mongoose-searchable');
    
    var DistSystemsProductSchema = mongoose.Schema(
        {
            asin: String,
            productName: String,
            productDescription: String,
            group: [String]
        },
        {collection: "distSystemsProducts"});

    DistSystemsProductSchema.plugin(searchable,{
        keywordField:'keywords',
        language:'english',
        fields:['productName','productDescription'],
        extract: function(content, done){
            done(null, content.split(' '));
        }
    });

    return DistSystemsProductSchema;
};
