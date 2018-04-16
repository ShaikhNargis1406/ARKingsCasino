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
            "_id": "5ac34a40f18b0e72339c5ae0",
            "update": true,
            "firstName": "Niya",
            "lastName": "SK",
            "nickname": "SN",
            "country": "HK",
            "language": "hk",
            "currency": "HKD",
            "game": "roulette"
        }
        $scope.template = TemplateService.getHTML("content/home.html");
        var userData = {};
        userData.userId = '5ac34a40f18b0e72339c5ae0';
        userData.uuid = '5ac6004c1a0a';
        NavigationService.apiCallWithData("Transactions/sid?authToken=stage1234", userData, function (data) {
            console.log('data---->>>>>', data);
            if (data.sid) {
                formData.sessionId = data.sid;
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