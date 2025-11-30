const express = require('express');
const server = express();
const cron = require('node-cron');
const port = 5001;

const { testQuery, executeProcedure } = require('./server_functions');

server.listen(port, (error) =>{
    if(!error)
        console.log("Server is running succesfully on Port: "+ port)
    else 
        console.log("Error! Server cannot start: ", error);
    }
);

/**
 * Test Route for Server running and Server time test
 */
server.get("/", (req, res) => {
    let time = new Date().toString();
    res.send("Express Server is running with Time: "+time+"!");
});

/**
 * Route to manually start Test Query
 */
server.get("/testQuery", async (req, res) => {
    testQuery();
    await res.send("Test Query started!");
});

/**
 * Route to manually start Execute Procedure
 */
server.get("/executeProcedure", async (req, res) => {
    testQuery();
    await res.send("Execute Procedure started!");
});

// ------------------------------------------------------------------

// run function every minute 
cron.schedule('* * * * *', executeProcedure);