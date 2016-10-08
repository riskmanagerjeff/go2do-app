angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, DATA) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
    console.log('AppCtrl: $ionicView.enter')
  });

})

.controller('PlaylistsCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $http, $state, DATA) {

  $scope.playlists = DATA.toggles;

  $scope.$on('$ionicView.enter', function(e) {
    $scope.refresh();
  });

  $scope.refresh = function() {

    /*if (userAction) {
      DATA.lastUserActionDateTime = Date();
    }*/

    $http.get("https://toggle-tasks.herokuapp.com/GETALL", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password } })
    .success(function(ret) {
    
      if (ret=='') {
         $scope.playlists = [];
      }
      else {
        console.log(ret);     
        DATA.toggles = ret.toggles;    
        DATA.logs = ret.logs;
             
        $scope.playlists = DATA.toggles;
      }
      
    })
    .error(function(data) {
    });
  };
   

  setInterval(function() {
    $scope.refresh(false);
  }, (1/6)*60*1000);


  $scope.toggleID = function(_id, name, state) {
    //console.log(_id, " toggling", name, "from", !state, "to", state);

    $http.get("https://toggle-tasks.herokuapp.com/TOGGLE", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password, "name": name } })
    .success(function(data) {
      console.log("toggleNEW", data )
      $scope.refresh(); // then refresh the ui, to get the new toggle
    })
    .error(function(data) {
    });

  }


  $scope.toggleNEW = function(name, state) {
    console.log("create a new toggle")

    $http.get("https://toggle-tasks.herokuapp.com/NEW", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password } })
    .success(function(data) {
      console.log("toggleNEW", data )
      $scope.refresh(); // then refresh the ui, to get the new toggle
    })
    .error(function(data) {
    });
  }


  $scope.popup = {toggle:{newName:"", newMessage:""}};

  $scope.toggleMSG = function(name, message) {
    
    $scope.popup.toggle.newName = name;
    if (!(message===undefined)) {
      $scope.popup.toggle.newMessage = message;
    }

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<div><h6 style="margin-bottom: 5px; margin-top: 15px;">Name</h6><input type="text" ng-model="popup.toggle.newName"><h6 style="margin-bottom: 5px; margin-top: 15px;">Message</h6><input type="text" ng-model="popup.toggle.newMessage"></div>',
      title: name,
      subTitle: 'Edit Toggle',
      scope: $scope,
      buttons: [
        { 
          text: '<h6>Cancel</h6>',
          type: 'button-stable' 
        },
        {
          text: 'Save',
          type: 'button-positive',
          onTap: function(e) {
            $scope.popup.toggle.action = 'Save';
            return  $scope.popup.toggle;
          }
        },
        { 
          text: 'Delete',
          type: 'button-assertive',
          onTap: function(e) {
            $scope.popup.toggle.action = 'Delete';
            return  $scope.popup.toggle;
          } 
        }
      ]
    });

    myPopup.then(function(toggle) {
      //console.log('new message', toggle.newMessage);
      if (!(toggle===undefined) && toggle.action == 'Save') {

        $http.get("https://toggle-tasks.herokuapp.com/MESSAGE", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password, "name": name, "message": $scope.popup.toggle.newMessage } })
        .success(function(data) {

          if (!(toggle.newName===undefined)) {
            $http.get("https://toggle-tasks.herokuapp.com/NAME", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password, "name": name, "newName": $scope.popup.toggle.newName } })
            .success(function(data) {
              myPopup.close();           
              $scope.refresh();    
            })
            .error(function(data) {
            });
          }
          else {
            myPopup.close();           
            $scope.refresh();
          }

        })
        .error(function(data) {
        });

      }
      else if (!(toggle===undefined) && toggle.action == 'Delete') {

        $http.get("https://toggle-tasks.herokuapp.com/DELETE", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password, "name": name } })
        .success(function(data) {
          myPopup.close();           
          $scope.refresh();    
        })
        .error(function(data) {
        });

      }
    });     
  }; 
})


.controller('GridCtrl', function($scope, $stateParams, $ionicModal, $timeout, $http, $state, $ionicScrollDelegate, DATA) {

  $scope.$on('$ionicView.enter', function(e) {
    console.log('GridCtrl: $ionicView.enter')
    
    //$ionicScrollDelegate.$getByHandle('small').scrollBottom();
    $scope.playlists = DATA.toggles;
  });

  setInterval(function() {
    $scope.playlists = DATA.toggles;
  }, (1/6)*60*1000);
  

})

.controller('LoggerCtrl', function($scope, $stateParams, $ionicModal, $timeout, $http, $state, $ionicScrollDelegate, DATA) {

  $scope.$on('$ionicView.enter', function(e) {
    console.log('LoggerCtrl: $ionicView.enter')
    $scope.logs = DATA.logs;
    //$ionicScrollDelegate.$getByHandle('small').scrollBottom();
  });

  setInterval(function() {
    $scope.logs = DATA.logs;
  }, (1/6)*60*1000);

  

})


.controller('LoginCtrl', function($scope, $stateParams, $ionicModal, $timeout, $http, $state, DATA) {

  $scope.$on('$ionicView.enter', function(e) {
    console.log('LoginCtrl: $ionicView.enter')
    console.log('localStorage:', window.localStorage.getItem("loginData"));
  });

  $scope.loginData = {};

  var storedloginData = JSON.parse(window.localStorage.getItem("loginData"));
  console.log("storedloginData:", storedloginData)
  if((storedloginData !== undefined) && (storedloginData != null)) {     
    if (storedloginData.hasOwnProperty('email') && storedloginData.hasOwnProperty('password')) {
      $scope.loginData.email = storedloginData.email;
      $scope.loginData.password = storedloginData.password;
    }
    else {
      $scope.loginData = {email:'', password:''}
    }
  }
  else {
    $scope.loginData = {email:'', password:''}
  }

  
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    DATA.loginData = $scope.loginData;
    DATA.loginData.email = DATA.loginData.email.toLowerCase();

    if ((DATA.loginData.email != '') && (DATA.loginData.password != '')) {
      $http.get("https://toggle-tasks.herokuapp.com/LOGIN", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password } })
      .success(function(data) { 

        console.log('data:', data);      
        if (data=="User_found") {
          window.localStorage.setItem("loginData", JSON.stringify(DATA.loginData));
          $scope.signUpButton = false;
          $state.go('app.playlists');  //app.playlists    
        }
        else {
          alert("Login/Password not found.  Do you want to sign up?")
          $scope.signUpButton = true;
        }

      })
      .error(function(data) { 
      });
    }
    else {
      alert("Please sign up")
    }
  };


  $scope.signUpButton = false;
  $scope.doSignUp = function() {
    console.log('Doing Sign up', $scope.loginData);

    // add email and password to user collection
    $http.get("https://toggle-tasks.herokuapp.com/SIGNUP", { params: { "email": DATA.loginData.email, "password": DATA.loginData.password } })
    .success(function(data) { 

      console.log('data:', data);      
      if (data=="/SIGNUP: success") {
        window.localStorage.setItem("loginData", JSON.stringify(DATA.loginData));
        $scope.signUpButton = false;
        alert("Thanks for signing up!")
        $state.go('app.playlists');  //app.playlists    
      }
      else {
        alert("unable to sign you up")
      }

    })
    .error(function(data) {   
    });
   
  };

});
