CREATE USER swift WITH PASSWORD '1234';

DROP TABLE IF EXISTS public.season CASCADE;
CREATE TABLE IF NOT EXISTS public.season
(
    id_season_intern bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_season bigint NOT NULL,
    name varchar(50) NOT NULL,
    start_date timestamp(0) without time zone NOT NULL,
    end_date timestamp(0) without time zone,
    start_balance double precision NOT NULL,
    active_flag boolean NOT NULL, 
    CONSTRAINT season_pkey PRIMARY KEY (id_season_intern)
);

DROP TABLE IF EXISTS public.stock CASCADE;
CREATE TABLE IF NOT EXISTS public.stock
(
    id_stock bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name varchar(50) NOT NULL,
    shortname varchar(10) NOT NULL,
    sector varchar(50) DEFAULT NULL,
    industry varchar(50) DEFAULT NULL,
    id_season bigint NOT NULL,
    CONSTRAINT stock_pkey PRIMARY KEY (id_stock)
);

DROP TABLE IF EXISTS public.user_service CASCADE;
CREATE TABLE IF NOT EXISTS public.user_service
(
    id_user varchar(50) NOT NULL,
    name varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    profile_picture varchar(100) NOT NULL,
    user_name varchar(50) NOT NULL,
    CONSTRAINT user_service_pkey PRIMARY KEY (id_user)
);

DROP TABLE IF EXISTS public.stock_price CASCADE;
CREATE TABLE IF NOT EXISTS public.stock_price
(
    id_stock_price bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_stock bigint NOT NULL,
    price double precision NOT NULL,
    date timestamp(0) without time zone NOT NULL,
    CONSTRAINT stock_price_pkey PRIMARY KEY (id_stock_price),
    CONSTRAINT stock_fkey FOREIGN KEY (id_stock) REFERENCES public.stock(id_stock)
);

DROP TABLE IF EXISTS public.bankaccount CASCADE;
CREATE TABLE IF NOT EXISTS public.bankaccount
(
    id_bankaccount bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    startworth double precision NOT NULL,
    current_worth double precision NOT NULL,
    CONSTRAINT bankaccount_pkey PRIMARY KEY (id_bankaccount),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user)
);

DROP TABLE IF EXISTS public.portfolio CASCADE;
CREATE TABLE IF NOT EXISTS public.portfolio
(
    id_portfolio bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    id_stock_price bigint NOT NULL,
    id_stock bigint NOT NULL,
    count double precision NOT NULL,
    value double precision NOT NULL,
    date timestamp(0) without time zone NOT NULL,
    CONSTRAINT portfolio_pkey PRIMARY KEY (id_portfolio),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user),
    CONSTRAINT stock_fkey FOREIGN KEY (id_stock) REFERENCES public.stock(id_stock)
);

DROP TABLE IF EXISTS public.transaction CASCADE;
CREATE TABLE IF NOT EXISTS public.transaction
(
    id_transaction bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    id_stock_price bigint NOT NULL,
    id_stock bigint NOT NULL,
    count double precision NOT NULL,
    value double precision NOT NULL,
    date timestamp(0) without time zone NOT NULL,
    bs boolean NOT NULL,
    CONSTRAINT transaction_pkey PRIMARY KEY (id_transaction),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user),
    CONSTRAINT stock_fkey FOREIGN KEY (id_stock) REFERENCES public.stock(id_stock)
);

DROP TABLE IF EXISTS public.index CASCADE;
CREATE TABLE IF NOT EXISTS public.index
(
    id_index bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name varchar(50) NOT NULL,
    shortname varchar(10) NOT NULL,
    id_season bigint NOT NULL, 
    CONSTRAINT index_pkey PRIMARY KEY (id_index)
);

