8080# Starten des Backends 
Zum Starten dieser Komponente wird mindestens eine Datenbank benötigt.<br>
Mehr Informationen wie diese aussehen muss finden Sie in der [Datenbank Dokumentation](../../dokumentation/datenbankmodell.md).

## lokal 
+ [gradle_example.properties](./src/main/resources/application_example.properties)
    + **_example** entfernen 
    + Datenbankvariablen an anpassen auf eigene Datenbank
+ `./gradlew bootRun`

## produktiv 
Bitte beachten Sie das die Produktivumgebung für den Betrieb innerhalb der Infrastruktur der TH-Wildau ausgelegt ist! <br>
+ [application_example.properties](./src/main/resources/application_example.properties)
    + **_example** entfernen 
    + Datenbankvariablen an anpassen auf Server Datenbank
+ Proxyeinstellungen (falls vorhanden)
    + im aktuellen Verzeichnis Datei "**gradle.properties**"
    + Beispiel Inhalt für Proxy der TH-Wildau
        + ```conf
          systemProp.http.proxyHost=proxy.th-wildau.de
          systemProp.http.proxyPort=8080
          systemProp.https.proxyHost=proxy.th-wildau.de
          systemProp.https.proxyPort=8080
          ```
+ `docker build -t backend .`
+ `docker run -e TZ=Europe/Berlin -d --restart unless-stopped --name backend -p 8080:8080 backend`
+ Container anhalten und entfernen (im Falle eines Updates)
    + `docker stop backend `
    + `docker rm backend`

# Routenbeschreibungen
- [Bankaccount Routen](#bankaccount)
- [Index Routen](#index)
- [Portfolio Routen](#portfolio)
- [Stock Routen](#stock)
- [Transaction Routen](#transaction)
- [Sonstige Routen](#sonstige)

## Bankaccount
+ **GET /getCurrentWorthBankaccount/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getCurrentWorthBankaccount/1234-swift`
    + Beschreibung
    ```md
    Gibt das aktuelle Bankaccountguthaben des Users an.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "idUser": "1",
        "currentWorth": 9999.905014038086
    }
    ```

## Index
+ **GET /loadIndexes/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/loadIndexes/1234-swift`
    + Beschreibung
    ```md
    Gibt eine Liste aller in SIWFT verfügbaren Indizes sowie deren Kuerzel zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id": 1,
            "indexname": "NASDAQ 100",
            "shortname": "^NDX"
        }
    ]
    ```
    
+ **GET /getIndex/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getIndex/1/1234-swift`
    + Beschreibung
    ```md
    Gibt Namen und Kuerzel eines bestimmten Index zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id": 1,
        "indexname": "NASDAQ 100",
        "shortname": "^NDX"
    }
    ```

+ **GET /getCurrentIndex/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getCurrentIndex/1/1234-swift`
    + Beschreibung
    ```md
    Gibt den Namen, das Kürzel und die prozentuale Veränderung gegenüber dem Vortag eines bestimmten Index zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "index": "NASDAQ 100",
        "current index growth": "+0.00%",
        "date": "2025-07-21T22:10:11"
    }
    ```

+ **GET /getIndexValueByHour/{dateTime}/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getIndexValueByHour/2025-07-22%2015:02:59/1/1234-swift`
    + Beschreibung
    ```md
    Gibt alle Kursabfragen eines bestimmten Index mit dem jeweiligen Kurswert und dem zugehörigen Zeitpunkt innerhalb der angegebenen Stunde zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "value": 23228.501953125,
            "date": "2025-07-21T21:01:11"
        },
        {
            "value": 23228.501953125,
            "date": "2025-07-21T21:02:10"
        },
        {
            "value": 23226.548828125,
            "date": "2025-07-21T21:03:11"
        },
        ...
    ]
    ```

+ **GET /getIndexValueByDay/{date}/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getIndexValueByDay/2025-07-22/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Stunde eine Kursabfrage eines bestimmten Index für den angegebenen Tag zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "value": 23214.19921875,
            "date": "2025-07-21T16:00:14"
        },
        {
            "value": 23235.890625,
            "date": "2025-07-21T17:00:12"
        },
        {
            "value": 23227.212890625,
            "date": "2025-07-21T18:00:12"
        },
        ...
    ]
    ```

+ **GET /getIndexValueByWeek/{dateTime}/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getIndexValueByWeek/2025-07-22T15:02:59/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Tag jeweils eine Kursabfrage eines bestimmten Index für die sieben Handelstage vor dem angegebenen Tag zurück. 
    Wochenendtage werden dabei übersprungen.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "idIndex": 1,
            "value": 22884.587890625,
            "date": "2025-07-15T22:10:17"
        },
        {
            "idIndex": 1,
            "value": 22907.966796875,
            "date": "2025-07-16T22:10:11"
        },
        {
            "idIndex": 1,
            "value": 23078.03515625,
            "date": "2025-07-17T22:10:12"
        },
        ...
    ]
    ```

+ **GET /getIndexValueByMonth/{dateTime}/{IDIndex}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getIndexValueByMonth/2025-07-22T15:02:59/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Tag jeweils eine Kursabfrage eines bestimmten Index für die 30 Handelstage vor dem angegebenen Tag zurück. 
    Wochenendtage werden dabei übersprungen.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "idIndex": 1,
            "value": 21856.330078125,
            "date": "2025-06-23T00:00:00"
        },
        {
            "idIndex": 1,
            "value": 22190.521484375,
            "date": "2025-06-24T00:00:00"
        },
        {
            "idIndex": 1,
            "value": 22237.7421875,
            "date": "2025-06-25T00:00:00"
        },
        ...
    ]
    ```

