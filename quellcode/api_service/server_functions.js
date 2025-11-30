const { exec } = require('child_process');
const pg = require('pg');
const fetch = require('node-fetch');

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
 * Call Python Script and search Prices for Stocks and Index
 */
async function searchPrices() {
    console.log("Start Data Search!");

    const tickers = await getTickers();

    // execute Python Script
    exec(`python3 ./python_scripts/yFinance_data_search.py "${tickers.join(',')}"`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
        }
        if (stderr) {
            console.error(`Standard error: ${stderr}`);
        }

        try {
            const match = stdout.match(/\[.*\]/s);
            if (!match) {
                console.error("No JSON found in Output!");
                console.log("Raw output:", stdout);
                return;
            }

            let cleanJSON = match[0]
                .replace(/\\n/g, "")
                .replace(/\\r/g, "")  
                .replace(/\\"/g, '"'); 

            const data = JSON.parse(cleanJSON);

            if (!Array.isArray(data)) {
                console.error("Parsed data ist kein Array!");
                console.log("Parsed value:", data);
                return;
            }

            // connect to Database 
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                data.forEach(async (stock) => {
                    if (stock.error != null) {
                        console.error(`Stock ${stock.shortname} wasn´t found!`);
                        // Skip to next one
                    }
                    else {
                        if (!stock.shortname.includes("^")) {
                            // Insert Price for Stocks 
                            await client.query(
                                `INSERT INTO stock_price(id_stock, price, date) 
                                    VALUES ((SELECT s.id_stock 
                                            FROM stock s JOIN season se ON s.id_season = se.id_season 
                                            WHERE s.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, now()::timestamp(0));`,
                                [stock.shortname, stock.current_price]
                            );
                        } else {
                            // Insert Price for Index 
                            await client.query(
                                `INSERT INTO index_price(id_index, price, date) 
                                    VALUES ((SELECT id_index 
                                            FROM index i JOIN season se ON i.id_season = se.id_season 
                                            WHERE i.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, now()::timestamp(0));`,
                                [stock.shortname, stock.current_price]
                            );
                        };
                    }
                });

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Error Insert:', err);
            } finally {
                client.release();
            }

        } catch (err) {
            console.error("Error with data:", err);
        }

        console.log("End Data Search!");

        executeOrders();
    });
}
exports.searchPrices = searchPrices;

/**
 * Call function that searches old prices of Stocks and Index
 * wait 5 Seconds between every call
 */
async function searchOldPrices() {
    console.log("Start Old Data Search!");

    const tickers = await getTickers();

    for (const ticker of tickers) {
        await findOldData(ticker);
        // wait 5 Seconds until next ticker 
        await new Promise(resolve => setTimeout(resolve, 5000));
    };

    console.log("End Old Data Search!");
}
exports.searchOldPrices = searchOldPrices;

/**
 * Call Python Script for old Prices of Index or Stocks 
 * @param {*} ticker shortname of Stock or Index 
 */