DROP TABLE IF EXISTS public.index_price CASCADE;
CREATE TABLE IF NOT EXISTS public.index_price
(
    id_index_price bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_index bigint NOT NULL,
    price double precision NOT NULL,
    date timestamp(0) without time zone NOT NULL,
    CONSTRAINT index_price_pkey PRIMARY KEY (id_index_price),
    CONSTRAINT index_fkey FOREIGN KEY (id_index) REFERENCES public.index(id_index)
);

DROP TABLE IF EXISTS public.orders CASCADE;
CREATE TABLE IF NOT EXISTS public.orders
(
    id_order bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    id_stock bigint NOT NULL,
    bs boolean NOT NULL,
    quantity double precision NOT NULL,
    amount double precision NOT NULL,
    order_type varchar(10) NOT NULL, 
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    executed_at timestamp(0) without time zone NOT NULL,
    executed_price_id bigint NOT NULL, 
    executed_price double precision NOT NULL,
    CONSTRAINT order_pkey PRIMARY KEY (id_order),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user),
    CONSTRAINT stock_fkey FOREIGN KEY (id_stock) REFERENCES public.stock(id_stock),
    CONSTRAINT stock_price_fkey FOREIGN KEY (id_executed_price) REFERENCES public.stock_price(id_stock_price)
);

DROP TABLE IF EXISTS public.orders_condition CASCADE;
CREATE TABLE IF NOT EXISTS public.orders_condition
(
    id_order_condition bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_order bigint NOT NULL,
    limit_price double precision NOT NULL,
    stop_price double precision NOT NULL,
    CONSTRAINT order_condition_pkey PRIMARY KEY (id_order_condition),
    CONSTRAINT order_fkey FOREIGN KEY (id_order) REFERENCES public.user_service(id_order)
);

DROP TABLE IF EXISTS public.leaderboard_history CASCADE;
CREATE TABLE IF NOT EXISTS public.leaderboard_history
(
    id_leaderboard_history bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    portfolio_growth double precision NOT NULL,
    id_season bigint NOT NULL,
    CONSTRAINT leaderboard_history_pkey PRIMARY KEY (id_leaderboard_history),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user)
);

/*
DROP TABLE IF EXISTS public.achievement CASCADE;
CREATE TABLE IF NOT EXISTS public.achievement
(
    id_achievement bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name varchar(50) NOT NULL,
    beschreibung_erhalt varchar(200) NOT NULL,
    CONSTRAINT achievement_pkey PRIMARY KEY (id_achievement)
);

DROP TABLE IF EXISTS public.achievement_user CASCADE;
CREATE TABLE IF NOT EXISTS public.achievement_user
(
    id_achievement_user bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    id_user varchar(50) NOT NULL,
    id_achievement bigint NOT NULL,
    CONSTRAINT achievement_user_pkey PRIMARY KEY (id_achievement_user),
    CONSTRAINT user_fkey FOREIGN KEY (id_user) REFERENCES public.user_service(id_user),
    CONSTRAINT achievement_fkey FOREIGN KEY (id_achievement) REFERENCES public.achievement(id_achievement)
);
*/

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO swift;


-- View: public.v_leaderboard

-- DROP VIEW public.v_leaderboard;

