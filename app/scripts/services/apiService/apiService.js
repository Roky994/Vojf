define([], function() {

    var url = 'http://supervizor.domenca.com/api';

    return function($http) {

        return {
            getInstitutes: getInstitutes
        };

        function getInstitutes() {

            return $http.get(url + '/institutes')
                    .then(apiSuccess)
                    .catch(apiFail);

            function apiSuccess(response) {
                return response.data.results;
            }

            function apiFail(response) {
                console.log(response.data)
            }

        }
    }

});
