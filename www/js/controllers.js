var html5   = {};
var dbsize = 1024 * 1024; //1MB
html5.db = null;
html5.db = openDatabase("tablas", "1.0", "Tablas de multiplicar", dbsize);
var fallas   = 0;
var aciertos = 0;

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
  //debo crear las tablas en la base de datos

  $scope.initTablas = function()
  {
    //creo las tablas
    $scope.createTableTablas();

    html5.db.transaction(function(tx){
         tx.executeSql("SELECT * FROM tablas",[],function(ts,rs){
            var len = rs.rows.length, i;
            if(len == 0) //no tiene datos dentro
            {
                //inserto en las tablas la información que necesito
                  //inserto todas las tablas
                  html5.db.transaction(function(tx){
                    for(a=1;a<=10;a++)
                    {
                      for(b=1;b<=10;b++)
                      {
                         tx.executeSql("INSERT INTO tablas(tabla,operador) VALUES(?,?)",[a,b],html5.onSuccess,html5.onError);
                      }
                    }

                });
            }
        });
    });
  }

  $scope.createTableTablas = function()
  {
      //para empezar el juego borro la tabla y la creo 
      //$scope.borrarTabla("tablas");
      html5.db.transaction(function(tx){
            tx.executeSql("CREATE TABLE IF NOT EXISTS tablas(idTabla INTEGER PRIMARY KEY, tabla INTEGER, operador INTEGER, acertada INTEGER,jugada INTEGER)", []);
      });

  }


  $scope.borrarTabla = function(tabla)
  {
    html5.db.transaction(function(tx){
          tx.executeSql("DROP TABLE "+tabla, []);
      });
  }    

})



.controller('jugarMainCtrl', function($scope) {
    $scope.bg = 0;
    $scope.initGameMain = function()
    {
      $scope.bg = Math.round(Math.random()*(1-0)+parseInt(0));
      $scope.$digest();
    }
})

.controller('jugarCtrl', function($scope, $stateParams, $ionicPopup) 
{
    $scope.numero1 = $stateParams.nroTabla;
    $scope.jugando = 0;
    $scope.botones = [];
    $scope.vidas = 3;

    $scope.initGame= function()
    {
      //alert($scope.vidas);
      $scope.jugando = 0;
      $scope.numero1 = $stateParams.nroTabla;
      //para la tabla que haya indicado el usuario debo ponerle el campo jugada para permitirle que pueda volver a jugar sin dañar el resultado que haya hecho
      html5.db.transaction(function(tx){
          tx.executeSql("UPDATE tablas set jugada = '' WHERE tabla=?",[$scope.numero1],html5.onSuccess,html5.onError);
      });
      //actualizo las vidas a 3
      $scope.vidas = 3;
      fallas   = 0;
      aciertos = 0;
    }

    $scope.showAlert = function(titulo,mensaje,callback) {
     var alertPopup = $ionicPopup.alert({
       title: titulo,
       template: mensaje
     });

     alertPopup.then(function(res) {
       callback()
     });
   };

    $scope.aleatorio = function(min,max)
    {
      var aleat = Math.round(Math.random()*(max-min)+parseInt(min));
      return aleat;
    }

    $scope.aleatorio2 = function(min,max,compara)
    {
      var aleat = Math.round(Math.random()*(parseInt(max)-parseInt(min))+parseInt(min));

        return aleat;
 
    }

    $scope.consultaTabla = function(filtro)
    {
      
    }

    $scope.jugar = function()
    {
      if($scope.vidas > 0)
      {
          $scope.jugando = 1;
          var consulta = $stateParams.nroTabla;
          //alert(consulta);
          //a la hora de jugar lo que debo hacer es consultar de la base de tablas la tabla que haya seleccionado el jugador la cual está en la variable $scope.numero1
          //realizo un query
          html5.db.transaction(function(tx){
             tx.executeSql("SELECT * FROM tablas WHERE tabla=? AND jugada =''",[consulta],function(ts,rs){
                var len = rs.rows.length, i;
                //alert(len)
                if(len > 0)
                {
                    var aleator    = Math.floor(Math.random()*(rs.rows.length));
                    $scope.numero1 = rs.rows.item(aleator).tabla;
                    $scope.numero2 = rs.rows.item(aleator).operador;

                    var resultadoReal = parseInt($scope.numero1) * parseInt($scope.numero2);

                    var aleator1 = ($scope.numero1 + resultadoReal);
                    var aleator2 = Math.round(Math.random()*(5-1)+parseInt(1));
                    var aleator3 = ($scope.numero1 + 5);
                    var aleator4 = Math.round(Math.random()*(9-5)+parseInt(5));

                    var data = [
                        {
                          datos:
                          [
                                {res: resultadoReal,real:1,text:resultadoReal},
                                {res: (aleator1 * aleator2),real:0,text:aleator1+" - "+aleator2},
                                {res: (aleator3 * aleator4),real:0,text:aleator3+" - "+aleator4}
                          ]
                        },
                        {
                          datos:
                          [
                                {res: (aleator1 * aleator2),real:0,text:aleator1+" - "+aleator2},
                                {res: resultadoReal,real:1,text:resultadoReal},
                                {res: (aleator3 * aleator4),real:0,text:aleator3+" - "+aleator4}
                          ]
                        },
                        {
                          datos:
                          [
                                {res: (aleator1 * aleator2),real:0,text:aleator1+" - "+aleator2},
                                {res: (aleator3 * aleator4),real:0,text:aleator3+" - "+aleator4},
                                {res: resultadoReal,real:1,text:resultadoReal}
                          ]
                        }
                    ]    
                    $scope.botones = data[$scope.aleatorio(0,2)]['datos'];
                    //console.log($scope.botones);
                    $scope.$digest();


                }
                else
                {
                   //alert("Fin del juego, has tenido "+fallas+" respuestas malas y "+aciertos+" respuestas correctas.");
                   $scope.showAlert("FIN DEL JUEGO","Fin del juego, has tenido "+fallas+" respuestas malas y "+aciertos+" respuestas correctas.",function(){
                      $scope.jugando = 0;
                      //$scope.$digest();
                      document.location = "#/app/jugarMain";  
                   });
                  
                }

                /*for (i = 0; i < len; i++){
                   alert(rs.rows.item(i).operador );
                }*/
             }, html5.onError);
          });
      }
      else
      {
          $scope.showAlert("FIN DEL JUEGO","No tienes vidas para jugar, vuelve a intentarlo",function(){
              $scope.jugando = 0;
              document.location = "#/app/jugarMain";  
           });
      }

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

    $scope.validar = function(acc,tabla,valor)
    {
        if(acc == 1)//Bien
        {
            //alert("BIEN !! - :)");

             $scope.showAlert("HAS ACERTADO","Muy bien!!!",function(){
                //le indico a la base de datos que completo la jugada y que acerto
                html5.db.transaction(function(tx){
                    tx.executeSql("UPDATE tablas set jugada = 1,acertada=1 WHERE tabla=? AND operador=?",[tabla,valor],html5.onSuccess,html5.onError);
                });
                aciertos++;
                $scope.jugar(); 
             });
        }
        else//mal
        {
            
          $scope.showAlert("FALLASTE","Debes repasar un poco más",function(){
                //le indico a la base de datos que completo la jugada pero que no acerto
            html5.db.transaction(function(tx){
                tx.executeSql("UPDATE tablas set jugada = 1,acertada=0 WHERE tabla=? AND operador=?",[tabla,valor],html5.onSuccess,html5.onError);
            });
            fallas++;
            $scope.vidas--;
            $scope.jugar();
            $scope.$digest();
          });


            
        }
    }
});