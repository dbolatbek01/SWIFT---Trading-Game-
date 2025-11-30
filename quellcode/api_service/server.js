const express = require('express');
const cron = require('node-cron');
const server = express();
const port = 5000;

const { searchPrices, searchOldPrices, updatePrices, deletePrices, reindexDatabase, resetSeason } = require('./server_functions');

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
 * Route to manually start Price Search
 */
server.get("/startDataSearch", async (req, res) => {
    searchPrices();
    await res.send("Price Search started!");
});

/**
 * Route to manually start Old Price Search
 */
server.get("/startOldDataSearch", async (req, res) => {
    searchOldPrices();
    await res.send("Old Data Search started!");
});

/**
 * Route to manually start Update of Prices
 */
server.get("/startUpdateStockPrices", async (req, res) => {
    updatePrices();
    await res.send("Update Stock Prices started!");
});

/**
 * Route to manually start Delete of Prices
 */
server.get("/startDeleteStockPrices", async (req, res) => {
    deletePrices();
    await res.send("Delete Stock Prices started!");
});

/**
 * Route to manually start Reindexing of Database
 */
server.get("/startReindexDatabase", async (req, res) => {
    reindexDatabase();
    await res.send("Reindex Database started!");
});

/**
 * Route to manually Reset Season
 */
/*
server.get("/startResetSeason", async (req, res) => {
    resetSeason();
    await res.send("Reset Season started!");
});
*/

// ------------------------------------------------------------------

// run function every minute 
//setInterval(runPythonScript, 60000);

// 9:30–9:59 Uhr ET Monday to Friday search for Prices 
cron.schedule('30-59 9 * * 1-5', searchPrices);

// 10:00–15:59 Uhr ET Monday to Friday search for Prices 
cron.schedule('* 10-15 * * 1-5', searchPrices);

// 16:00-16:10 Uhr ET Monday to Friday search for Prices 
cron.schedule('0-10 16 * * 1-5', searchPrices);


// 00:00 Uhr CET every day reset Season
cron.schedule('0 0 * * *', resetSeason, {
    timezone: 'Europe/Berlin'
});

// 00:30 Uhr CET every day update Prices 
cron.schedule('30 0 * * *', updatePrices, {
    timezone: 'Europe/Berlin'
});

// 00:35 Uhr CET every day delete Prices 
cron.schedule('35 0 * * *', deletePrices, {
    timezone: 'Europe/Berlin'
});

// 00:40 Uhr CET every day reindex Database 
cron.schedule('40 0 * * *', reindexDatabase, {
    timezone: 'Europe/Berlin'
});