module.exports = function (app, model) {

    console.log("In user.service.server");

    var passport = require('passport');

    var JsonStrategy = require('passport-json').Strategy;


    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var lineReader = require('line-reader');

    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 900000}
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new JsonStrategy(jsonStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    app.post("/login", passport.authenticate('json'), login);
    app.post('/logout', logout);
    app.post('/add', addition);
    app.post('/multiply', multiply);
    app.post('/divide', divide);
    app.post('/registerUser', registerUser);
    app.post('/updateInfo', updateInfo);
    app.post('/addProducts', addProducts);
    app.post('/modifyProducts', modifyProducts);
    app.post('/viewUsers', viewUsers);
    app.post('/viewProducts', viewProducts);
    app.post('/addProductsJSON', addProductsJSON);
    app.post('/resetDatabase', resetDatabase);
    app.post('/buyProducts', buyProducts);
    app.post('/productsPurchased', productsPurchased);
    app.post('/getRecommendations', getRecommendations);

    function getRecommendations(req, res){
        if (isNotLoggedIn(req)) {
            res.json({message: 'You are not currently logged in'});
        } else model.recommendationsModel
            .findRecommendations(req.body)
            .then(function(result){
                if(result==null||[]){
                    res.json({message: 'There are no recommendations for that product'})
                } else res.json({}); //todo
            })
    }

    function productsPurchased(req, res) {
        if (isNotLoggedIn(req)) {
            res.json({message: 'You are not currently logged in'});
        } else model.userModel
            .isAdmin(req.user)
            .then(function (result) {
                if (result.admin != true) {
                    res.json({message: "You must be an admin to perform this action"});
                } else model.purchasesModel
                    .productsPurchased(req.user.username)
                    .then(function (result) {
                        if (result == null || []) {
                            res.json({message: 'There are no users that match that criteria'})
                        } else res.json({message: ''}); //todo

                    });
            });
    }

    function buyProducts(req, res) {
        var payload = {username: req.user.username, asins: req.body.products};

        if (isNotLoggedIn(req)) {
            console.log(req.user.username);
            res.json({message: 'You are not currently logged in'});
        } else model.productModel
            .findProducts(payload)
            .then(function (result) {
                if (result == false) {
                    res.json({message: 'There are no products that match that criteria'})
                } else model.purchasesModel
                    .buyProducts(payload)
                    .then(function (result) {
                        console.log(result);
                        model.recommendationsModel
                            .createRecommendations(payload)
                            .then(function(){
                                res.json({message: 'The action was successful'});
                            });
                        res.json({message: 'The action was successful'})
                    })
            });
    }

    function registerUser(req, res) {
        console.log("in register user");

        var user = req.body;

        model.userModel
            .findUser(user)
            .then(function (result) {
                console.log(result);
                if (result == null) {
                    if (allFields(user)) {
                        model.userModel
                            .createUser(user)
                            .then(function () {
                                    res.json({message: user.fname + " was registered successfully"})
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                });
                    } else res.json({message: "The input you provided is not valid"})
                } else res.json({message: "The input you provided is not valid"})
            });
    }

    function allFields(user) {
        return !((user.fname == "" || user.fname == undefined) ||
        (user.lname == "" || user.lname == undefined) ||
        (user.address == "" || user.address == undefined) ||
        (user.city == "" || user.city == undefined) ||
        (user.state == "" || user.state == undefined) ||
        (user.email == "" || user.email == undefined) ||
        (user.username == "" || user.username == undefined) ||
        (user.password == "" || user.password == undefined));
    }

    function updateInfo(req, res) {
        var user = req.user;
        var payload = req.body;

        if (isNotLoggedIn(req)) {
            console.log(req.user.username);
            res.json({message: 'You are not currently logged in'});
        } else model.userModel
            .updateInfo(user, "fname", payload.fname)
            .then(function () {
                model.userModel
                    .updateInfo(user, "lname", payload.lname)
                    .then(function () {
                        model.userModel
                            .updateInfo(user, "address", payload.address)
                            .then(function () {
                                model.userModel
                                    .updateInfo(user, "city", payload.city)
                                    .then(function () {
                                        model.userModel
                                            .updateInfo(user, "state", payload.state)
                                            .then(function () {
                                                model.userModel
                                                    .updateInfo(user, "zip", payload.zip)
                                                    .then(function () {
                                                        model.userModel
                                                            .updateInfo(user, "email", payload.email)
                                                            .then(function () {
                                                                model.userModel
                                                                    .findUsername(payload.username)
                                                                    .then(function (result) {
                                                                        if (result == null) {
                                                                            res.json({message: "The input you provided is not valid"});
                                                                        } else
                                                                            model.userModel
                                                                                .updateInfo(user, "username", payload.username)
                                                                                .then(function () {
                                                                                    model.userModel
                                                                                        .updateInfo(user, "password", payload.password)
                                                                                        .then(function () {
                                                                                            res.json({message: req.user.fname + " your information was successfully updated"})
                                                                                        })
                                                                                })
                                                                    })
                                                            })
                                                    })
                                            })
                                    })

                            })
                    })
            });
    }

    function addProducts(req, res) {
        var product = req.body;

        if (isNotLoggedIn(req)) {
            res.json({message: 'You are not currently logged in'});
        } else model.userModel
            .isAdmin(req.user)
            .then(function (result) {
                if (result.admin != true) {
                    res.json({message: "You must be an admin to perform this action"});
                } else model.productModel
                    .isUniqueASIN(product)
                    .then(function (result) {
                        console.log("in result");
                        console.log(result);
                        if (result == null || []) {
                            model.productModel
                                .addProducts(product)
                                .then(function () {
                                    res.json({message: product.productName + " was successfully added to the system"});
                                })
                        } else res.json({message: "The input you provided is invalid"});
                    });
            });
    }

    function isNotLoggedIn(req) {
        return req.user == undefined;
    }

    function modifyProducts(req, res) {
        var newProduct = req.body;

        if (isNotLoggedIn(req)) {
            res.json({message: 'You are not currently logged in'});
        } else model.userModel
            .isAdmin(req.user)
            .then(function (result) {
                if (result.admin != true) {
                    res.json({message: "You must be an admin to perform this action"})
                } else model.productModel
                    .isUniqueASIN(newProduct)
                    .then(function (result) {
                        console.log("the result of unique ASIN is " + result);
                        if (result != null) {
                            model.productModel
                                .modifyProducts(newProduct)
                                .then(function (result) {
                                    console.log(result);
                                    res.json({message: newProduct.productName + " was successfully updated"});
                                });
                        } else res.json({message: "The input you provided is invalid"});
                    });
            });


    }

    function viewUsers(req, res) {

        var searchParameters = req.body;

        if (isNotLoggedIn(req)) {
            res.json({message: 'You are not currently logged in'});
        } else model.userModel
            .isAdmin(req.user)
            .then(function (result) {
                if (result.admin != true) {
                    res.json({message: "You must be an admin to perform this action"});
                } else if (searchParameters.fname == undefined && searchParameters.lname == undefined) {
                    res.json({message: "There are no users that match that criteria"});
                } else model.userModel
                    .viewUsers(searchParameters)
                    .then(function (result) {
                        console.log(result);
                        var jsonResult = [];
                        var i;
                        if (result.length == 0) {
                            res.json({message: "There are no users that match that criteria"});
                        } else for (i = 0; i < result.length; i++) {
                            var jsonObject = {};
                            jsonObject.fname = result[i].fname;
                            jsonObject.lname = result[i].lname;
                            jsonObject.userId = result[i]._id;
                            jsonResult.push(jsonObject);
                        }
                        res.json({message: "The action was successful", user: jsonResult});
                    });
            })
    }

    function viewProducts(req, res) {

        var searchParameters = req.body;

        model.productModel
            .viewProducts(searchParameters)
            .then(function (result) {
                var jsonResult = [];
                var i;
                if (result.length == 0) {
                    res.json({message: "There are no products that match that criteria"})
                } else for (i = 0; i < result.length; i++) {
                    var jsonObject = {};
                    jsonObject.asin = result[i].asin;
                    jsonObject.productName = result[i].productName;
                    jsonResult.push(jsonObject);
                }
                res.json({product: jsonResult});
            });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                });
    }

    function logout(req, res) {
        if (req.user) {
            req.logout();
            res.json({message: "You have been successfully logged out"})
        } else res.json({message: "You are not currently logged in"});
    }

    function jsonStrategy(username, password, done) {

        model.userModel
            .findUsersByCredentials({username: username, password: password})
            .then(function (user) {
                    if (!user) {

                        var nullUser = {username: null, password: null};

                        return done(null, nullUser);
                    }
                    return done(null, user);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function login(req, res) {
        var user = req.user;

        if (user.username == null) {
            res.send({message: "There seems to be an issue with the username/password combination that you entered"});
        } else res.json({message: "Welcome " + user.fname});
    }

    function addition(req, res) {
        console.log(req.body);

        if (req.user) {

            if ((typeof parseInt(req.body.num1) != 'number') || (typeof parseInt(req.body.num2) != 'number')) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({
                message: "The action was successful",
                result: parseInt(req.body.num1) + parseInt(req.body.num2)
            });
        } else res.json({message: "You are not currently logged in"});
    }

    function multiply(req, res) {
        if (req.user) {
            console.log(req.body);

            if ((typeof parseInt(req.body.num1) != 'number') || (typeof parseInt(req.body.num2) != 'number')) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({
                message: "The action was successful",
                result: parseInt(req.body.num1) * parseInt(req.body.num2)
            });
        } else res.json({message: "You are not currently logged in"});
    }

    function divide(req, res) {

        if (req.user) {
            console.log(req.body);

            if ((typeof parseInt(req.body.num1) != 'number') || (typeof parseInt(req.body.num2) != 'number') || (parseInt(req.body.num2) == 0)) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({
                message: "The action was successful",
                result: parseInt(req.body.num1) / parseInt(req.body.num2)
            });
        } else res.json({message: "You are not currently logged in"});
    }

    function addProductsJSON(req, res) {

        var jsonRecord;
        var execute = true;

        var fileName = "productRecords.json";

        lineReader.eachLine(fileName, function (line, last) {
            var values = {}; //The records read from the file.

            execute = false;
            currentLine = line.toString();
            try {
                jsonRecord = JSON.parse(currentLine);
                console.log(jsonRecord);
                console.log(currentLine);

                values.productName = jsonRecord.title.trunc(100);
                // values.group = jsonRecord.categories;
                values.productDescription = jsonRecord.description;
                values.asin = jsonRecord.asin;

                console.log(values.productName);
                console.log(values.productDescription);
                console.log(jsonRecord.categories);
                var groupArray = [];

                groupArray.push(jsonRecord.categories[0][0]);

                for (var i = 0; i < jsonRecord.categories.length; i++) {
                    for (var x = 1; x < jsonRecord.categories[i].length; x++) {
                        // console.log(values.group[i][x]);
                        groupArray.push(jsonRecord.categories[i][x])
                    }
                }

                console.log(groupArray);

                values.group = groupArray;
                console.log(values);

                // console.log("The title before sending is " + values.productName);

                model.productModel
                    .addProducts(values)
                    .then(function () {
                        console.log("added product");
                    });
            }
            catch (err) {
                execute = false;//there was a quote in the text and the parse failed ... skip insert
                console.log("There was an error");
                console.log(err);
            }

        });
    }

    String.prototype.trunc = String.prototype.trunc ||
        function (n) {
            return (this.length > n) ? this.substr(0, n - 1) : this;
        };

    function resetDatabase(req, res) {
        model.productModel
            .removeAll()
            .then(function () {
                res.send(200);
            });

        model.userModel
            .removeAll()
            .then(function () {
                model.userModel.createUser({
                    "fname": "Jenny",
                    "lname": "Admin",
                    "address": "555 Tree Ave",
                    "city": "Tacoma",
                    "state": "WA",
                    "zip": "98111",
                    "email": "Jenny@gmail.com",
                    "username": "jadmin",
                    "password": "admin",
                    "admin": true
                })
                    .then(function () {
                        res.send(200);
                    })
            })
    }

};
