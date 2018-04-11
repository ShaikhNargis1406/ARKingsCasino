myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
        var formData = {
            "_id": "5ac6004c1a0af615256f7b1f",
            "update": true,
            "firstName": "Harsh",
            "lastName": "Chheda",
            "nickname": "Harsh",
            "country": "HK",
          "language": "hk",
          "currency": "HKD",
            "sessionId": "688c2030-3d4d-11e8-8d79-590a17b8bf5f",
            "game":"roulette"
        }
        $scope.template = TemplateService.getHTML("content/home.html");
        
        NavigationService.apiCallWithData("User/createEntry", formData, function (data) {
            if (data.errors) {
                console.log("error--", data)
                $scope.entry = "/entry?params=c2l0ZT1fX2RlZmF1bHRfXwpnYW1lPWhvbGRlbQpBVVRIX1RPS0VOPTNlYmQ5NWY1NWEwOTQyNmRiYmFjOTcxNmNiNzEwMWE0MGMzYTlhMjA&JSESSIONID=3ebd95f55a09426dbbac9716cb7101a40c3a9a20"
                EvolutionGaming.loadGame({
                    url: "https://kingscasino.uat1.evo-test.com" + $scope.entry, // url part returned by User  Authentification in entry or entryEmbedded parameters
                    offset: 0 // Optional. Default: 0. Need to be added if licensee has some buttons

                });

            } else {
                $scope.entry = data.entry;
                EvolutionGaming.loadGame({
                    url: "https://kingscasino.uat1.evo-test.com" + $scope.entry, // url part returned by User  Authentification in entry or entryEmbedded parameters
                    offset: 0 // Optional. Default: 0. Need to be added if licensee has some buttons

                });
            }

        });
       
    })

    .controller('LinksCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/links.html");
        TemplateService.title = "Links"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });