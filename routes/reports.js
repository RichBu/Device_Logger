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



class eventByMachRecStoreType {
	constructor( _event_str, _start_time_str, _end_time_str, _event_duration_utc, _on_time_utc, _off_time_utc ) {
		this.event_str = _event_str;
		this.start_time_str = _start_time_str;
		this.end_time_str   = _end_time_str;
		this.event_duration_utc = _event_duration_utc;
		this.on_time_utc = _on_time_utc;
		this.off_time_utc = _off_time_utc;
	}
  };



router.post('/evm_list', function(req, res, next) {
	//display list of events by machine
	console.log('/reports/evm_list route');

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
	
	var eventByMachListOutput = [];  //array for use in listing

	console.log("start = " + searchStartStr);
	console.log("end = "   + searchEndStr);

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'events by mach';		
		var actionString = 'events by mach';
		
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

		  var queryStr = "SELECT * FROM event_bymach WHERE start_time_utc >= ? AND start_time_utc <= ?";
		  connection.query(queryStr, [searchStartStr, searchEndStr], function (err, response) {
			  //all of the sessions of previous times pulled out
			  let currMach = 0;
			  let currOnTim = 0.0;
			  let currOffTim = 0.0;
			  let currTotTim = 0.0;  //total time
			  let currOnPer = 0.0;
			  let currOffPer = 0.0;

			  if (response.length>0){
			 	//might want to put into a class to keep it together
			  	currMach = parseInt(response[0].mach_num);    //cur mach
			  };

			  for (var i = 0; i < response.length; i++) {
				  //loop thru all of the response
				  let dur_hr = 0;
				  dur_hr = response[i].event_duration_utc/1000/60/60;  //convert to hours 
				  let on_hr = 0;
				  on_hr = response[i].on_time_utc/1000/60/60;
				  let off_hr = 0;
				  off_hr = response[i].off_time_utc/1000/60/60;

				  //calculate the percentages
				  let respMachNum = parseInt(response[i].mach_num);
				  if ((respMachNum == currMach) && (i < (response.length-1))) {
					  //mach number has not changed
					  currOnTim = currOnTim + on_hr;
					  currOffTim = currOffTim + off_hr;
					  currTotTim = currTotTim + dur_hr;
				  } else {
					  //mach number changed or the last record
					  if (i == (response.length-1)){
						//store the last record
						//make it a different variable then the rest
						let eventByMachRec2 = new eventByMachRecStoreType(
							response[i].event_str,
							response[i].start_time_str,
							response[i].end_time_str,
							dur_hr.toFixed(3),
							on_hr.toFixed(3),
							off_hr.toFixed(3)
						  );
						eventByMachListOutput.push(eventByMachRec2);
						};
					  let eventByMachRec = new eventByMachRecStoreType(
						"totals",
						" ",
						" ",
						currTotTim.toFixed(3),
						currOnTim.toFixed(3),
						currOffTim.toFixed(3)
					  );
					  eventByMachListOutput.push(eventByMachRec); //store the totals	  
					  let currZero = 0;
			  
					  if (currOnTim == 0) {
						  currOnPer = 0;
		 			  } else {
						currOnPer = (currOnTim/currTotTim) * 100.0;
					  };
					  if (currOffTim == 0) {
						currOffPer = 0;
					  } else {
						currOffPer = (currOffTim/currTotTim) * 100.0;
					  };
					  
					  eventByMachRec = new eventByMachRecStoreType(
						"percentages",
						" ",
						" ",
						//currZero.toFixed(1),
						" ",
						currOnPer.toFixed(2),
						currOffPer.toFixed(2)
					  );
					  
					  eventByMachListOutput.push(eventByMachRec); //store the totals

					  eventByMachRec = new eventByMachRecStoreType(
						" ",
						" ",
						" ",
						" ",
						" ",
						" "
					  );
					  eventByMachListOutput.push(eventByMachRec); //store the totals
				  
					  currMach =  parseInt(response[i].mach_num);
					  currTotTim = dur_hr;
					  currOnTim = on_hr;
					  currOffTim = off_hr;
				  };
				  if (i != (response.length-1)){
					//store record except if it is the last one
					let eventByMachRec = new eventByMachRecStoreType(
						response[i].event_str,
						response[i].start_time_str,
						response[i].end_time_str,
						dur_hr.toFixed(3),
						on_hr.toFixed(3),
						off_hr.toFixed(3)
					  );
					eventByMachListOutput.push(eventByMachRec);
					};
			  	};
			  //console.log(videoListOutput);
			  res.render('report_evm_list', {outputObj: eventByMachListOutput} );
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




router.post('/mach_util', function(req, res, next) {
	//machine utilization report
	console.log('/reports/evm_list route');

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
	
	var eventByMachListOutput = [];  //array for use in listing

	console.log("start = " + searchStartStr);
	console.log("end = "   + searchEndStr);

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'events by mach';		
		var actionString = 'events by mach';
		
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

		  var queryStr = "SELECT * FROM event_bymach WHERE start_time_utc >= ? AND start_time_utc <= ?";
		  connection.query(queryStr, [searchStartStr, searchEndStr], function (err, response) {
			  //all of the sessions of previous times pulled out
			  let currMach = 0;
			  let currOnTim = 0.0;
			  let currOffTim = 0.0;
			  let currTotTim = 0.0;  //total time
			  let currOnPer = 0.0;
			  let currOffPer = 0.0;

			  if (response.length>0){
			 	//might want to put into a class to keep it together
			  	currMach = parseInt(response[0].mach_num);    //cur mach
			  };

			  for (var i = 0; i < response.length; i++) {
				  //loop thru all of the response
				  let dur_hr = 0;
				  dur_hr = response[i].event_duration_utc/1000/60/60;  //convert to hours 
				  let on_hr = 0;
				  on_hr = response[i].on_time_utc/1000/60/60;
				  let off_hr = 0;
				  off_hr = response[i].off_time_utc/1000/60/60;

				  //calculate the percentages
				  let respMachNum = parseInt(response[i].mach_num);
				  if ((respMachNum == currMach) && (i < (response.length-1))) {
					  //mach number has not changed
					  currOnTim = currOnTim + on_hr;
					  currOffTim = currOffTim + off_hr;
					  currTotTim = currTotTim + dur_hr;
				  } else {
					  //mach number changed or the last record
					  if (i == (response.length-1)){
						//store the last record
						//make it a different variable then the rest
						let eventByMachRec2 = new eventByMachRecStoreType(
							response[i].event_str,
							response[i].start_time_str,
							response[i].end_time_str,
							dur_hr.toFixed(3),
							on_hr.toFixed(3),
							off_hr.toFixed(3)
						  );
						eventByMachListOutput.push(eventByMachRec2);
						};
					  let eventByMachRec = new eventByMachRecStoreType(
						"totals",
						" ",
						" ",
						currTotTim.toFixed(3),
						currOnTim.toFixed(3),
						currOffTim.toFixed(3)
					  );
					  eventByMachListOutput.push(eventByMachRec); //store the totals	  
					  let currZero = 0;
			  
					  if (currOnTim == 0) {
						  currOnPer = 0;
		 			  } else {
						currOnPer = (currOnTim/currTotTim) * 100.0;
					  };
					  if (currOffTim == 0) {
						currOffPer = 0;
					  } else {
						currOffPer = (currOffTim/currTotTim) * 100.0;
					  };
					  
					  eventByMachRec = new eventByMachRecStoreType(
						"percentages",
						" ",
						" ",
						//currZero.toFixed(1),
						" ",
						currOnPer.toFixed(2),
						currOffPer.toFixed(2)
					  );
					  
					  eventByMachListOutput.push(eventByMachRec); //store the totals

					  eventByMachRec = new eventByMachRecStoreType(
						" ",
						" ",
						" ",
						" ",
						" ",
						" "
					  );
					  eventByMachListOutput.push(eventByMachRec); //store the totals
				  
					  currMach =  parseInt(response[i].mach_num);
					  currTotTim = dur_hr;
					  currOnTim = on_hr;
					  currOffTim = off_hr;
				  };
				  if (i != (response.length-1)){
					//store record except if it is the last one
					let eventByMachRec = new eventByMachRecStoreType(
						response[i].event_str,
						response[i].start_time_str,
						response[i].end_time_str,
						dur_hr.toFixed(3),
						on_hr.toFixed(3),
						off_hr.toFixed(3)
					  );
					eventByMachListOutput.push(eventByMachRec);
					};
			  	};
			  //console.log(videoListOutput);
			  res.render('report_evm_list', {outputObj: eventByMachListOutput} );
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
