(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($location, UserService) {
        var vm = this;
        
        vm.logout = logout;
        vm.add = addition;
        vm.divide = divide;
        vm.multiply = multiply;
        vm.logout = logout;

        function init(string) {
            vm.resultValue = string;
        }init();
        
        function addition(var1, var2, loggedIn) {

            UserService.addition(parseInt(var1), parseInt(var2), loggedIn)
                .success(function(result){
                    console.log(result);
                });
        }

        function multiply(var1, var2, loggedIn) {

            UserService.multiply(parseInt(var1), parseInt(var2), loggedIn)
                .success(function(result){
                    console.log(result);
                });

        }

        function divide(var1, var2, loggedIn) {
            console.log(var1);

            UserService.divide(parseInt(var1), parseInt(var2), loggedIn)
                .success(function(result){
                    console.log(result);
                });
        }

        function logout() {
            UserService.logout()
                .success(function (result) {
                    console.log(result);
                    $location.url("/login");
                });
        }
    }
})();

