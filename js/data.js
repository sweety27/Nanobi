var myApp = angular.module('myApp',['angular.filter','highcharts-ng','googlechart'])
myApp.controller('myCtrl', function($scope, $http) {
	$scope.readCSV = function() {
		$http.get('UI+Test+Case.csv').success($scope.processData);
	};
	$scope.processData = function(csv){

	  var lines = csv.split("\n");

	  var result = [];

	  var headers = lines[0].split(",");

	  for(var i = 1;i < lines.length;i++){
		  var obj = {};
		  var currentline = lines[i].split(",");
		  for(var j = 0; j <= headers.length;j++){
			  obj[headers[j]] = currentline[j];
		  }
		  result.push(obj);
	  	}
	  	$scope.data = result;
	  	var new_data = JSON.stringify(result);
	  	Array.prototype.contains = function(obj) {
		    var i = this.length;
		    while (i--) {
		        if (this[i] === obj) {
		            return true;
		        }
		    }
		    return false;
		}

		var region_sale_repeat_hash = result;
		var region_sale_total_hash = {};
		var cafe_sales_total = {};
			for(var i = 0; i <= region_sale_repeat_hash.length-1; i++)
			{
			    var region_keys = [];
			    var cafe_keys = [];
			    for (var key in region_sale_total_hash) 
			    {
			      region_keys.push(key);
			    }

			     for (var key in cafe_sales_total) 
			    {
			      cafe_keys.push(key);
			    }

			    if((region_keys).contains(region_sale_repeat_hash[i]["Region"]))
			    {
			        var old_value = region_sale_total_hash[region_sale_repeat_hash[i]["Region"]];
			        region_sale_total_hash[region_sale_repeat_hash[i]["Region"]]=  old_value + parseInt(region_sale_repeat_hash[i]["Sales"]);
			    }
			    else
			     region_sale_total_hash[region_sale_repeat_hash[i]["Region"]] =  parseInt(region_sale_repeat_hash[i]["Sales"]);

			    //for cafe total hash 
			    if((cafe_keys).contains(region_sale_repeat_hash[i]["Cafe_ID"]))
			    {
			        var old_value = cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]];
			        cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]]=  old_value + parseInt(region_sale_repeat_hash[i]["Sales"]);
			    }
			    else
			     cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]] =  parseInt(region_sale_repeat_hash[i]["Sales"]);
			
			}
			$scope.region_keys = region_keys;
			var total_sale = 0; 
		    for (var key in region_sale_total_hash) {
		     total_sale += region_sale_total_hash[key];
		   }
		   $scope.sales_total_select = region_sale_total_hash;
				var keys = Object.keys(cafe_sales_total);
				var cafe_keys = [];
				for (var key in cafe_sales_total) 
				{
				cafe_keys.push(key);
				}
				var graph_data = [];
				graph_data.push(['Location', 'Sales']);

				for(var x = 0; x <= cafe_keys.length-1; x ++)
				{
				var temp_arr = []
				temp_arr.push(cafe_keys[x]);
				temp_arr.push(cafe_sales_total[cafe_keys[x]]);
				graph_data.push(temp_arr);
			}
			$scope.tableUpdate =  function(region){
				console.log(region);
				var data = region_sale_total_hash[region];
				var new_sales_total = {};
				if(region == null){
					console.log(region);
					$scope.sales_total = region_sale_total_hash;
					data =total_sale;
				}
				else{
     				var selected_region = region_sale_total_hash[region];
     				new_sales_total[region] = region_sale_total_hash[region];
     				$scope.sales_total = new_sales_total;
     			}

     			
     			$scope.chartConfig.series = [{
            		data: [data],
            		dataLabels: {
	        			format: '<div style="text-align:center;"><span style="font-size:25px;color:black;">Rs. {y}</span><br/>'
	        		}
        		}]

    		}

    		$scope.sales_total = region_sale_total_hash;

         	$scope.addSeries = function (id) {
		    	$scope.chartConfig.series = [{
            		data: [id],
            		dataLabels: {
	        			format: '<div style="text-align:center;"><span style="font-size:25px;color:black;">Rs. {y}</span><br/>'
	        		}
        		}]
		    }	
		   $scope.chartConfig = {
        options: {
            chart: {
                type: 'solidgauge'
            },
            pane: {
                center: ['50%', '85%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor:'#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            solidgauge: {
                dataLabels: {
                    y: -30,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        series: [{
            data: [total_sale],
            events: {
                click: function (e) {
                    angular.element('#gaugeUpdate').trigger('click','change');
                }
            },
            dataLabels: {
	        	format: '<div class="gauge-level" style="text-align:center;"><span style="font-size:25px;color:black">Rs. {y}</span><br/>'
	        }
        }],
        title: {
            text: '',
            y: 0
        },
        yAxis: {
            currentMin: 1,
            currentMax: total_sale,
            title: {
                y: 140
            },      
			stops: [
                [0.1, '#DF5353'], // red
	        	[0.5, '#DDDF0D'], // yellow
	        	[0.9, '#55BF3B'] // green
			],
			lineWidth: 0,
            tickInterval: 20,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                enabled: false
            }   
        },
        credits: {
	    	enabled: false
	    },
        loading: false
    
    }    

	var chart1 = {};
    chart1.type = "ColumnChart";
    chart1.data = graph_data;
    chart1.options = {
        displayExactValues: true,
        width: 400,
        height: 200,
        is3D: true,
        chartArea: {left:10,top:10,bottom:0,height:"100%"}
    };

    chart1.formatters = {
      number : [{
        columnNum: 1,
        pattern: "Rs #,##0.00"
      }]
    };

    $scope.chart = chart1;
    $scope.aa=1*$scope.chart.data[1][1];
    $scope.bb=1*$scope.chart.data[2][1];
    $scope.cc=1*$scope.chart.data[3][1];

   }
});
