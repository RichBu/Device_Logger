//all of the routes for doing reports

let fs      = require('fs')
let path    = require('path');
let express = require('express');
let S       = require('string');

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


  class eventByTimeRecStoreType {
	constructor( _start_time_str, _end_time_str, _event_duration, _M1, _M2, _M3, _M4, _M5, _M6, _M7, _M8, _M9 ) {
		this.start_time_str = _start_time_str;
		this.end_time_str   = _end_time_str;
		this.event_duration = _event_duration;
		this.M1 = _M1;
		this.M2 = _M2;
		this.M3 = _M3;
		this.M4 = _M4;
		this.M5 = _M5;
		this.M6 = _M6;
		this.M7 = _M7; 
		this.M8 = _M8;
		this.M9 = _M9;
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



router.post('/evt_list', function(req, res, next) {
	//display list of logged files
	console.log('/reports/evt_list route');

	var _startDate = S("").toString();
	var tempStrIn = S(req.body.startDate).trim() + "*";
	if( tempStrIn == "*") {
		_startDate = "*";
	} else {
		_startDate = req.body.startDate + "/01/01";
	};
	var _startTime = S("").toString();
	tempStrIn = S(req.body.startTime).trim() + "*";
	if( tempStrIn == "*") {
		if(_startDate == "*") {
			//start date is already an asterisks
			_startTime = "";
		} else {
			_startTime = "00:00:00";  //set to midnight
		};
	} else {
		_startTime = req.body.startTime + ":00:00";
	};



	var _endDate = S("").toString();
	var tempStrIn2 = S(req.body.endDate).trim() + "*";
	if( tempStrIn2 == "*") {
		_endDate = "*";
	} else {
		_endDate = req.body.endDate + "/01/01";
	};
	var _endTime = S("").toString();
	tempStrIn2 = S(req.body.endTime).trim() + "*";
	if( tempStrIn2 == "*") {
		if(_endDate == "*") {
			//start date is already an asterisks
			_endTime = "";
		} else {
			_endTime = "00:00:00";  //set to midnight
		};
	} else {
		_endTime = req.body.endTime + ":00:00";
	};

	var _startMach = req.body.startMach;
	var _endMach = req.body.endMach;

	//find the start string, either a wild card or the start UTC
	var searchStartStr = "";
	if (_startDate == "*") {
		searchStartStr = "0";   //if it is a wild card then search from utc=0
	} else {
		//not a wildcard
		var tempStr = S(_startDate).left(4).toString(); 
		var startYear = parseInt(tempStr);
	
		var tempStr2 = S(_startDate);
		var startMonth = parseInt(tempStr2.substr(5,2));
	
		var tempStr3 = S(_startDate);
		var startDate = parseInt(tempStr3.substr(8,2));
	
		var tempStr4 = S(_startTime);
		var startHour = parseInt(tempStr4.left(2));
		var startMin = parseInt(tempStr4.substr(3,2));
		var startSec = parseInt(tempStr4.substr(6,2));
		var startDate_utc = Date.UTC(startYear, startMonth, startDate, startHour, startMin, startSec);	
		searchStartStr = S(startDate_utc).toString();
		};

		//find the end date string
		var searchEndStr = "";
		if (_endDate == "*") {
			var endDate_utc = Date.UTC(3000, 12, 31, 0, 0, 0);	
			searchEndStr = S(endDate_utc).toString();
		} else {
			//not a wildcard
			var tempStr = S(_endDate).left(4).toString(); 
			var endYear = parseInt(tempStr);
		
			var tempStr2 = S(_endDate);
			var endMonth = parseInt(tempStr2.substr(5,2));
		
			var tempStr3 = S(_endDate);
			var endDate = parseInt(tempStr3.substr(8,2));
		
			var tempStr4 = S(_endTime);
			var endHour = parseInt(tempStr4.left(2));
			var endMin = parseInt(tempStr4.substr(3,2));
			var endSec = parseInt(tempStr4.substr(6,2));
			var endDate_utc = Date.UTC(endYear, endMonth, endDate, endHour, endMin, endSec);	
			searchEndStr = S(endDate_utc).toString();
			};
	
	var eventByTimeListOutput = [];  //array for use in listing

	console.log("start = " + searchStartStr);
	console.log("end = "   + searchEndStr);

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'events by time';		
		var actionString = 'events by time';
		
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
		  //log has been written, read all the events

		  var queryStr = "SELECT * FROM event_bytime WHERE on_time_utc >= ? AND on_time_utc <= ?";
	  
		  connection.query(queryStr, [searchStartStr, searchEndStr], function (err, response) {
			  //all of the sessions of previous times pulled out
			  //console.log(response);
			  for (var i = 0; i < response.length; i++) {
				  //loop thru all of the responses
				  //console.log(response);
				  //console.log(response[i]);
				  let eventByTimeRec = new eventByTimeRecStoreType(
					  response[i].start_time_str,
					  response[i].end_time_str,
					  response[i].event_duration,
					  response[i].m1,
					  response[i].m2,
					  response[i].m3,
					  response[i].m4,
					  response[i].m5,
					  response[i].m6,
					  response[i].m7,
					  response[i].m8,
					  response[i].m9
				  );

				  eventByTimeListOutput.push(eventByTimeRec);
			  };
			  //console.log(videoListOutput);
			  res.render('report_evt_list', {outputObj: eventByTimeListOutput} );
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
