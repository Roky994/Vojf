define([], function() {

    var url = 'http://supervizor.domenca.com/api';

    return function($http) {

        return {
            getInstitutes: getInstitutes,
            getGraph: getGraph,
            getCategories: getCategories
        };

        function getInstitutes(callback) {
            return $http.get(url + '/institutes')
                    .then(callback)
                    .catch(apiFail);
        }

        function getGraph(callback) {
            return $http.get(url + '/graph')
                .then(callback)
                .catch(apiFail);
        }
        
        function getCategories(callback) {
            return $http.get(url + '/categories')
                .then(callback)
                .catch(apiFail);
        }
        
    }

    function apiFail(error) {
        console.log("Error: " + error.data)
    }

});
