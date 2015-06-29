define([], function() {
    return function($rootScope) {
        
        //search data 
	        $rootScope.monthFilter = [{
				label: "Prvi kvartar",
				value: {monthFrom: 1, monthUntil: 3, urlParam: 0}
			}, {
				label: "Drugi kvartar",
				value: {monthFrom: 4, monthUntil: 6, urlParam: 1}
			}, {
				label: "Tretji kvartar",
				value: {monthFrom: 7, monthUntil: 9, urlParam: 2}
			}, {
				label: "Četrti kvartar",
				value: {monthFrom: 10, monthUntil: 12, urlParam: 3}
			}];
			
			$rootScope.yearFilter = [{
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
			
			$rootScope.amountFilter = [{
				label: "0 - 10000",
				value: { minAmount: 0, maxAmount: 10000, urlParam: 0 }
			}, {
				label: "10000 - 50000",
				value: { minAmount: 10000, maxAmount: 50000, urlParam: 1 }
			}, {
				label: "50000 - 100000",
				value: { minAmount: 50000, maxAmount: 100000, urlParam: 2 }
			}, {
				label: "več kot 100000",
				value: { minAmount: 100000, urlParam: 3 }
			}];
        
    }
});