## Portfolio
+ **GET /{token}/portfolio**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/1234-swift/portfolio`
    + Beschreibung
    ```md
    Gibt eine Liste der Aktien zurück, die sich im Portfolio des Users befinden. 
    Jeder Eintrag enthält die User-ID (idUser), die Aktien-ID (idStock), den Kaufpreis der Aktie (value), sowie die Anzahl der gehaltenen Aktienanteile (count).
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "idUser": "1",
            "idStock": 4,
            "value": 137.419998168945,
            "count": 1
        },
        {
            "idUser": "1",
            "idStock": 68,
            "value": 154.309997558594,
            "count": 65
        },
        {
            "idUser": "1",
            "idStock": 82,
            "value": 92.6600036621094,
            "count": 1
        },
        ...
    ]
    ```

+ **GET /chart/daily/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/chart/daily/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Homepage-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jede der letzten 24 Stunden wird dabei die Summe aus dem aktuellen Portfoliowert und dem Bankguthaben berechnet.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 9999.905014038086,
            "snapshotTime": "2025-07-18T18:34:20"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-18T17:34:20"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-18T16:34:20"
        },
        ...
    ]
    ```

+ **GET /chart/weekly/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/chart/weekly/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Homepage-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 7 Tage wird dabei die Summe aus dem aktuellen Portfoliowert und dem Bankguthaben berechnet.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 9999.905014038086,
            "snapshotTime": "2025-07-18T18:37:24"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-17T18:37:24"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-16T18:37:24"
        },
        ...
    ]
    ```

+ **GET /chart/monthly/{token}** 
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/chart/monthly/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Homepage-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 30 Tage wird dabei die Summe aus dem aktuellen Portfoliowert und dem Bankguthaben berechnet.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 9999.905014038086,
            "snapshotTime": "2025-07-18T18:39:13"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-17T18:39:13"
        },
        {
            "gesamtBetrag": 10000,
            "snapshotTime": "2025-07-16T18:39:13"
        },
        ...
    ]
    ```

+ **GET /{token}/currentPortfolio**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/1234-swift/currentPortfolio`
    + Beschreibung
    ```md
    Gibt eine Liste der Aktien zurück, die sich im Portfolio des Users befinden. 
    Jeder Eintrag enthält die User-ID (idUser), die Aktien-ID (idStock), den aktuellen Kurswert der Aktie (latestPrice), sowie die Anzahl der gehaltenen Aktienanteile (count).
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "latestPrice": 138.070007324219,
            "count": 1,
            "idUser": "1",
            "idStock": 4
        },
        {
            "latestPrice": 171.380004882813,
            "count": 65,
            "idUser": "1",
            "idStock": 68
        },
        {
            "latestPrice": 92.6600036621094,
            "count": 1,
            "idUser": "1",
            "idStock": 82
        },
        ...
    ]
    ```

+ **GET /getPortfolioValueToday/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getPortfolioValueToday/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jede der letzten 24 Stunden wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert zurückgegeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 14329.6654338837,
            "snapshotTime": "2025-07-22T15:02:59"
        },
        {
            "gesamtBetrag": 14237.0054302216,
            "snapshotTime": "2025-07-22T14:02:59"
        },
        {
            "gesamtBetrag": 14237.0054302216,
            "snapshotTime": "2025-07-22T13:02:59"
        },
        ...
    ]
    ```