CREATE OR REPLACE VIEW public.v_leaderboard
 AS
 WITH users_portfolio AS (
         SELECT u.id_user AS id_users_cust,
            vp.id_stock,
            vp.quantity
           FROM user_service u
             LEFT JOIN LATERAL virtual_portfolio(p_user_id => u.id_user, p_zeit_bis => now()::timestamp without time zone) vp(id_stock, id_user, quantity, average_price) ON true
        ), latest_prices AS (
         SELECT DISTINCT ON (sp.id_stock) sp.id_stock,
            sp.price AS current_price
           FROM stock_price sp
          ORDER BY sp.id_stock, sp.date DESC
        ), portfolio_sum AS (
         SELECT users_portfolio.id_users_cust,
            sum(users_portfolio.quantity::numeric::double precision * latest_prices.current_price) AS portfolio_wert
           FROM users_portfolio
             LEFT JOIN latest_prices ON latest_prices.id_stock = users_portfolio.id_stock
          GROUP BY users_portfolio.id_users_cust
        ), latest_bank AS (
         SELECT DISTINCT ON (bankaccount.id_user) bankaccount.id_user,
            bankaccount.current_worth,
            bankaccount.id_bankaccount
           FROM bankaccount
          ORDER BY bankaccount.id_user, bankaccount.id_bankaccount DESC
        ), index_performance AS (
         SELECT round((unnamed_subquery.last_price_before_end::numeric - unnamed_subquery.first_price_after_start::numeric) / unnamed_subquery.first_price_after_start::numeric * 100::numeric, 2) AS index_performance
           FROM ( SELECT ( SELECT index_price.price
                           FROM index_price
                          WHERE index_price.id_index = index.id_index AND index_price.date > season.start_date
                          ORDER BY index_price.date
                         LIMIT 1) AS first_price_after_start,
                    ( SELECT index_price.price
                           FROM index_price index_price
                          WHERE index_price.id_index = index.id_index AND index_price.date <= season.end_date
                          ORDER BY index_price.date DESC
                         LIMIT 1) AS last_price_before_end
                   FROM index
                     LEFT JOIN season ON season.id_season = index.id_season
                  WHERE season.active_flag = true) unnamed_subquery
        )
 SELECT DISTINCT ps.id_users_cust,
    user_service.user_name,
    user_service.email,
    COALESCE(ps.portfolio_wert, 0::numeric::double precision) + COALESCE(lb.current_worth, 0::double precision) AS depot_balance,
    ip.index_performance,
    round(((COALESCE(ps.portfolio_wert, 0::numeric::double precision) + COALESCE(lb.current_worth, 0::double precision) - s.start_balance::double precision) / s.start_balance::double precision * 100::double precision - ip.index_performance::double precision)::numeric, 2) AS performance_vs_index
   FROM portfolio_sum ps
     LEFT JOIN latest_bank lb ON ps.id_users_cust::text = lb.id_user::text
     LEFT JOIN user_service ON ps.id_users_cust::text = user_service.id_user::text
     CROSS JOIN season s
     CROSS JOIN index_performance ip
  ORDER BY (round(((COALESCE(ps.portfolio_wert, 0::numeric::double precision) + COALESCE(lb.current_worth, 0::double precision) - s.start_balance::double precision) / s.start_balance::double precision * 100::double precision - ip.index_performance::double precision)::numeric, 2)) DESC;

ALTER TABLE public.v_leaderboard
    OWNER TO postgres;


-- Seasons 

INSERT INTO public.season(id_season, name, start_date, end_date, start_balance, active_flag) VALUES
(1, 'NASDAQ 100 Season', '2025-10-27 00:00:00', '2025-11-02 23:59:59', 10000.0, 'TRUE'),
(2, 'S&P 100 Season', '2025-10-20 00:00:00', '2025-10-26 23:59:59', 10000.0, 'FALSE');


-- NASDAQ 100

