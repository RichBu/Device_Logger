//all of the routes for doing reports

let fs      = require('fs')
let path    = require('path');
let express = require('express');

let router  = express.Router();

var connection = require('../connection');

let fileLoc = './public/videos/';

const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
const numeral = require("numeral");
const math = require('mathjs');


//put in a separate file
class userLogRecStoreType {
	constructor( _timeStr, _clientIP, _action_done, _action_string ) {
	  this.timeStr = _timeStr;
	  this.clientIP = _clientIP;
	  this.action_done = _action_done;
	  this.action_string = _action_string;
	}
  };


router.get('/', function(req, res, next) {
	//display reports type
	console.log('/reports route');

	var logFileListOutput = [];  //array for use in listing

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'log files list';		
		var actionString = 'hit the log files with .get route';
		
		let userLogRec = new userLogRecStoreType(
			moment().format("YYYY-MM-DD  HH:mm a"),
			req.session.clientIP,
			actionDone,
			actionString
		);


		var query = "INSERT INTO user_log (time_str, ip_addr, action_done, action_string) VALUES (?, ?, ?, ? )";
		connection.query(query, [
		  userLogRec.timeStr,
		  userLogRec.clientIP,
		  userLogRec.action_done,
		  userLogRec.action_string
		  ], function (err, response) {
		  //what to do after the log has been written		   
		  res.render('reports01', {outputObj: logFileListOutput}); 
		});  //query to write to user log	
	} else {
		var actionDone = 'report menu';		
		let userLogRec = new userLogRecStoreType(
			moment().format("YYYY-MM-DD  HH:mm a"),
			req.session.clientIP,
			'timed out',
			' ',
			' ',
			actionDone
		);
	
		var query = "INSERT INTO user_log (time_str, ip_addr, loginName, password, fullName, action_done) VALUES (?, ?, ?, ?, ?, ? )";
		connection.query(query, [
		  userLogRec.timeStr,
		  userLogRec.clientIP,
		  userLogRec.loginName,
		  userLogRec.password,
		  userLogRec.fullName,
		  userLogRec.action_done
		  ], function (err, response) {
			res.render('index');
		  });
	};
});


router.get('/logfiles', function(req, res, next) {
	//display list of logged files
	console.log('/reports/logfiles route');

	var logFileListOutput = [];  //array for use in listing

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'log files list';		
		var actionString = 'hit the log files with .get route';
		
		let userLogRec = new userLogRecStoreType(
			moment().format("YYYY-MM-DD  HH:mm a"),
			req.session.clientIP,
			actionDone,
			actionString
		);


		var query = "INSERT INTO user_log (time_str, ip_addr, action_done, action_string) VALUES (?, ?, ?, ? )";
		connection.query(query, [
		  userLogRec.timeStr,
		  userLogRec.clientIP,
		  userLogRec.action_done,
		  userLogRec.action_string
		  ], function (err, response) {
		  //what to do after the log has been written

		  var queryStr = "SELECT * FROM files_log";

		  function logFileListObj( _files_log_id, _time_of_upload, _filename_str ) {
			  this.files_log_id = _files_log_id;
			  this.time_of_upload_str = _time_of_upload;
			  this.filename_str = _filename_str
		  };
	  
		  connection.query(queryStr, [], function (err, response) {
			  //all of the sessions of previous times pulled out
			  //console.log(response);
			  for (var i = 0; i < response.length; i++) {
				  //loop thru all of the responses
				  //console.log(response);
				  //console.log(response[i]);
				  logFileListOutput.push(new logFileListObj(
					  response[i].files_log_id,
					  response[i].time_of_upload_str,
					  response[i].filename_str
				  ));
			  };
			  //console.log(videoListOutput);
			  res.render('logfile_list', {outputObj: logFileListOutput});
			  //connection.end();
		  }); //query for read logfiles  
		});  //query to write to user log	
	} else {
		var actionDone = 'log file list';		
		let userLogRec = new userLogRecStoreType(
			moment().format("YYYY-MM-DD  HH:mm a"),
			req.session.clientIP,
			'timed out',
			' ',
			' ',
			actionDone
		);
	
		var query = "INSERT INTO user_log (time_str, ip_addr, loginName, password, fullName, action_done) VALUES (?, ?, ?, ?, ?, ? )";
		connection.query(query, [
		  userLogRec.timeStr,
		  userLogRec.clientIP,
		  userLogRec.loginName,
		  userLogRec.password,
		  userLogRec.fullName,
		  userLogRec.action_done
		  ], function (err, response) {
			res.render('index');
		  });
	};
});



module.exports = router;
