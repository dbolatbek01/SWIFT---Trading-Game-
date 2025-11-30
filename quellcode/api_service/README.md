# Starten des API-Services 
Zum Starten dieserKomponente wird mindestens eine Datenbank benötigt.<br>
Mehr Informationen wie diese aussehen muss finden sie in der [Datenbank Dokumentation](../../dokumentation/datenbankmodell.md).

## lokal 
+ [db_config_example.json](./database/db_config_example.json)
  + **_example** entfernen 
  + Datenbankvariablen an anpassen auf eigene Datenbank
+ `npm install`
+ `npm start`

## produktiv 
Bitte beachten sie das für das Starten der Produktivumgebung für den Betrieb innerhalb der Infrastruktur der TH-Wildau ausgelegt ist! <br>
+ [db_config_example.json](./quellcode/api_service/database/db_config_example.json)
  + **_example** entfernen 
  + Datenbankvariablen an anpassen auf eigene Server Datenbank
+ `docker build -t api-service .`
+ `docker run -d --restart unless-stopped --name api-service -p 5000:5000 api-service`
+ Container anhalten und entfernen (im Falle eines Updates)
  + `docker stop api-service `
  + `docker rm api-service`

# Routenbeschreibungen
+ **GET /**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/`
    + Beschreibung
    ```md
    Server Erreichbarkeit testen, sowie Überprüfung der eingestellten Zeitzone.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Express Server is running with Time: Sat Jul 19 2025 00:00:41 GMT-0400 (Eastern Daylight Time)!
    ```

+ **GET /startDataSearch**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/startDataSearch`
    + Beschreibung
    ```md
    Abfrage von aktuellen Aktienkursen starten.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Price Search started!
    ```

+ **GET /startOldDataSearch**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/startOldDataSearch`
    + Beschreibung
    ```md
    Abfrage von vergangenen Aktienkursen der letzten letzten 3 Monaten starten. 
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Old Data Search started!
    ```

+ **GET /startUpdateStockPrices**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/startUpdateStockPrices`
    + Beschreibung
    ```md
    Zusammenfassen der minütlich vorliegenden Aktienkurse, die älter als 7 Tage sind, zu einem Schlusskurs des Tages wird gestartet.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Update Stock Prices started!
    ```

+ **GET /startDeleteStockPrices**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/startDeleteStockPrices`
    + Beschreibung
    ```md
    Start des Löschens von Aktienkursen älter als 2 Monate.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Delete Stock Prices started!
    ```

+ **GET /startReindexDatabase**
    + Beispielhafter Aufruf <br>
    `http://10.100.8.137:5000/startReindexDatabase`
    + Beschreibung
    ```md
    Datenbankreindexierung wird gestartet.
    ```
    + Beispielhafte Erfolgreiche Antwort `200 OK`
    ```txt
    Reindex Database started!
    ```