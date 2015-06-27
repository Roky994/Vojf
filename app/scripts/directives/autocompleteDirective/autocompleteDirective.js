define(['jQuery'], function() {

    return function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/scripts/directives/autocompleteDirective/autocompleteDirectiveTemplate.html',
            controller: function($scope, $timeout) {
                $scope.placeholder = "Ključna beseda, matična številka, davčna številka, šifra pu";
            }
        }
    }

});