async function findOldData(ticker) {
    console.log("Start old Data search for: " + ticker);

    exec(`python3 ./python_scripts/yFinance_old_data_search.py "${ticker}"`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
        }
        if (stderr) {
            console.error(`Standard error: ${stderr}`);
        }

        try {
            let stdoutClean = stdout
                .replace("YF.download() has changed argument auto_adjust default to True", "")
                .replace(/\\n/g, "")
                .replace(/\\r/g, "")
                .replace(/\\"/g, '"')
                .trim();

            let start = stdoutClean.indexOf("{");
            let end = stdoutClean.lastIndexOf("}");
            if (start === -1 || end === -1 || start >= end) {
                console.error("No JSON found in stdout!");
                console.log("Raw stdout snippet:", stdoutClean.slice(0, 500));
                return;
            }

            let cleanJSON = stdoutClean.slice(start, end + 1);

            let data;
            try {
                data = JSON.parse(cleanJSON);
            } catch (e) {
                console.error("JSON parse error:", e.message);
                console.log("Snippet:", cleanJSON.slice(0, 300));
                return;
            }

            const minuteData = Array.isArray(data.minute) ? data.minute : [];
            const dayData = Array.isArray(data.day) ? data.day : [];

            const client = await pool.connect();
            // minutly data
            try {
                let result = null;
                if (!ticker.includes("^")) {
                    // Insert Price for Stocks
                    result = await client.query(
                        `SELECT 1 
                            FROM stock_price sp, stock s
                            WHERE s.id_stock = sp.id_stock AND s.shortname = $1 AND sp.date <= (now() - interval '2 months')::timestamp(0)
                            LIMIT 1;`,
                        [data.shortname]
                    );
                } else {
                    // Insert Price for Index
                    result = await client.query(
                        `SELECT 1 
                            FROM index_price ip, index i
                            WHERE i.id_index = ip.id_index AND i.shortname = $1 AND ip.date <= (now() - interval '2 months')::timestamp(0)
                            LIMIT 1;`,
                        [data.shortname]
                    );
                };


                if (result.rowCount != 0) {
                    console.log("Old Data allready inserted for: " + ticker);
                    return;
                }

                await client.query('BEGIN');

                for (const stock of minuteData) {
                    if (stock.error != null) {
                        console.error(`Stock ${data.shortname} wasn´t found!`);
                        // Skip to next one
                    }
                    else {
                        if (!ticker.includes("^")) {
                            // Insert Price for Stocks
                            await client.query(
                                `INSERT INTO stock_price(id_stock, price, date) 
                                    VALUES ((SELECT s.id_stock 
                                            FROM stock s JOIN season se ON s.id_season = se.id_season 
                                            WHERE s.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, $3);`,
                                [data.shortname, stock.price, stock.timestamp]
                            );
                        } else {
                            // Insert Price for Index
                            await client.query(
                                `INSERT INTO index_price(id_index, price, date) 
                                    VALUES ((SELECT id_index 
                                            FROM index i JOIN season se ON i.id_season = se.id_season 
                                            WHERE i.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, $3);`,
                                [data.shortname, stock.price, stock.timestamp]
                            );
                        };
                    }
                };

                for (const stock of dayData) {
                    if (stock.error != null) {
                        console.error(`Stock ${data.shortname} wasn´t found!`);
                        // Skip to next one
                    }
                    else {
                        // Insert Price for Stocks
                        if (!ticker.includes("^")) {
                            await client.query(
                                `INSERT INTO stock_price(id_stock, price, date) 
                                    VALUES ((SELECT s.id_stock 
                                            FROM stock s JOIN season se ON s.id_season = se.id_season 
                                            WHERE s.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, $3);`,
                                [data.shortname, stock.price, stock.date]
                            );
                        } else {
                            // Insert Price for Index
                            await client.query(
                                `INSERT INTO index_price(id_index, price, date) 
                                    VALUES ((SELECT id_index 
                                            FROM index i JOIN season se ON i.id_season = se.id_season 
                                            WHERE i.shortname = $1 AND se.active_flag = TRUE LIMIT 1), 
                                        $2, $3);`,
                                [data.shortname, stock.price, stock.date]
                            );
                        };
                    }
                };

                await client.query('COMMIT');
                console.log("Old Data search completed for: " + ticker);
            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Error Insert:', err);
            } finally {
                client.release();
            }
        } catch (err) {
            console.error("Error with data:", err);
        }
    });
}

/**
 * Update Index and Stock Prices older than 7 days 
 * Delete minutly data and get last price per day
 */
async function updatePrices() {
    console.log("Start Update Prices!");

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // delete and update old Stock Prices
        await client.query(
            `
            WITH ranked_old_prices AS (
                SELECT 
                    id_stock_price,
                    id_stock,
                    DATE("date") AS day,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_stock, DATE("date")
                        ORDER BY "date" DESC
                    ) AS rn
                FROM stock_price
                WHERE "date"::date <= CURRENT_DATE - INTERVAL '8 days'
            )
            -- delete minutly data
            DELETE FROM stock_price
            WHERE id_stock_price IN (
                SELECT id_stock_price
                FROM ranked_old_prices
                WHERE rn > 1
            );

            WITH ranked_old_prices AS (
                SELECT 
                    id_stock_price,
                    id_stock,
                    DATE("date") AS day,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_stock, DATE("date")
                        ORDER BY "date" DESC
                    ) AS rn
                FROM stock_price
                WHERE "date"::date <= CURRENT_DATE - INTERVAL '8 days'
            )
            -- set date last price
            UPDATE stock_price
            SET date = sub.day::timestamp
            FROM (
                SELECT id_stock_price, day
                FROM ranked_old_prices
                WHERE rn = 1
            ) AS sub
            WHERE stock_price.id_stock_price = sub.id_stock_price;
            `
        );

        // delete and update old Index Prices
        await client.query(
            `
            WITH ranked_old_prices AS (
                SELECT 
                    id_index_price,
                    id_index,
                    DATE("date") AS day,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_index, DATE("date")
                        ORDER BY "date" DESC
                    ) AS rn
                FROM index_price
                WHERE "date"::date <= CURRENT_DATE - INTERVAL '8 days'
            )
            -- delete minutly data
            DELETE FROM index_price
            WHERE id_index_price IN (
                SELECT id_index_price
                FROM ranked_old_prices
                WHERE rn > 1
            );

            WITH ranked_old_prices AS (
                SELECT 
                    id_index_price,
                    id_index,
                    DATE("date") AS day,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_index, DATE("date")
                        ORDER BY "date" DESC
                    ) AS rn
                FROM index_price
                WHERE "date"::date <= CURRENT_DATE - INTERVAL '8 days'
            )
            -- set date last price
            UPDATE index_price
            SET date = sub.day::timestamp
            FROM (
                SELECT id_index_price, day
                FROM ranked_old_prices
                WHERE rn = 1
            ) AS sub
            WHERE index_price.id_index_price = sub.id_index_price;
            `
        );

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error Update:', err);
    } finally {
        client.release();
    }

    console.log("End Update Prices!");
}
exports.updatePrices = updatePrices;

