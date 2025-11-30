const pg = require('pg');

// load Database Configuration and create PostgreSQL Connection Pool
let configdb = require("./database/db_config.json");
const pool = new pg.Pool({
    host: configdb.host,
    port: configdb.port,
    user: configdb.user,
    password: configdb.password,
    database: configdb.database,
});
exports.pool = pool;

/**
 * Test Script
 */
async function testQuery() {
    console.log("Start Test Query!");
    
    // connect to Database 
    const client = await pool.connect();

    try {
        // Test Query
        const res = await client.query(`
            SELECT 1;
        `);

    } catch (err) {
        console.error("Test Query Error:", err);
    } finally {
        client.release();
    }

    console.log("End Test Query!");
}
exports.testQuery = testQuery;

/**
 * Execute Procedure
 */
async function executeProcedure() {
    console.log("Start Execute Procedure!");
    
    // connect to Database 
    const client = await pool.connect();

    try {
        // Execute Procedure
        await client.query(`
            CALL public.update_achievements();
        `);
    } catch (err) {
        console.error("Execute Procedure Error:", err);
    } finally {
        client.release();
    }

    console.log("End Execute Procedure!");
}
exports.executeProcedure = executeProcedure;