

//for device logger

DROP DATABASE IF EXISTS lb4a4vdbieztvy2i;
CREATE DATABASE lb4a4vdbieztvy2i;
USE lb4a4vdbieztvy2i;


CREATE TABLE ip_log (
    log_id INT NOT NULL AUTO_INCREMENT,
    time_str VARCHAR(19),
    ip_addr VARCHAR(16),
    ip_query VARCHAR(16),
    as_field VARCHAR(40),
    country VARCHAR(15),
    countryCode VARCHAR(5),
    city VARCHAR(15),
    region VARCHAR(5),
    regionName VARCHAR(15),
    zip VARCHAR(5),
    timezone VARCHAR(20),
    action_done VARCHAR(20),
    PRIMARY KEY (log_id)
);


CREATE TABLE user_log (
    user_log_id INT NOT NULL AUTO_INCREMENT,
    time_str VARCHAR(19),
    ip_addr VARCHAR(16),
    action_done VARCHAR(20),
    actiion_string VARCHAR(80),
    PRIMARY KEY (user_log_id)
);


CREATE TABLE event_log (
    event_log_id INT NOT NULL AUTO_INCREMENT,
    mach_num_str VARCHAR(3),
    mach_num VARCHAR(3),
    event_str VARCHAR(20),
    start_time_str VARCHAR(20),
    end_time_str VARCHAR(20),
    event_duration VARCHAR(11),
    on_time VARCHAR(11),
    off_time VARCHAR(11),
    PRIMARY KEY (event_log_id)
);


CREATE TABLE files_log (
    files_log_id INT NOT NULL AUTO_INCREMENT,
    filename_str VARCHAR(75),
    PRIMARY KEY (files_log_id)
);

