define([], function() {

    var url = 'http://supervizor.domenca.com/api';

    return function($http) {

        return {
            getInstitutes: getInstitutes,
            getGraph: getGraph,
            getCategories: getCategories,
            getTransactions : getTransactions
        };

        function getInstitutes(callback, filter) {
            return $http.post(url + '/institutes/query', {
                        bu_code : filter.bu_code,
                     //   reg_number : filter.reg_number,
                      //  vat_number : filter.vat_number,
                        name : filter.name,
                        limit : 4500
                    })
                    .then(callback)
                    .catch(apiFail);
        }

        function getGraph(callback, filter) {
            return $http.post(url + '/graph/query', {
                    source_bu_code : filter.source_bu_code,
                    target_bu_code : filter.target_bu_code,
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

        function getTransactions(callback, filter) {
            return $http.post(url + '/transactions/query', {
                bu_code : filter.bu_code,
                limit : 4500
            })
                .then(callback)
                .catch(apiFail);
        }
        
    }

    function apiFail(error) {
        console.log("Error: " + error.data)
    }

});