INSERT INTO public.stock (name, shortname, sector, industry, id_season) VALUES 
('Apple Inc.', 'AAPL', 'Technology', 'Consumer Electronics', 1),
('Adobe Inc.', 'ADBE', 'Technology', 'Software - Application', 1),
('Analog Devices, Inc.', 'ADI', 'Technology', 'Semiconductors', 1),
('Airbnb, Inc.', 'ABNB', 'Consumer Cyclical', 'Travel Services', 1),
('Advanced Micro Devices, Inc.', 'AMD', 'Technology', 'Semiconductors', 1),
('Applied Materials, Inc.', 'AMAT', 'Technology', 'Semiconductor Equipment & Materials', 1),
('Amgen Inc.', 'AMGN', 'Healthcare', 'Drug Manufacturers - General', 1),
('Amazon.com, Inc.', 'AMZN', 'Consumer Cyclical', 'Internet Retail', 1),
('ANSYS, Inc.', 'ANSS', 'Technology', 'Software - Application', 1),
('AppLovin Corporation', 'APP', 'Technology', 'Software - Application', 1),
('Arm Holdings', 'ARM', 'Technology', 'Semiconductors', 1),
('ASML Holding N.V.', 'ASML', 'Technology', 'Semiconductor Equipment & Materials', 1),
('Broadcom Inc.', 'AVGO', 'Technology', 'Semiconductors', 1),
('Axon Enterprise, Inc.', 'AXON', 'Industrials', 'Aerospace & Defense', 1),
('AstraZeneca PLC', 'AZN', 'Healthcare', 'Drug Manufacturers - General', 1),
('Biogen Inc.', 'BIIB', 'Healthcare', 'Drug Manufacturers - General', 1),
('Booking Holdings Inc.', 'BKNG', 'Consumer Cyclical', 'Travel Services', 1),
('Baker Hughes Company', 'BKR', 'Energy', 'Oil & Gas Equipment & Services', 1),
('Cadence Design Systems, Inc.', 'CDNS', 'Technology', 'Software - Application', 1),
('CDW Corporation', 'CDW', 'Technology', 'Information Technology Services', 1),
('Charter Communications, Inc.', 'CHTR', 'Communication Services', 'Telecom Services', 1),
('Comcast Corporation', 'CMCSA', 'Communication Services', 'Telecom Services', 1),
('Costco Wholesale Corporation', 'COST', 'Consumer Defensive', 'Discount Stores', 1),
('Copart, Inc.', 'CPRT', 'Industrials', 'Specialty Business Services', 1),
('CrowdStrike Holdings, Inc.', 'CRWD', 'Technology', 'Software - Infrastructure', 1),
('Cisco Systems, Inc.', 'CSCO', 'Technology', 'Communication Equipment', 1),
('CoStar Group, Inc.', 'CSGP', 'Real Estate', 'Real Estate Services', 1),
('CSX Corporation', 'CSX', 'Industrials', 'Railroads', 1),
('Cintas Corporation', 'CTAS', 'Industrials', 'Specialty Business Services', 1),
('Cognizant Technology Solutions Corporation', 'CTSH', 'Technology', 'Information Technology Services', 1),
('Datadog, Inc.', 'DDOG', 'Technology', 'Software - Application', 1),
('Deere & Company', 'DE', 'Industrials', 'Farm & Heavy Construction Machinery', 1),
('Dexcom, Inc.', 'DXCM', 'Healthcare', 'Medical Devices', 1),
('Electronic Arts Inc.', 'EA', 'Communication Services', 'Electronic Gaming & Multimedia', 1),
('eBay Inc.', 'EBAY', 'Consumer Cyclical', 'Internet Retail', 1),
('Exelon Corporation', 'EXC', 'Utilities', 'Utilities - Regulated Electric', 1),
('Fastenal Company', 'FAST', 'Industrials', 'Industrial Distribution', 1),
('Fiserv Inc', 'FI', 'Technology', 'Information Technology Services', 1), -- Korrigierte Daten und Ticker
('Fortinet, Inc.', 'FTNT', 'Technology', 'Software - Infrastructure', 1),
('Gilead Sciences, Inc.', 'GILD', 'Healthcare', 'Drug Manufacturers - General', 1),
('Alphabet Inc. (GOOG)', 'GOOG', 'Communication Services', 'Internet Content & Information', 1),
('Alphabet Inc. (GOOGL)', 'GOOGL', 'Communication Services', 'Internet Content & Information', 1),
('Honeywell International Inc.', 'HON', 'Industrials', 'Conglomerates', 1),
('IDEXX Laboratories, Inc.', 'IDXX', 'Healthcare', 'Diagnostics & Research', 1),
('Illumina, Inc.', 'ILMN', 'Healthcare', 'Diagnostics & Research', 1),
('Intel Corporation', 'INTC', 'Technology', 'Semiconductors', 1),
('Intuit Inc.', 'INTU', 'Technology', 'Software - Application', 1),
('Intuitive Surgical, Inc.', 'ISRG', 'Healthcare', 'Medical Instruments & Supplies', 1),
('J.B. Hunt Transport Services, Inc.', 'JBHT', 'Industrials', 'Integrated Freight & Logistics', 1),
('Keurig Dr Pepper Inc.', 'KDP', 'Consumer Defensive', 'Beverages - Non-Alcoholic', 1),
('The Kraft Heinz Company', 'KHC', 'Consumer Defensive', 'Packaged Foods', 1),
('KLA Corporation', 'KLAC', 'Technology', 'Semiconductor Equipment & Materials', 1),
('Linde plc', 'LIN', 'Basic Materials', 'Specialty Chemicals', 1),
('Lam Research Corporation', 'LRCX', 'Technology', 'Semiconductor Equipment & Materials', 1),
('Lululemon Athletica Inc.', 'LULU', 'Consumer Cyclical', 'Apparel Retail', 1),
('Marriott International, Inc.', 'MAR', 'Consumer Cyclical', 'Lodging', 1),
('Microchip Technology Incorporated', 'MCHP', 'Technology', 'Semiconductors', 1),
('Mondelez International, Inc.', 'MDLZ', 'Consumer Defensive', 'Confectioners', 1),
('MercadoLibre, Inc.', 'MELI', 'Consumer Cyclical', 'Internet Retail', 1),
('Meta Platforms, Inc.', 'META', 'Communication Services', 'Internet Content & Information', 1),
('Monster Beverage Corporation', 'MNST', 'Consumer Defensive', 'Beverages - Non-Alcoholic', 1),
('Moderna, Inc.', 'MRNA', 'Healthcare', 'Biotechnology', 1),
('Marvell Technology, Inc.', 'MRVL', 'Technology', 'Semiconductors', 1),
('MSCI Inc.', 'MSCI', 'Financial Services', 'Financial Data & Stock Exchanges', 1),
('Microsoft Corporation', 'MSFT', 'Technology', 'Software - Infrastructure', 1),
('Micron Technology, Inc.', 'MU', 'Technology', 'Semiconductors', 1),
('Netflix, Inc.', 'NFLX', 'Communication Services', 'Entertainment', 1),
('NVIDIA Corporation', 'NVDA', 'Technology', 'Semiconductors', 1),
('NXP Semiconductors N.V.', 'NXPI', 'Technology', 'Semiconductors', 1),
('Old Dominion Freight Line, Inc.', 'ODFL', 'Industrials', 'Trucking', 1),
('O''Reilly Automotive, Inc.', 'ORLY', 'Consumer Cyclical', 'Auto Parts', 1),
('Palo Alto Networks, Inc.', 'PANW', 'Technology', 'Software - Infrastructure', 1),
('Paychex, Inc.', 'PAYX', 'Technology', 'Software - Application', 1),
('PACCAR Inc.', 'PCAR', 'Industrials', 'Farm & Heavy Construction Machinery', 1),
('Pinduoduo Inc.', 'PDD', 'Consumer Cyclical', 'Internet Retail', 1),
('PepsiCo, Inc.', 'PEP', 'Consumer Defensive', 'Beverages - Non-Alcoholic', 1),
('Palantir Technologies Inc.', 'PLTR', 'Technology', 'Software - Infrastructure', 1),
('PayPal Holdings, Inc.', 'PYPL', 'Financial Services', 'Credit Services', 1),
('Qualcomm Incorporated', 'QCOM', 'Technology', 'Semiconductors', 1),
('Regeneron Pharmaceuticals, Inc.', 'REGN', 'Healthcare', 'Biotechnology', 1),
('Ross Stores, Inc.', 'ROST', 'Consumer Cyclical', 'Apparel Retail', 1),
('Starbucks Corporation', 'SBUX', 'Consumer Cyclical', 'Restaurants', 1),
('Seagen Inc', 'SGENX', 'Healthcare', 'Biotechnology', 1), -- Korrigierte Daten und Ticker
('SiriusXM Holdings Inc.', 'SIRI', 'Communication Services', 'Entertainment', 1),
('Synopsys, Inc.', 'SNPS', 'Technology', 'Software - Infrastructure', 1),
('Trip.com Group Limited', 'TCOM', 'Consumer Cyclical', 'Travel Services', 1),
('Atlassian Corporation Plc', 'TEAM', 'Technology', 'Software - Application', 1),
('T-Mobile US, Inc.', 'TMUS', 'Communication Services', 'Telecom Services', 1),
('Tesla, Inc.', 'TSLA', 'Consumer Cyclical', 'Auto Manufacturers', 1),
('Texas Instruments Incorporated', 'TXN', 'Technology', 'Semiconductors', 1),
('Verisk Analytics, Inc.', 'VRSK', 'Industrials', 'Consulting Services', 1),
('Vertex Pharmaceuticals Incorporated', 'VRTX', 'Healthcare', 'Biotechnology', 1),
('Walgreens Boots Alliance, Inc.', 'WBA', 'Healthcare', 'Pharmaceutical Retailers', 1),
('Workday, Inc.', 'WDAY', 'Technology', 'Software - Application', 1),
('Xcel Energy Inc.', 'XEL', 'Utilities', 'Utilities - Regulated Electric', 1),
('Zoom Video Communications, Inc.', 'ZM', 'Technology', 'Software - Application', 1),
('Zscaler, Inc.', 'ZS', 'Technology', 'Software - Infrastructure', 1);

