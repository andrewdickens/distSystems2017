(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            login: login,
            logout: logout,
            addition: addition,
            multiply: multiply,
            divide: divide
        };
        return api;

        function logout() {
            return $http.post("/logout");
        }

        function login(username, password) {
            console.log("in login client service");
            var user = {
                username: username,
                password: password
            };

            console.log(user);
            return $http.post("/login", {
                username: username,
                password: password
            });
        }

        // function login(username, password) {
        //     console.log("in login client service");
        //     var user = {
        //         username: username,
        //         password: password
        //     };
        //
        //     console.log(user);
        //     return $http({
        //         url: '/login',
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         data: '{username: ' + username + ', password: ' + password + '}'
        //     });
        // }

        function addition(var1, var2) {
            var payload = {
                variable1: var1,
                variable2: var2
            };

            return $http.post("/add", payload)
        }

        function multiply(var1, var2, loggedIn) {
            var payload = {
                variable1: var1,
                variable2: var2,
                loggedIn: loggedIn
            };

            return $http.post("/multiply", payload)
        }

        function divide(var1, var2) {

            console.log("in divide");

            var payload = {
                variable1: var1,
                variable2: var2};

            console.log(payload);

            return $http.post("/divide", payload)
        }
    }
})();
