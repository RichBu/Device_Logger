# Device_Logger
 Database for device logging - backend app

by Rich Budek

This is a modified app of an actual working application.
 
The goal was to link sensing devices on machinery and to log the data and then do reporting on it.  This backend is a RESTFUL API.   The architecure followed is the standard Post, Get, Delete, and Put.  At the moment only the Post and Get are implemented.


Functions:
Because the original system and design were custom built, not all of the features can be shown to the general public.  Therefore, this is a scaled down version with only minimal reporting to allow the user to see how the system functions.


Getting Data In:
Originally the system was a batched logged file that was stored on the network. At the users intervals, the data logged file was uploaded to the mySQL database.  Eventually the data was set up to be collected on-line and in real time.


Manual Upload:
There is a matching client app that is written in Visual Studio C#.  That client runs on a Windows Computer and reads the logged data.  After reading it in, some data conversion is necessary to convert the scrolling data into timed events.  These timed events are separated by device / machine number and then sent in.

The files are ASCII text files that have an embedded data in the file name.  One file is created per day.  Therefore, to aid in the update, the filenames are tracked and stored in the mySQL database so that the user knows what files have been uploaded.  At the moment there is no duplicate upload checking done, so it is up to the user to check which files have been uploaded.


What is demonstrated:
This system demonstrates how to design a backend with a mySQL database.  The backend API's communicate with the mySQL server.  The API's can accept data from a HTML page, though that seems very silly as there would be no practical reason to do that.  The point of the system was to automatically record the data.

The next option to upload is to use a PC based program to read in logged data and to blast it over to the API's.  This front end client is demonstrated using a Visual C# program in another repo.

Lastly, the data can be collected real time and transmitted to the API.  In this application, a PLC network was employed and a small embedded processor would poll the PLC's and transmit the events. 

So, the backend API's really don't care where the data comes from and in fact some devices may have real time data, and some have logged data uploaded later.

