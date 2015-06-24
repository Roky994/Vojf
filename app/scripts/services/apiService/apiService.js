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

        function getGraph(callback, filter) {
            return $http.post(url + '/graph/query', {
                    amount_min : filter.amount.minAmount,
                    amount_max : filter.amount.maxAmount,
                    month_from: filter.month.monthFrom,
                    year_from: filter.year,
                    month_until: filter.month.monthUntil,
                    year_until: filter.year,
                    limit: 4500
                    })
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
