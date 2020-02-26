//
// backend API's for use in upoading logged events
//

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


router.post('/logfile', function(req, res, next) {
	var fileNameToAdd = req.body.fileName;
	var loginValid = 'false';
	var outputUrl = '/';

	console.log('at login post');
	console.log('add this file: ' + fileNameToAdd);

	//check if logged in, later feature
	//for now, bypass
	let noLogin = true;
	if (noLogin || req.session.logged_in === true ) {
		var actionDone = 'api-post log file';		
		var actionString = 'add a log file name to db';
		
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
		  //log has been written, now write to the log file table
		
		  var query = "INSERT INTO files_log (time_of_upload_str, filename_str ) VALUES (?, ?)";
		  connection.query(query, [
			userLogRec.timeStr,
			fileNameToAdd
			], function (err, response) {
			  //should check if there is an error
			  //return the proper code
			  if (err) {
				  console.log("error at api ...");
				  console.log(err);
			  } else {
				res.status(201).send();  //201 means record has been created
			  }
		
			  //res.render('logfile_list', {outputObj: logFileListOutput});
		  }); //query to write to files log  
		});  //query to write to user log	
	} else {
		var actionDone = 'api-post log file';		
		var actionString = 'tried to add but timed out';
		
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
			res.render('index');
		  });
	};
});


module.exports = router;
