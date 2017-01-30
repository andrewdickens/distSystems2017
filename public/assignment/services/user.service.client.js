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
            return $http.post("/api/logout");
        }

        function login(username, password) {
            console.log("in login client service");
            var user = {
                username: username,
                password: password
            };
            console.log(user);
            return $http.post("/api/login", {
                username: username,
                password: password
            });
        }

        function addition(var1, var2, loggedIn) {
            var payload = {
                variable1: var1,
                variable2: var2,
                loggedIn: loggedIn
            };

            return $http.post("/api/add", payload)
        }

        function multiply(var1, var2, loggedIn) {
            var payload = {
                variable1: var1,
                variable2: var2,
                loggedIn: loggedIn
            };

            return $http.post("/api/multiply", payload)
        }

        function divide(var1, var2, loggedIn) {

            console.log("in divide");
            
            var payload = {
                variable1: var1,
                variable2: var2,
                loggedIn: loggedIn
            };

            console.log(payload);

            return $http.post("/api/divide", payload)
        }
    }
})();