+ **GET /getPortfolioValueLastWeek/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getPortfolioValueLastWeek/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 7 Tage wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert zurückgegeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 14329.6654338837,
            "snapshotTime": "2025-07-22T15:02:21"
        },
        {
            "gesamtBetrag": 14282.3203334808,
            "snapshotTime": "2025-07-21T15:02:21"
        },
        {
            "gesamtBetrag": 14282.3203334808,
            "snapshotTime": "2025-07-20T15:02:21"
        },
        ...
    ]
    ```

+ **GET /getPortfolioValueLastMonth/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getPortfolioValueLastMonth/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 30 Tage wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert zurückgegeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": 14329.6654338837,
            "snapshotTime": "2025-07-22T15:01:50"
        },
        {
            "gesamtBetrag": 14282.3203334808,
            "snapshotTime": "2025-07-21T15:01:50"
        },
        {
            "gesamtBetrag": 14282.3203334808,
            "snapshotTime": "2025-07-20T15:01:50"
        },
        ...
    ]
    ```

+ **GET /getRelativePortfolioValueToday/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getRelativePortfolioValueToday/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jede der letzten 24 Stunden wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert abzüglich des Kaufpreises zurückgegeben. 
    Dieser Chart zeigt die Gewinne / Verluste der letzten 24 Stunden des Portfolios an.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "gesamtBetrag": null,
            "snapshotTime": "2025-07-22T21:12:52"
        },
        {
            "gesamtBetrag": null,
            "snapshotTime": "2025-07-22T20:12:52"
        },
        {
            "gesamtBetrag": null,
            "snapshotTime": "2025-07-22T19:12:52"
        },
        ...
    ]
    ```

+ **GET /getRelativePortfolioValueLastWeek/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getRelativePortfolioValueLastWeek/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 7 Tage wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert abzüglich des Kaufpreises zurückgegeben. 
    Dieser Chart zeigt die Gewinne / Verluste der letzten 7 Tage des Portfolios an.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "snapshotTime": "2025-07-19T12:10:10",
            "gesamtBetrag": null
        },
        {
            "snapshotTime": "2025-07-18T12:10:10",
            "gesamtBetrag": null
        },
        {
            "snapshotTime": "2025-07-17T12:10:10",
            "gesamtBetrag": null
        },
        ...
    ]
    ```

+ **GET /getRelativePortfolioValueLastMonth/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getRelativePortfolioValueLastMonth/1234-swift`
    + Beschreibung
    ```md
    Gibt die Werte für den Portfolio-Chart zurück, mit Daten für die X- und Y-Achse. 
    Für jeden Tag der letzten 30 Tage wird dabei der zu dem jeweiligen Zeitpunkt bestehende Portfoliowert abzüglich des Kaufpreises zurückgegeben. 
    Dieser Chart zeigt die Gewinne / Verluste der letzten 30 Tage des Portfolios an.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "snapshotTime": "2025-07-19T12:11:05",
            "gesamtBetrag": null
        },
        {
            "snapshotTime": "2025-07-18T12:11:05",
            "gesamtBetrag": null
        },
        {
            "snapshotTime": "2025-07-17T12:11:05",
            "gesamtBetrag": null
        },
        ...
    ]
    ```

## Stock
+ **GET /getStock/{IDStock}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStock/1/1234-swift`
    + Beschreibung
    ```md
    Gibt Stammdaten einer bestimmten Aktie zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id": 1,
        "stockname": "Apple Inc.",
        "shortname": "AAPL",
        "sector": "Technology",
        "industry": "Consumer Electronics"
    }
    ```