INSERT INTO public.index(name, shortname, id_season) VALUES ('NASDAQ 100', '^NDX', 1);


-- S&P 100

INSERT INTO public.stock (name, shortname, sector, industry, id_season) VALUES 
('Apple Inc.', 'AAPL', 'Technology', 'Consumer Electronics', 2),
('AbbVie', 'ABBV', 'Healthcare', 'Drug Manufacturers - General', 2),
('Abbott Laboratories', 'ABT', 'Healthcare', 'Medical Devices', 2),
('Accenture', 'ACN', 'Technology', 'Information Technology Services', 2),
('Adobe Inc.', 'ADBE', 'Technology', 'Software - Application', 2),
('American International Group', 'AIG', 'Financial Services', 'Insurance - Diversified', 2),
('Advanced Micro Devices', 'AMD', 'Technology', 'Semiconductors', 2),
('Amgen', 'AMGN', 'Healthcare', 'Drug Manufacturers - General', 2),
('American Tower', 'AMT', 'Real Estate', 'REIT - Specialty', 2),
('Amazon', 'AMZN', 'Consumer Cyclical', 'Internet Retail', 2),
('Broadcom', 'AVGO', 'Technology', 'Semiconductors', 2),
('American Express', 'AXP', 'Financial Services', 'Credit Services', 2),
('Boeing', 'BA', 'Industrials', 'Aerospace & Defense', 2),
('Bank of America', 'BAC', 'Financial Services', 'Banks - Diversified', 2),
('BNY Mellon', 'BK', 'Financial Services', 'Banks - Diversified', 2),
('Booking Holdings', 'BKNG', 'Consumer Cyclical', 'Travel Services', 2),
('BlackRock', 'BLK', 'Financial Services', 'Asset Management', 2),
('Bristol Myers Squibb', 'BMY', 'Healthcare', 'Drug Manufacturers - General', 2),
('Berkshire Hathaway (Class B)', 'BRK-B', 'Financial Services', 'Insurance - Diversified', 2),
('Citigroup', 'C', 'Financial Services', 'Banks - Diversified', 2),
('Caterpillar Inc.', 'CAT', 'Industrials', 'Farm & Heavy Construction Machinery', 2),
('Colgate-Palmolive', 'CL', 'Consumer Defensive', 'Household & Personal Products', 2),
('Comcast', 'CMCSA', 'Communication Services', 'Telecom Services', 2),
('Capital One', 'COF', 'Financial Services', 'Credit Services', 2),
('ConocoPhillips', 'COP', 'Energy', 'Oil & Gas E&P', 2),
('Costco', 'COST', 'Consumer Defensive', 'Discount Stores', 2),
('Salesforce', 'CRM', 'Technology', 'Software - Application', 2),
('Cisco', 'CSCO', 'Technology', 'Communication Equipment', 2),
('CVS Health', 'CVS', 'Healthcare', 'Healthcare Plans', 2),
('Chevron Corporation', 'CVX', 'Energy', 'Oil & Gas Integrated', 2),
('Deere & Company', 'DE', 'Industrials', 'Farm & Heavy Construction Machinery', 2),
('Danaher Corporation', 'DHR', 'Healthcare', 'Diagnostics & Research', 2),
('Walt Disney Company (The)', 'DIS', 'Communication Services', 'Entertainment', 2),
('Duke Energy', 'DUK', 'Utilities', 'Utilities - Regulated Electric', 2),
('Emerson Electric', 'EMR', 'Industrials', 'Specialty Industrial Machinery', 2),
('FedEx', 'FDX', 'Industrials', 'Integrated Freight & Logistics', 2),
('General Dynamics', 'GD', 'Industrials', 'Aerospace & Defense', 2),
('GE Aerospace', 'GE', 'Industrials', 'Aerospace & Defense', 2),
('Gilead Sciences', 'GILD', 'Healthcare', 'Drug Manufacturers - General', 2),
('General Motors', 'GM', 'Consumer Cyclical', 'Auto Manufacturers', 2),
('Alphabet Inc. (Class C)', 'GOOG', 'Communication Services', 'Internet Content & Information', 2),
('Alphabet Inc. (Class A)', 'GOOGL', 'Communication Services', 'Internet Content & Information', 2),
('Goldman Sachs', 'GS', 'Financial Services', 'Capital Markets', 2),
('Home Depot', 'HD', 'Consumer Cyclical', 'Home Improvement Retail', 2),
('Honeywell', 'HON', 'Industrials', 'Conglomerates', 2),
('IBM', 'IBM', 'Technology', 'Information Technology Services', 2),
('Intel', 'INTC', 'Technology', 'Semiconductors', 2),
('Intuit', 'INTU', 'Technology', 'Software - Application', 2),
('Intuitive Surgical', 'ISRG', 'Healthcare', 'Medical Instruments & Supplies', 2),
('Johnson & Johnson', 'JNJ', 'Healthcare', 'Drug Manufacturers - General', 2),
('JPMorgan Chase', 'JPM', 'Financial Services', 'Banks - Diversified', 2),
('Coca-Cola Company (The)', 'KO', 'Consumer Defensive', 'Beverages - Non-Alcoholic', 2),
('Linde plc', 'LIN', 'Basic Materials', 'Specialty Chemicals', 2),
('Eli Lilly and Company', 'LLY', 'Healthcare', 'Drug Manufacturers - General', 2),
('Lockheed Martin', 'LMT', 'Industrials', 'Aerospace & Defense', 2),
('Lowe''s', 'LOW', 'Consumer Cyclical', 'Home Improvement Retail', 2),
('Mastercard', 'MA', 'Financial Services', 'Credit Services', 2),
('McDonald''s', 'MCD', 'Consumer Cyclical', 'Restaurants', 2),
('Mondelēz International', 'MDLZ', 'Consumer Defensive', 'Confectioners', 2),
('Medtronic', 'MDT', 'Healthcare', 'Medical Devices', 2),
('MetLife', 'MET', 'Financial Services', 'Insurance - Life', 2),
('Meta Platforms', 'META', 'Communication Services', 'Internet Content & Information', 2),
('3M', 'MMM', 'Industrials', 'Conglomerates', 2),
('Altria', 'MO', 'Consumer Defensive', 'Tobacco', 2),
('Merck & Co.', 'MRK', 'Healthcare', 'Drug Manufacturers - General', 2),
('Morgan Stanley', 'MS', 'Financial Services', 'Capital Markets', 2),
('Microsoft', 'MSFT', 'Technology', 'Software - Infrastructure', 2),
('NextEra Energy', 'NEE', 'Utilities', 'Utilities - Regulated Electric', 2),
('Netflix, Inc.', 'NFLX', 'Communication Services', 'Entertainment', 2),
('Nike, Inc.', 'NKE', 'Consumer Cyclical', 'Footwear & Accessories', 2),
('ServiceNow', 'NOW', 'Technology', 'Software - Application', 2),
('Nvidia', 'NVDA', 'Technology', 'Semiconductors', 2),
('Oracle Corporation', 'ORCL', 'Technology', 'Software - Infrastructure', 2),
('PepsiCo', 'PEP', 'Consumer Defensive', 'Beverages - Non-Alcoholic', 2),
('Pfizer', 'PFE', 'Healthcare', 'Drug Manufacturers - General', 2),
('Procter & Gamble', 'PG', 'Consumer Defensive', 'Household & Personal Products', 2),
('Palantir Technologies', 'PLTR', 'Technology', 'Software - Infrastructure', 2),
('Philip Morris International', 'PM', 'Consumer Defensive', 'Tobacco', 2),
('PayPal', 'PYPL', 'Financial Services', 'Credit Services', 2),
('Qualcomm', 'QCOM', 'Technology', 'Semiconductors', 2),
('RTX Corporation', 'RTX', 'Industrials', 'Aerospace & Defense', 2),
('Starbucks', 'SBUX', 'Consumer Cyclical', 'Restaurants', 2),
('Charles Schwab Corporation', 'SCHW', 'Financial Services', 'Capital Markets', 2),
('Southern Company', 'SO', 'Utilities', 'Utilities - Regulated Electric', 2),
('Simon Property Group', 'SPG', 'Real Estate', 'REIT - Retail', 2),
('AT&T', 'T', 'Communication Services', 'Telecom Services', 2),
('Target Corporation', 'TGT', 'Consumer Defensive', 'Discount Stores', 2),
('Thermo Fisher Scientific', 'TMO', 'Healthcare', 'Diagnostics & Research', 2),
('T-Mobile US', 'TMUS', 'Communication Services', 'Telecom Services', 2),
('Tesla, Inc.', 'TSLA', 'Consumer Cyclical', 'Auto Manufacturers', 2),
('Texas Instruments', 'TXN', 'Technology', 'Semiconductors', 2),
('Uber', 'UBER', 'Technology', 'Software - Application', 2),
('UnitedHealth Group', 'UNH', 'Healthcare', 'Healthcare Plans', 2),
('Union Pacific Corporation', 'UNP', 'Industrials', 'Railroads', 2),
('United Parcel Service', 'UPS', 'Industrials', 'Integrated Freight & Logistics', 2),
('U.S. Bancorp', 'USB', 'Financial Services', 'Banks - Regional', 2),
('Visa Inc.', 'V', 'Financial Services', 'Credit Services', 2),
('Verizon', 'VZ', 'Communication Services', 'Telecom Services', 2),
('Wells Fargo', 'WFC', 'Financial Services', 'Banks - Diversified', 2),
('Walmart', 'WMT', 'Consumer Defensive', 'Discount Stores', 2),
('ExxonMobil', 'XOM', 'Energy', 'Oil & Gas Integrated', 2);

INSERT INTO public.index(name, shortname, id_season) VALUES ('S&P 100', '^SP100', 2);