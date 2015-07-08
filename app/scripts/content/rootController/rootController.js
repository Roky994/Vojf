define([], function() {
    return function($rootScope, $routeParams, $location, apiService) {

		$rootScope.tabActivity = ["active", ""];
		$rootScope.tab1 = false;
		$rootScope.tab2 = false;

		$rootScope.filter = {
            month: {},
            year: undefined,
            amount: {},
        }
		
        //search data 
        $rootScope.monthFilter = [{
			label: "Prvo četrtletje",
			value: {monthFrom: 1, monthUntil: 3, urlParam: 0}
		}, {
			label: "Drugo četrtletje",
			value: {monthFrom: 4, monthUntil: 6, urlParam: 1}
		}, {
			label: "Tretje četrtletje",
			value: {monthFrom: 7, monthUntil: 9, urlParam: 2}
		}, {
			label: "Četrto četrtletje",
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
    
		$rootScope.processUrlParams = function() {
            
            $rootScope.nodeId = $routeParams.nodeId.toString();
            
            $rootScope.filter.amount = $routeParams.amount ? $rootScope.amountFilter[$routeParams.amount].value : $rootScope.amountFilter[3].value;

            $rootScope.filter.month = $routeParams.quaternery ? $rootScope.monthFilter[$routeParams.quaternery].value : $rootScope.monthFilter[0].value ;
            
            $rootScope.filter.year = $routeParams.year ? parseInt($routeParams.year) : 2014;

        }
        
        $rootScope.setUrlParams = function() {

            if($rootScope.filter.amount)
                $location.search('amount', $rootScope.filter.amount.urlParam);
            if($rootScope.filter.month)
                $location.search('quaternery', $rootScope.filter.month.urlParam);
            
            $location.search('year', $rootScope.filter.year);
        }
			
		$rootScope.parseUrl = function() {
			var graphName = $location.path().split("/")[1];
			var name;
			if (graphName == "mainGraph") {
				name = "Lokacijski graf";
			} else if (graphName == "categoryGraph") {
				name = "Kategoriziran graf";
			} else if (graphName == "atlasGraph") {
				name = "Kategoriziran graf 2";
			} else {
				name = "Prikaz";
			}

			$rootScope.selectedItem = name;
		};

		// Autocomplete
		var result = [];

		$rootScope.autocomplete = function(term) {
			var name = undefined;
			var bu   = undefined;
			var reg  = undefined;
			var vat  = undefined;

			// Determine if it's name, bu, reg or vat number
			var num;
			if (num = parseInt(term)) {
				bu  = term.length < 8  ? num : undefined;
				vat = term.length == 8 ? num : undefined;
				reg = term.length > 8  ? num : undefined;
			} else {
				name = term;
			}

			console.log("bu: " + bu);
			console.log("kljucna beseda: " + name);
			console.log("maticna: " + reg);
			console.log("davcna: " + vat);

			apiService.getInstitutes(function (response) {
				result = response.data;
			}, {name: name, bu_code: bu, reg_number: reg, vat_number: vat});

			return result;
		};


		$rootScope.selectTab = function(tab) {
			if (tab == 1) {
				$rootScope.tab1 = true;
				$rootScope.tab2 = false;
				$rootScope.tabActivity[0] = "active";
				$rootScope.tabActivity[1] = "";
			} else {
				$rootScope.tab1 = false;
				$rootScope.tab2 = true;
				$rootScope.tabActivity[0] = "";
				$rootScope.tabActivity[1] = "active";
			}
		}

    }
});