angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('tablasCtrl', function($scope) {
  $scope.numero = 1;
})

.controller('jugarCtrl', function($scope, $stateParams) {

    $scope.numero1 = 0;
    $scope.jugando = 0;
    $scope.botones = [];

    $scope.initGame= function()
    {
      //alert("iniciando");
      $scope.jugando = 0;
      $scope.numero1 = 0;
    }

    $scope.aleatorio = function(min,max)
    {
      var aleat = Math.round(Math.random()*(max-min)+parseInt(min));
      return aleat;
    }

    $scope.aleatorio2 = function(min,max,compara)
    {
      var aleat = Math.round(Math.random()*(max-min)+parseInt(min));
      if(compara == aleat)
      {
        $scope.aleatorio2(min,max);
      }
      else
      {
        return aleat;
      }
    }

    $scope.jugar = function()
    {
      $scope.jugando = 1;
      $scope.numero1 = $scope.aleatorio(1,9);
      $scope.numero2 = $scope.aleatorio(1,10);
      //genero botones
      var resultadoReal = parseInt($scope.numero1) * parseInt($scope.numero2);

      var aleator1 = parseInt($scope.aleatorio2(1,9,resultadoReal) );
      var aleator2 = parseInt($scope.aleatorio2(1,9,resultadoReal) );
      var aleator3 = parseInt($scope.aleatorio2(1,9,resultadoReal) );
      var aleator4 = parseInt($scope.aleatorio2(1,9,resultadoReal) );

      var data = [
          {datos:
            [
                  {res: resultadoReal,real:1},
                  {res: (aleator1 * aleator2),real:0},
                  {res: (aleator3 * aleator4),real:0}
            ]
          },
          {datos:
            [
                  {res: (aleator1 * aleator2),real:0},
                  {res: resultadoReal,real:1},
                  {res: (aleator3 * aleator4),real:0}
            ]
          },
          {datos:
            [
                  {res: (aleator1 * aleator2),real:0},
                  {res: (aleator3 * aleator4),real:0},
                  {res: resultadoReal,real:1}
            ]
          }
      ]    


      $scope.botones = data[$scope.aleatorio(0,2)]['datos'];
      $scope.digest();
    }

    $scope.predicatBy = function(prop)
    {
       return function(a,b){
          if( a[prop] > b[prop]){
              return 1;
          }else if( a[prop] < b[prop] ){
              return -1;
          }
          return 0;
       }
    }

    $scope.validar = function(acc)
    {
        if(acc == 1)//Bien
        {
            alert("BIEN !! - :)");
            $scope.jugar();
        }
        else//mal
        {
            alert("MAL - :(");
        }
    }
});