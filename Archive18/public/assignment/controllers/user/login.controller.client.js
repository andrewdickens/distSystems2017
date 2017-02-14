(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {

            UserService.login(username, password)
                .success(function (user) {
                    console.log(user);
                    console.log("in callback");
                    if (user.message == null) {
                        vm.error = "No such user";
                    } else {
                        console.log("in else");
                        $location.url("/functions");
                    }
                })
                .error(function () {
                });
        }
    }
})();