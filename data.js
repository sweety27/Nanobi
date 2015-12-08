google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['myApp']);
});
google.load('visualization', '1', {packages: ['geochart']});


var myApp = myApp || angular.module("myApp",[]);
var cafe_sales_total = {};
myApp.controller("IndexCtrl",function($scope,$rootScope, $http){


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

    var cafe_sales_total = {};
    var cafe_keys = [];
      for(var i = 0; i <= region_sale_repeat_hash.length-1; i++)
       {
           for (var key in cafe_sales_total)
          {
            cafe_keys.push(key);
          }
          //for cafe total hash
          if((cafe_keys).contains(region_sale_repeat_hash[i]["Cafe_ID"]))
          {
              var old_value = cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]];
              cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]]=  old_value + parseInt(region_sale_repeat_hash[i]["Sales"]);
          }
          else
           cafe_sales_total[region_sale_repeat_hash[i]["Cafe_ID"]] =  parseInt(region_sale_repeat_hash[i]["Sales"]);
       }
        var cafe_location_graph_data = {};
        cafe_location_graph_data["Cafe 1"] = [28.6139, 77.2090];
        cafe_location_graph_data["Cafe 2"] = [12.9667, 77.5667];
        cafe_location_graph_data["Cafe 3"] = [18.9750, 72.8258];
        cafe_location_graph_data["Cafe 4"] = [13.0827, 80.2707];
        cafe_location_graph_data["Cafe 5"] = [17.3700, 78.4800];

        var cafe_array = ["Cafe 1","Cafe 2","Cafe 3","Cafe 4","Cafe 5"];
        $scope.data1 = {};
        $scope.data1.dataTable = new google.visualization.DataTable();
        $scope.data1.dataTable.addColumn('number', 'LATITUDE');
        $scope.data1.dataTable.addColumn('number', 'LONGITUDE');
        $scope.data1.dataTable.addColumn('string', 'DESCRIPTION');
        $scope.data1.dataTable.addColumn('number', 'Value:', 'value');
        $scope.data1.dataTable.addColumn({type:'string', role:'tooltip'});

      for(var p = 0; p <= cafe_array.length-1; p++)
        {
          var cafe_array_key = cafe_array[p].toString();
          var sales = cafe_sales_total[cafe_array[p]].toString();
          $scope.data1.dataTable.addRows([[cafe_location_graph_data[cafe_array[p]][0],cafe_location_graph_data[cafe_array[p]][1] ,cafe_array_key, 0,sales]]);
        }
        $scope.options = {
            colorAxis:  {minValue: 0, maxValue: 0,  colors: ['#6699CC']},
            legend: 'none',
            backgroundColor: {fill:'transparent',stroke:'#FFF' ,strokeWidth:0 },
            datalessRegionColor: '#f5f5f5',
            displayMode: 'markers',
            enableRegionInteractivity: 'true',
            resolution: 'countries',
            sizeAxis: {minValue: 1, maxValue:1,minSize:5,  maxSize: 5},
            region:'auto',
            keepAspectRatio: true,
            tooltip: {textStyle: {color: '#444444'}}
        };

        var chart = new google.visualization.GeoChart(document.getElementById('visualization'));
        chart.draw($scope.data1.dataTable, $scope.options);
      }
});
