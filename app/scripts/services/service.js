define(['./apiService/apiService'], function(apiService) {

    var services = {
        apiService: apiService
    };

    var initialize = function ( angModule ) {
        angular.forEach(services, function (service, name) {
            angModule.factory(name, service);
        })
    }

    return {
        initialize: initialize
    };

});