#!/usr/bin/env node

var request = require('request'); // npm install request

var req = {
    url: 'https://fsdspy2.herokuapp.com/wake', //URL to hit
    qs: {
		msg: 'my message'
		}
}

var req2 = {
    url: 'https://fsdspy2.herokuapp.com/download', //URL to hit
    qs: {
		startdate: '2016-06-10',
		enddate: '2016-06-11',
		currdate: '2016-06-12',
		ticker: 'TD.TO'
	}
}

function sayHello() {
  console.log("Running scheduler.js -> hello world");
}

function download() {
	request(req2, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("scheduler - download body:", body) 
	  }
	  else {
	  	console.log("scheduler - download error:", error) 
	  }
	})
}

/*
request(req, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("scheduler:", body) 
  }
})
*/

sayHello();
download();


 