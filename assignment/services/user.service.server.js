module.exports = function (app, model) {

    console.log("In user.service.server");

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true,
        cookie:{maxAge:900000}
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    app.post("/api/login", passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post('/api/add', addition);
    app.post('/api/multiply', multiply);
    app.post('/api/divide', divide);


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

    function localStrategy(username, password, done) {
        console.log("inside local strategy");
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
        var user = req.user;

        if (user.username == null) {
            res.send({message: "There seems to be an issue with the username/passsword combination that you entered"});
        } else res.json({message: "Welcome " + user.firstName});
    }

    function addition(req, res) {
        if (req.user) {
            var payload = req.body;

            if ((typeof payload.variable1 != 'number') || (typeof payload.variable2 != 'number')) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({message: "The action was successful", result: payload.variable1 + payload.variable2});
        } else res.json({message: "You are not currently logged in"});
    }

    function multiply(req, res) {
        if (req.user) {
            var payload = req.body;
            console.log(payload);

            if ((typeof payload.variable1 != 'number') || (typeof payload.variable2 != 'number')) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({message: "The action was successful", result: +payload.variable1 * +payload.variable2});
        } else res.json({message: "You are not currently logged in"});
    }

    function divide(req, res) {
        if (req.user) {
            var payload = req.body;
            console.log(payload);

            if ((typeof payload.variable1 != 'number') || (typeof payload.variable2 != 'number') || (payload.variable2==0)) {
                res.send({message: "The numbers you entered are not valid"});
            } else res.send({message: "The action was successful", result: +payload.variable1 / +payload.variable2});
        } else res.json({message: "You are not currently logged in"});
    }
};