+ **GET /loadStocks/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/loadStocks/1234-swift`
    + Beschreibung
    ```md
    Alle Informationen der Verfügbaren Aktien übergeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id":1,
            "stockname":"Apple Inc.",
            "shortname":"AAPL",
            "sector":"Technology",
            "industry":"Consumer Electronics"
        },
        ...
    ]
    ```

+ **POST /buyStock/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/buyStock/1234-swift`
        + RequestBody
        ```JSON
        {
            "id_stock": 1,
            "count": 5
        }
        ```
    + Beschreibung
    ```md
    Führt Logik aus um als User Aktien zu kaufen. 
    Dabei wird der Kaufbetrag dem Bankkonto abgezogen und die Anzahl der gekauften Aktien im Portfolio hinterlegt.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id": 515,
        "count": 5,
        "value": 211.05499267578125,
        "date": "2025-07-18T18:11:08.0111827",
        "bs": false,
        "idUser": "1",
        "idStockPrice": 1735127,
        "idStock": 1,
        "id_user": "1",
        "id_stock": 1,
        "id_stock_price": 1735127
    }
    ```

+ **POST /sellStock/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/sellStock/1234-swift` 
        + RequestBody
        ```JSON
        {
            "idStock": 1,
            "count": 5
        }
        ```
    + Beschreibung
    ```md
    Führt Logik aus um als User Aktien zu verkaufen. 
    Dabei wird der Verkaufsbetrag dem Bankkonto hinzugefügt und die Anzahl der verkauften Aktien aus dem Portfolio entfernt.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id": 516,
        "count": 5,
        "value": 210.9600067138672,
        "date": "2025-07-18T18:14:32.7867818",
        "bs": true,
        "idUser": "1",
        "idStockPrice": 1735503,
        "idStock": 1,
        "id_user": "1",
        "id_stock": 1,
        "id_stock_price": 1735503
    }
    ```
 
+ **GET /getcurrentStockPrice/{IDStock}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getcurrentStockPrice/1/1234-swift`
    + Beschreibung
    ```md
    Gibt den aktuellen Wert einer bestimmten Aktie, sowie das Datum wann dieser Wert zuletzt ermittelt wurde zurück. 
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id": 1757592,
        "idStock": 1,
        "price": 211.17999267578125,
        "date": "2025-07-18T22:10:11"
    }
    ```

+ **GET /getStockPricesByPeriod/{IDStock}/{date}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockPricesByPeriod/1/2025-07-18/1234-swift`
    + Beschreibung
    ```md
    Gibt alle Werte einer Aktie von der Gegenwart bis zum angegebenen vergangenen Zeipunkt zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id": 1945904,
            "idStock": 1,
            "price": 213.880004882813,
            "date": "2025-07-25T22:10:11"
        },
        {
            "id": 1945810,
            "idStock": 1,
            "price": 213.880004882813,
            "date": "2025-07-25T22:09:10"
        },
        {
            "id": 1945716,
            "idStock": 1,
            "price": 213.880004882813,
            "date": "2025-07-25T22:08:11"
        },
        ...
    ]
    ```

+ **GET /getStockPricesFromDate/{IDStock}/{date}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockPricesFromDate/1/2025-07-18/1234-swift`
    + Beschreibung
    ```md
    Gibt alle Werte einer Aktie vom angegebenen vergangenen Zeipunkt bis zur Gegenwart zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id_stock": 1,
            "id_stock_price": 1757592,
            "datum": "2025-07-18 00:00:00",
            "wert": 211.18
        },
        {
            "id_stock": 1,
            "id_stock_price": 1757725,
            "datum": "2025-07-21 15:31:16",
            "wert": 211.96
        },
        {
            "id_stock": 1,
            "id_stock_price": 1757818,
            "datum": "2025-07-21 15:32:16",
            "wert": 212.22
        },
        ...
    ]
    ```

+ **POST /getStockGrowth/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockGrowth/1234-swift`
        + RequestBody
        ```JSON
        [
            1, 
            2, 
            3
        ]
        ```
    + Beschreibung
    ```md
    Berechnet für eine Liste von Aktien-IDs das Kurswachstum seit dem letzten Handelstag. 
    Dafür wird der aktuelle Kurs mit dem Kurs vom Vortag (22:01 Uhr) verglichen. 
    Das Ergebnis enthält die absolute und prozentuale Veränderung je Aktie.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id_stock":1,
            "id_stock_price":1829821,
            "datum":"2025-07-22T21:37:11",
            "wert":214.23519897460938,
            "procent":0.7975937433075878,
            "change":1.6952056884765625
        },
        {
            "id_stock":2,
            "id_stock_price":1829822,
            "datum":"2025-07-22T21:37:11",
            "wert":372.2300109863281,
            "procent":1.2487802772438645,
            "change":4.59100341796875
        },
        {
            "id_stock":3,
            "id_stock_price":1829823,
            "datum":"2025-07-22T21:37:11",
            "wert":236.14500427246094,
            "procent":-1.769962450937343,
            "change":-4.2549896240234375
        }
    ]
    ```

+ **GET /getStockPriceByHour/{dateTime}/{IDStock}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockPriceByHour/2025-07-22%2015:02:59/1/1234-swift`
    + Beschreibung
    ```md
    Gibt alle Preisabfragen einer Aktie innerhalb einer Stunde bis zum angegeben Zeitpunkt zurück. 
    Liegt der Zeitpunkt außerhalb der Handleszeiten wird die letzte Stunde des letzten Handlestages zurückgegeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "value": 213.33999633789062,
            "date": "2025-07-22T16:03:15"
        },
        {
            "value": 213.38999938964844,
            "date": "2025-07-22T16:04:14"
        },
        {
            "value": 213.3300018310547,
            "date": "2025-07-22T16:05:16"
        },
        ...
    ]
    ```

