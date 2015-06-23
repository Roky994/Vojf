define([], function() {

    var url = 'http://supervizor.domenca.com/api';

    return function($http) {

        return {
            getInstitutes: getInstitutes
          //  getGraphs: getGraph
        };

        function getInstitutes() {
            return $http.get(url + '/institutes')
                    .then(apiSuccess)
                    .catch(apiFail);

            function apiSuccess(response) {
                return response.data;
            }

            function apiFail(error) {
                console.log("Error: " + error.data)
            }
        }

        function getGraph() {
            return $http.get(url + '/graph')
                .then(apiSuccess)
                .catch(apiFail);

            function apiSuccess(response) {
                return response.data;
            }

            function apiFail(error) {
                console.log("Error: " + error.data)
            }
        }

    }

});
