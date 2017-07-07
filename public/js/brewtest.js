(function (){
    'use strict';

    angular
        .module('brewtest', ['nvd3'])
        .controller('homeCtrl', ['$scope','$interval', '$http',
        function ($scope, $interval, $http) {
            $http.get('/api/brews').then(function success(resp) {
                $scope.currentBrew = resp.data[0];
                
                $scope.brewData = [{
                    x: [],
                    y: [],
                    type: 'scatter'
                }];

                var layout = {
                    showlegend: false,
                    xaxis: { title: 'Date / Time' },
                    yaxis: { title: 'Temperature (°C)', nticks: 10 },
                    margin: {
                        l: 50,
                        r: 50,
                        b: 50,
                        t: 50,
                        pad: 4
                    }
                };

                $scope.currentBrew.tempData.forEach(function(record) {
                    if (new Date(record.timestamp) > new Date(new Date().getTime() - (24 * 60 * 60 * 1000))) {
                        $scope.brewData[0].x.push(new Date(record.timestamp));
                        $scope.brewData[0].y.push(record.temp);
                    }
                });

                Plotly.newPlot('brewGraph', $scope.brewData, layout, { displaylogo: false });
            });

          $scope.liveTemp = 0.0;

          var socket = io('//columbianpow.asuscomm.com:3001');

          socket.on('connect', function () { console.log('connected!'); });
          socket.on('liveTemp', function(data) { 
            console.log('received: ' + data.toString());

            $scope.$apply(function () {
              $scope.liveTemp = data.temp;
            });
          });
        }
    ]);
})();
