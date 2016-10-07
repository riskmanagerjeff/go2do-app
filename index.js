var express = require('express')  // npm install express
var app = express()

var http = require('http').Server(app);  // npm install socket.io --save
//var io = require('socket.io')(http);  // socket.io needed to install python and vs express 2013  // on win pc laptop

console.log("Starting TOGGLE-TASKS")

/*
installing angular socket io

first, install socket.io 
  npm install socket.io --save
  In my implementation, i had to use an http server.

Next, install the angular js needed for using socket.io with angular
  https://www.npmjs.com/package/angular-socket-io
  npm install angular-socket-io

You will need to include both files in your html.index
  <!-- socket.io -->
  <script src="js/socket.io.js"></script>
  <!-- angular module 'btford.socket-io' for socket.io -->
  <script src="js/socket.js"></script>  

make sure to add 'btford.socket-io' into your angular modules
  angular.module('starter', ['ionic', 'starter.controllers', 'btford.socket-io'])

That should work...
*/

//app.set('port', (process.env.PORT || 5000))  // comment me for local host and use port 5000

app.use(express.static('www'));
//app.use(express.static(__dirname + '/assets'));
//app.use(express.static(__dirname + '/images'));

//app.use(express.static('/www/assets'));
//app.use(express.static('/www/images'));
http.timeout = 0;
http.listen(process.env.PORT || 5000, function(){
});


var mongodb = require('mongodb'); // npm install mongodb
var ObjectId = require('mongodb').ObjectId; 

var MongoClient = mongodb.MongoClient;
var uri = 'mongodb://toggle:task@ds015924.mlab.com:15924/heroku_tjph47fd';
var toggles;
var users;
var logs;

MongoClient.connect(uri, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', uri);
    toggles = db.collection('toggles');
    users = db.collection("Users");
    logs = db.collection("logs");
    
  }   
});


app.get('/', function(request, response) {
  //response.send('Hello World')
  response.sendFile(__dirname + '/index.html');
})

var newLogEntry = function(email, password, entry) {
  var logEntry = {
    "email": email, 
    "password": password, 
    "dateTimeStamp": Date(),
    "entry": entry
  }
  return logEntry;
}

var logEntry = function(logEntry) { 
  // write the entry into mongodb
  logs.insert(logEntry, function (err, result) {
    if (err) {
      console.log(err);
    } 
    else {
    }          
  });    
}

app.get('/LOG', function(request, response) {
  //response.send('Hello World')
  console.log("/LOG", request.query);
  logEntry( newLogEntry(request.query.email, request.query.password, request.query.entry) );
  response.send('/LOG: success');
})


app.get('/TOGGLE', function(request, response) {
  //response.send('Hello World')
  console.log("/TOGGLE", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    //"_id": ObjectId(request.query._id)
    };

  toggles.find( qry ).toArray(function(err, docs) {

    if (docs.length > 0) {

      var update = {$set: {"state": !docs[0].state}};
      toggles.update( qry, update, function(err, docs2) {
        if (err) {
          console.log('/TOGGLE err', err);
        } else {
          console.log('/TOGGLE: success');
          response.send('/TOGGLE: success');

          var entry = "/TOGGLE : " + "Toggled '" + request.query.name + "' from " +docs[0].state+ " to " +!docs[0].state;
          logEntry( newLogEntry(request.query.email, request.query.password, entry) );
        }
      });

    }
    else {
      console.log('/TOGGLE err: nothing was found');
    }

  });
})


app.get('/NAME', function(request, response) {
  //response.send('Hello World')
  console.log("/NAME", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    };
  
  var update = {$set: {"name": request.query.newName }};
  toggles.update( qry, update, function(err, docs) {
    if (err) {
      console.log('/NAME err', err);
    } else {
      console.log('/NAME: success');
      response.send('/NAME: success');
    }
  });

})

app.get('/MESSAGE', function(request, response) {
  //response.send('Hello World')
  console.log("/MESSAGE", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    };
  
  var update = {$set: {"message": request.query.message }};
  toggles.update( qry, update, function(err, docs) {
    if (err) {
      console.log('/MESSAGE err', err);
    } else {
      console.log('/MESSAGE: success');
      response.send('/MESSAGE: success');
    }
  });

})

app.get('/GETMESSAGE', function(request, response) {
  //response.send('Hello World')
  console.log("/GETMESSAGE", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    };
  
  toggles.find( qry ).toArray(function(err, docs) {

    if (docs.length > 0) {
      response.send(docs[0].message);      
    }
    else {
      console.log('/GETMESSAGE err: nothing was found');
      response.send('/GETMESSAGE err: nothing was found');
    }

  });
})

app.get('/NEW', function(request, response) {
  //response.send('Hello World')
  console.log("/NEW", request.query);

  var newToggle = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name":"New Toggle",
    "state":false,
    "message":""
  };

  if ((request.query.email != '') && (request.query.password != '')) {
    toggles.insert(newToggle, function (err, result) {
      if (err) {
        console.log(err);
        response.send('/NEW: failed');
      } else {
        console.log('inserted new toggle');
        response.send('/NEW: success');
      } 
      //Close connection                
    }); 
  }  

})

app.get('/DELETE', function(request, response) {
  //response.send('Hello World')
  console.log("/DELETE", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    };
  
  toggles.remove( qry, function(err, result) {

    if (err) {
      //console.log('/DELETE err:', err);
      response.send('/DELETE err:', err);
      throw err;
    }
    else {
      console.log('/DELETE result:', result);
      response.send('/DELETE');
    }

  });
})

app.get('/STATE', function(request, response) {
  //response.send('Hello World')
  //console.log("/STATE", request.query);
  var qry = { 
    "email": request.query.email, 
    "password": request.query.password,
    "name": request.query.name
    };
  
  toggles.find( qry ).toArray(function(err, docs) {

    if (docs.length > 0) {
      response.send(JSON.stringify(docs[0].state));      
    }
    else {
      console.log('/STATE err: nothing was found');
      response.send('/STATE err: nothing was found');
    }

  });
})



app.get('/GETALL', function(request, response) {
  
  var ret = {};
  console.log("/GETALL", request.query);
  var qry = { "email": request.query.email, "password": request.query.password };
  toggles.find( qry ).toArray(function(err, docs) {

    ret.toggles = docs;
    logs.find(qry).sort({dateTimeStamp:-1}).toArray(function(err, docs) { 
      ret.logs = docs;
      response.send(JSON.stringify(ret));
    });
      
  });

})
 


app.get('/LOGIN', function(request, response) {
  
  console.log("/LOGIN", request.query);
  var qry = { "email": request.query.email, "password": request.query.password };
  users.find( qry ).toArray(function(err, docs) {

    var ret = {};
    if (docs.length > 0) {
      for (j=0; j<docs.length; j++) {
        
      }
      console.log("/LOGIN", docs);
      response.send("User_found");
    }
    else {
      //response.send("{'response':'User_not_found'}");
      response.send("User_not_found");
    }

  });
  
})


app.get('/SIGNUP', function(request, response) {
  
  console.log("/SIGNUP", request.query);

  var newUser = { 
    "email": request.query.email, 
    "password": request.query.password  
  };

  users.insert(newUser, function (err, result) {
    if (err) {
      console.log(err);
      response.send('/SIGNUP: failed');
    } else {
      console.log('inserted new user');
      response.send('/SIGNUP: success');
    } 
    //Close connection                
  });   
  
})


