module.exports = function (app, model) {

    console.log("In user.service.server");

    var passport = require('passport');

    var JsonStrategy = require('passport-json').Strategy;


    var cookieParser = require('cookie-parser');
    var session = require('express-session');

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
    app.post('/register', register);
    app.post('/updateInfo', updateInfo);
    app.post('/addProducts', addProducts);
    app.post('/modifyProducts', modifyProducts);
    app.post('/viewUsers', viewUsers);
    app.post('viewProducts', viewProducts);


    function register(req, res) {
        var user = req.body;

        model.userModel
            .findUser(user)
            .then(function (result) {
                if (result == null) {
                    if (allFields(user)) {
                        if (result == false) {
                            model.userModel
                                .createUser(user)
                                .then(function (newUser) {
                                        res.json({message: "The action was successful"})
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    });
                        }
                    } else res.json({message: "The input you provided is not valid"})
                } else res.json({message: "The input you provided is not valid"})
            });
    }

    function allFields(user) {
        console.log("in all fields");

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

    }

    function addProducts(req, res) {

    }

    function modifyProducts(req, res) {

    }

    function viewUsers(req, res) {

    }

    function viewProducts(req, res) {

    }

    function serializeUser(user, done) {
        console.log("in serialize user");
        console.log(user);
        done(null, user);
    }

    function deserializeUser(user, done) {
        console.log("in deserialize user");
        console.log(user);
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
        console.log("inside json strategy");
        console.log(username);
        console.log(password);

        model.userModel
            .findUsersByCredentials({username: username, password: password})
            .then(function (user) {
                    console.log("user is " + user);
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
        console.log("in login");
        console.log(req.body);

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
};
