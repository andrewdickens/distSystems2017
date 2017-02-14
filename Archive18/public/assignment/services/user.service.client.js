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
    
            return $http({
                url: '/login',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {username: username, password: password}
            });
        }

        function addition(var1, var2) {

            return $http({
                url: '/add',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {num1: var1, num2: var2}
            });
        }

        function multiply(var1, var2) {

            return $http({
                url: '/multiply',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {num1: var1, num2: var2}
            });
        }

        function divide(var1, var2) {

            return $http({
                url: '/divide',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {num1: var1, num2: var2}
            });
        }
    }
})();
