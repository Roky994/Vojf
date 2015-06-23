define(['jQuery'], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/scripts/directives/searchDirective/searchDirectiveTemplate.html',

			controller: function($scope, $timeout) {
				
				$scope.monthFilter = [{
					label: "Prvi kvartar",
					value: {monthFrom: 1, monthUntil: 3}
				}, {
					label: "Drugi kvartar",
					value: {monthFrom: 4, monthUntil: 6}
				}, {
					label: "Tretji kvartar",
					value: {monthFrom: 7, monthUntil: 9}
				}, {
					label: "Četrti kvartar",
					value: {monthFrom: 10, monthUntil: 12}
				}]
				
				$scope.yearFilter = [{
					value: 2003
				},{
					value: 2004
				},{
					value: 2005
				},{
					value: 2006
				},{
					value: 2007
				},{
					value: 2008
				},{
					value: 2009
				},{
					value: 2010
				},{
					value: 2011
				},{
					value: 2012
				}, {
					value: 2013
				}, {
					value: 2014
				}];
				
				$scope.amountFilter = [{
					label: "0 - 10000",
					value: { maxAmount: 10000.00 }
				}, {
					label: "10000 - 50000",
					value: { minAmount: 10000.00, maxAmount: 50000.00 }
				}, {
					label: "50000 - 100000",
					value: { minAmount: 50000.00, maxAmount: 100000.00 }
				}, {
					label: "več kot 100000",
					value: { minAmount: 100000.00 }
				}]
			}
		}
	}

});