/**
 * Delete Stock and Index Prices older than 2 months  
 */
async function deletePrices() {
    console.log("Start Delete Prices!");

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // delete Stock Prices 
        await client.query(
            `
            DELETE FROM stock_price
            WHERE "date"::date < CURRENT_DATE - INTERVAL '2 months';
            `
        );

        // delete Index Prices 
        await client.query(
            `
            DELETE FROM index_price
            WHERE "date"::date < CURRENT_DATE - INTERVAL '2 months';
            `
        );

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error Delete:', err);
    } finally {
        client.release();
    }

    console.log("End Delete Prices!");
}
exports.deletePrices = deletePrices;

/**
 * Reindex whole Database 
 */
async function reindexDatabase() {
    console.log("Start Reindex Database!");

    const client = await pool.connect();

    try {
        await client.query(
            `
            REINDEX DATABASE swift;
            `
        );
    } catch (err) {
        console.error('Error Reindex:', err);
    } finally {
        client.release();
    }

    console.log("End Reindex Database!");
}
exports.reindexDatabase = reindexDatabase;

/**
 * Seson Reset
 */
async function resetSeason() {
    console.log("Start Reset Season!");

    const client = await pool.connect();

    try {
        // Check if Season Starts today
        const res = await client.query(`
            SELECT *
                FROM season
                WHERE start_date::date = CURRENT_DATE
                LIMIT 1;
        `);

        if (res.rows.length > 0) {
            console.log("Season starts today.");

            console.log("Start Calling Season Reset Route!");

            const response = await fetch(`http://10.100.8.137:8080/runSeasonChange/${encodeURIComponent('1234-swift')}`, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            console.log('Raw response:', text);

            console.log("End Calling Season Reset Route!");

            // Inserting old Data
            console.log("Start Searching Old Data!");

            searchOldPrices();

            console.log("End Searching Old Data!");
        } else {
            console.log("No Season starting today.");
        }
    } catch (err) {
        console.error("Error Reset Season:", err);
    } finally {
        client.release();
    }

    console.log("End Reset Season!");
}
exports.resetSeason = resetSeason;

/**
 * Order Execution
 */
async function executeOrders() {
    console.log("Start Execute Orders!");

    const client = await pool.connect();

    try {
        // get id_orders from Orders that should be executed
        const res = await client.query(`
            SELECT o.id_order
            FROM public.orders o
            LEFT JOIN public.orders_condition oc ON o.id_order = oc.id_order
            JOIN LATERAL (
                SELECT sp.price
                FROM public.stock_price sp
                WHERE sp.id_stock = o.id_stock
                ORDER BY sp.date DESC
                LIMIT 1
            ) AS latest_price ON TRUE
            WHERE 
                o.executed_at IS NULL
                AND o.executed_price_id IS NULL
                AND (
                    -- MARKET-Orders: always
                    o.order_type = 'MARKET'
                    
                    OR
                    
                    -- Limit-/Stop-Test
                    (
                        o.order_type <> 'MARKET' AND (
                            -- Limit-Test
                            (oc.limit_price > 0 AND (
                                (o.bs = FALSE AND latest_price.price <= oc.limit_price)   -- Buy Order
                                OR
                                (o.bs = TRUE AND latest_price.price >= oc.limit_price)  -- Sell Order
                            ))
                            OR
                            -- Stop-Test
                            (oc.stop_price > 0 AND (
                                (o.bs = FALSE AND latest_price.price >= oc.stop_price)    -- Buy Order
                                OR
                                (o.bs = TRUE AND latest_price.price <= oc.stop_price)   -- Sell Order
                            ))
                        )
                    )
                )
            ORDER BY o.id_order ASC;
        `);

        if (res.rows.length > 0) {
            console.log("Start Calling Execute Orders Route!");

            for (const row of res.rows) {
                console.log("Execute Order: "+row.id_order);

                const response = await fetch(`http://10.100.8.137:8080/executeOrder/${encodeURIComponent(row.id_order)}/${encodeURIComponent('suprsecretpasswort')}`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                });

                if (!response.ok) {
                    console.warn('Order couldn´t be executed!');
                    console.warn(`${response.status} ${response.statusText}`);
                }
            }

            console.log("End Calling Execute Orders Route!");
        } else {
            console.log("No Orders to Execute.");
        }
    } catch (err) {
        console.error("Error Execute Orders:", err);
    } finally {
        client.release();
    }

    console.log("End Execute Orders!");
}

/**
 * Get Current Ticker Shortnames from Database
 */
async function getTickers() {
    // connect to Database 
    const client = await pool.connect();
    
    try {
        const res = await client.query(
            `
            SELECT s.shortname
                FROM stock s
                JOIN season se ON s.id_season = se.id_season
                WHERE se.active_flag = true

            UNION ALL

            SELECT i.shortname
                FROM "index" i
                JOIN season se ON i.id_season = se.id_season
                WHERE se.active_flag = true;
            `
        );

        return res.rows.map(row => row.shortname);
    } catch (err) {
        console.error('Error get Tickers:', err);
    } finally {
        client.release();
    }
}