+ **GET /getStockPriceByDay/{date}/{IDStock}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockPriceByDay/2025-07-18/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Stunde den Preis einer Aktie vom angegebenen Tag zurück. 
    Liegt der angegebene Tag außerhalb der Handleszeiten werden die Daten des letzten Handelstages zurück gegeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "value": 210.320007324219,
            "timestamp": "2025-07-18T16:00:12"
        },
        {
            "value": 210.511001586914,
            "timestamp": "2025-07-18T17:00:11"
        },
        {
            "value": 211.080001831055,
            "timestamp": "2025-07-18T18:00:12"
        },
        ...
    ]
    ```

+ **GET /getStockPriceByWeek/{date}/{IDStock}/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getStockPriceByWeek/2025-07-18/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Tag den Preis einer Aktie in den letzten 7 Tagen zurück. 
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "idStock": 1,
            "value": 211.160003662109,
            "timestamp": "2025-07-11T00:00:00"
        },
        {
            "idStock": 1,
            "value": 208.619995117188,
            "timestamp": "2025-07-14T00:00:00"
        },
        {
            "idStock": 1,
            "value": 209.110000610352,
            "timestamp": "2025-07-15T22:10:17"
        },
        ...
    ]
    ```

+ **GET /getStockPriceByMonth/{date}/{IDStock}/{token}** 
    + Beispielhafter Aufruf <br>
    `http://http://10.100.8.137:8080/getStockPriceByMonth/2025-07-18/1/1234-swift`
    + Beschreibung
    ```md
    Gibt pro Tag den Preis einer Aktie in den letzten 30 Tagen zurück. 
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "idStock": 1,
            "value": 196.580001831055,
            "timestamp": "2025-06-18T00:00:00"
        },
        {
            "idStock": 1,
            "value": 196.580001831055,
            "timestamp": "2025-06-19T00:00:00"
        },
        {
            "idStock": 1,
            "value": 201,
            "timestamp": "2025-06-20T00:00:00"
        },
        ...
    ]
    ```

## Transaction
+ **GET /getAllTransactions/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/getAllTransactions/1234-swift`
    + Beschreibung
    ```md
    Gibt alle Transaktionen (aktienkäufe und -verkäufe) eines Users zurück.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    [
        {
            "id": 504,
            "count": 92,
            "value": 107.779998779297,
            "date": "2025-04-24T12:00:00",
            "bs": false,
            "idStock": 77,
            "idUser": "1",
            "idStockPrice": 191171,
            "id_user": "1",
            "id_stock": 77,
            "id_stock_price": 191171
        },
        {
            "id": 505,
            "count": 92,
            "value": 142.899993896484,
            "date": "2025-06-26T09:14:46",
            "bs": true,
            "idStock": 77,
            "idUser": "1",
            "idStockPrice": 1112071,
            "id_user": "1",
            "id_stock": 77,
            "id_stock_price": 1112071
        },
        ...
    ]
    ```

## Sonstige
+ **GET /google/{token}**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:8080/google/1234-swift`
    + Beschreibung
    ```md
    Gibt Nutzerdaten zurück. 
    Ist der Nutzer intern noch nicht vorhanden wird er angelegt und dann seine Daten übergeben.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```JSON
    {
        "id":"1",
        "name":"swift",
        "email":"test@mail.de",
        "profilePicture":"testbild",
        "username":"swiftie"
    }
    ```