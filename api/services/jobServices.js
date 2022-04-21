const express = require("express"); 
const userServices = require("../services/userServices");
const cron = require('node-cron');
const { ErrorHandler } = require("../middlewares/errorHandler");

module.exports = function(){
    return {
        Start: async function (timeInterval) {
            let message = `The task cannot be started for the time interval you specified. Time interval : ${timeInterval}`;
            try {
                var myUserServices = new userServices(); 
                if(timeInterval!=null && timeInterval!=undefined && timeInterval>0)
                {
                    // Schedule tasks to be run on the server.
                    // * * * * * *
                    // | | | | | |
                    // | | | | | day of week
                    // | | | | month
                    // | | | day of month
                    // | | hour
                    // | minute
                    // second ( optional )
                    const task = cron.schedule(`*/${timeInterval} * * * *`, async function() {
                        try {
                            await myUserServices.Post();
                            console.log("Task Worked.");
                        } catch (err) {
                            console.log(`Error during data processing : ${err}\n`);
                        } 
                        // finally
                        // {
                        //     const lastUser = await myUserServices.LastUser();
                        //     //waiting for answer 4 seconds. 
                        //     new Promise(lastUser => setTimeout(lastUser, 4000));
                        //     console.log(lastUser);
                        // }
                    });
                    global.Task = task; 
                    message = `The Task will running every ${timeInterval<=1?"a":timeInterval} minute`;
                }
                console.log(message);
                return message;
            } catch (err) {
                throw new ErrorHandler(500, `${message} ${err}`);
            }
        },
        Stop: async function () {
            let message = `An error occurred during task stop..`;
            try {
                if (global.Task!=null && global.Task!=undefined)
                {
                    let myJob = global.Task;
                    myJob.stop();    
                    message = "The task was successfully terminated.";
                }
                console.log(message);
                return message;
            } catch (err) {
                throw new ErrorHandler(500, `${message} ${err}`);
            }
        }
    };
  };


