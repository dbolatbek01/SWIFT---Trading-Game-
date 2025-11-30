# SWIFT

<img src="./dokumentation/media/swift_logo.png" alt="Logo_SWIFT" class="logo" />

<!--
Lizenzbanner:
[![license](https://img.shields.io/github/license/:user/:repo.svg)](LICENSE)
--> 
Herzlich Willkommen bei SWIFT (Software Wildau Investment and Financial Trading)! <br>
Unsere Vision dieses Projektes ist es, den Aktienmarkt für jeden erkundbar zu machen, ohne dabei Investitionen tätigen zu müssen. <br>
Dabei soll der spielerische Faktor im Vordergrund stehen, um so die Erfahrung Aktienhandel positiv zu gestalten.

## Inhaltsverzeichnis

- [Verwendete Technologien](#verwendete-technologien)
- [Installationsanleitung](#installationsanleitung)
  - [Entwicklungsumgebung](#entwicklungsumgebung)
  - [Produktionsumgebung](#produktionsumgebung)
- [Regeln der Beteiligung](#regeln-der-beteiligung)
- [Lizenzinformationen](#lizenzinformationen)

## Verwendete Technologien

Im Projekt SWIFT werden verschiedene Technologien verwendet. Diese wurden sowohl nach Wissensstand im aktuellen Team, als auch der Nutzbarkeit im Projekt ausgesucht. Auch die Masse an Daten die im Projekt bearbeitet und zur Nutzbarkeit benötigt wird wurde im Auswahlprozess betrachtet. <br>
So teilen sich die Technologien in die einzelnen Komponenten des Projektes auf. Diese sind gegliedert in das Frontend, das Backend, den Api-Service, sowie die Datenbank. <br>
Die jeweils verwendeten Technologien wurden dabei wie folgt gewählt: <br>
+ Frontend
  + Node.js (Version 22.14.0)
  + @types/date-fns (Version 2.5.3)
  + apexcharts (Version 4.7.0)
  + chart.js (Version 4.4.9)
  + date-fns (Version 4.1.0)
  + date-fns-tz (Version 3.2.0)
  + https-proxy-agent (Version 7.0.6)
  + next (Version 15.3.0)
  + next-auth (Version 4.24.11)
  + react (Version 19.0.0)
  + react-apexcharts (Version 1.7.0)
  + react-chartjs-2 (Version 5.3.0)
  + react-dom (Version 19.0.0) 

Next.js wurde ausgewählt, da bereits Erfahrungen im Team über diese Technologie vorlagen. So ließ sich ein leichter Start in das Projekt erzielen. Des Weiteren hatten Entwickler mit weniger Erfahrung gegenüber der Technologie den Vorteil einer Ansprechperson. <br>
Auch die Wahl der Umsetzung als Webapp wurde mittels Next.js unterstützt und die Reaktionszeiten mit einer erhöhten Datenmenge konnten als gering (im Millisekunden Bereich) verifiziert werden, womit alle Bedingungen zur Nutzung erfüllt waren. 
  
+ Backend 
  + Java (Version 17)
  + SringBoot (Version 3.4.4)

Wie beim Frontend wurde auch hier nach bereits vorhandenen Erfahrungen gegangen. Da diese im Bereich Java und SpringBoot durch vergangene Studienkurse bei den Entwicklern vorhanden waren ging diese Technologie als Favorit ins Rennen. Des Weiteren überzeugten die starke Objektorientierung, sowie die vorliegenden Funktionalitäten. <br>
Auch die nötigen Reaktionszeiten mit einer erhöten Datenmenge konnten im Vorhinein verifiziert werden. 

+ Api-Service 
  + Node.js (Version 22.14.0)
  + express (Verison 5.1.0)
  + node-cron (Version 3.0.3)
  + pg (Version 8.14.1)
  + Python (Version 3.13.0)
    + yfinance (**Wichtig!** immer in der neuesten Version) 

Node.js ist sowohl effizient, als auch flexibel. Darüber hinaus bilden die zahlreichen Module einen großen Mehrwert, der zur Entscheidung für Node.js geführt hat. Darüber hinaus kann mittels Node.js ein Python-Skript (zeitgesteuert) ausgeführt werden. Python findet dabei seinen Nutzen, da zum Abfragen von Aktienkursen nach einiger Evaluation die Python Bibliothek yFinance die beste kostenlose Möglichkeit mit den genauesten Daten darstellt.

+ Datenbank
  + PostgreSQL (Version 16.9)

Tests im Vorhinein des Projektes haben uns Auskunft über die Leistungsfähigkeit einer PostgreSQL Datenbank gegeben. Dies hat uns einen Aufschluss darüber gegeben, dass dieses Datenbankmanagementsystem die Leistung die wir benötigen, um mit der Menge an Daten umzugehen, liefern kann. Aus diesem Grund viel die Entscheidung auf PostgreSQL.

## Installationsanleitung

Nachfolgend wird beschrieben wie Sie ihr System für die eigene Entwicklungsumgebung, als auch für den Produktivitätsbetrieb auf einem Server vorbereiten. <br>
In beiden Fällen wird davon ausgegangen das der Sourcecode (von GitLab kopiert) vorliegt und noch keine weiteren Einstellungen getätigt wurden.

### Entwicklungsumgebung

Vorrausgesetzt für dieses Kapitel wird, dass Java in der Version 17, PostgreSQL, sowie Python mit der aktuellsten yFinance Bibliothek, als auch Node.js bereits auf dem System installiert und lauffähig sind (siehe [Verwendete Technologien](#verwendete-technologien)).

+ Datenbank 
  + PostgreSQL Datenbank mit Namen **swift** erstellen (am Besten über pgAdmin4)
  + [SQL-Skript](./dokumentation/media/database/swift.sql) in die Datenbank einfügen und ausführen 
+ Backend 
  + [gradle_example.properties](./quellcode/Swift%20Postgres%20Driver/Swift/src/main/resources/application_example.properties)
    + "**_example**" im Dateinamen entfernen 
    + Datenbankvariablen auf eigene Datenbank anpassen
  + `./gradlew bootRun`
+ Api-Service 
  + [db_config_example.json](./quellcode/api_service/database/db_config_example.json)
    + "**_example**" im Dateinamen entfernen 
    + Datenbankvariablen auf eigene Datenbank anpassen
  + `npm install`
  + `npm start`
+ Frontend 
  + Bitte fragen Sie die Entwickler nach einer **.env** Datei
    + diese wird benötigt um den Google Login zu gewährleisten
  + [config.tx](./quellcode/frontend/config.ts)
    + bitte den aktuellen Pfad des Backends eintragen
      + auf localhost => http://localhost:8080
  + [Proxyeinstellungen](./quellcode/frontend/lib/auth.ts)
    + hier die Variable **proxyON** umstellen
    + true => Sie arbeiten innerhalb eines Proxys 
    + false => Sie arbeiten außerhalb eines Proxys
  + `npm install`
  + `npm run build`
  + `npm start`
    + sollten Sie die App im Development Modus starten wollen `npm run dev`

Laufen alle Komponenten lokal, so kann die Webseite über **http://localhost:3000** erreicht werden.

### Produktionsumgebung (auf den Servern der TH-Wildau)

Innerhalb der Produktionsumgebung laufen 3 der 4 Komponenten in Dockercontainern. <br>
Die Datenbank hingegen läuft nicht innerhalb eines Containers. Sie soll direkt auf dem Server liegen um einen möglichen Datenverlust bei Absturz eines Containers zu vermeiden. <br>
Das bedeutet in der Produktionsumgebung (also auf dem Server) wird Docker in der neuesten Configuration benötigt, als auch eine PostgreSQL Datenbank. <br>
**Wichtig** dabei ist, dass Docker Zugang zum Internet besitzt. <br>
Des Weiteren muss im Vorhinein ein **SSL-Zertifikat** vorhanden sein und auf dem Server liegen um einen Aufruf der Seite per https zu gewährleisten.

+ Datenbank 
  + PostgreSQL Datenbank mit Namen **swift** erstellen (am Besten über pgAdmin4)
  + [SQL-Skript](./dokumentation/media/database/swift.sql) in die Datenbank einfügen und ausführen
+ Backend 
  + [application_example.properties](./quellcode/Swift%20Postgres%20Driver/Swift/src/main/resources/application_example.properties)
    + "**_example**" im Dateinamen entfernen 
    + Datenbankvariablen auf Server Datenbank anpassen
  + Proxyeinstellungen (falls vorhanden)
    + Im [Verzeichnis](./quellcode/Swift%20Postgres%20Driver/Swift/) Datei namens **gradle.properties** erstellen/anpassen
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
+ Api-Service 
  + [db_config_example.json](./quellcode/api_service/database/db_config_example.json)
    + "**_example**" im Dateinamen entfernen 
    + Datenbankvariablen auf eigene Server Datenbank anpassen
  + `docker build -t api-service .`
  + `docker run -d --restart unless-stopped --name api-service -p 5000:5000 api-service`
  + Container anhalten und entfernen (im Falle eines Updates)
    + `docker stop api-service `
    + `docker rm api-service`
+ SSL Zertifikat Einstellungen
  + Netzwerk erstellen
    + `docker network create swift-network`
  + Nginx Konfiguration erstellen
    + Beispielhafte **ssl.conf** für SWIFT
    + ```conf
        server {
            listen 443 ssl;
            listen [::]:443 ssl;

            server_name localhost;

            ssl_certificate     /etc/nginx/certs/Name_Bundle_Datei.pem;
            ssl_certificate_key /etc/nginx/certs/Name_Key_Datei.pem;

            location / {
                proxy_pass         http://swift.wsf.wir.ad.th-wildau.de:3000;
                proxy_http_version 1.1;
                proxy_set_header   Upgrade $http_upgrade;
                proxy_set_header   Connection 'upgrade';
                proxy_set_header   Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }
      ```
  + Nginx starten
    + `docker run -d --restart unless-stopped --name nginx --network swift-network -p 80:80 -p 443:443 -v /Pfad_zum_Zertifikat:/etc/nginx/certs -v /Pfad_zur_Konfiguration:/etc/nginx/conf.d nginx`
+ Frontend 
  + Bitte fragen Sie die Entwickler nach einer **.env** Datei
    + diese wird benötigt um den Google Login zu gewährleisten
  + [config.tx](./quellcode/frontend/config.ts)
    + bitte den aktuellen Pfad des Backends eintragen
      + auf Beispielserver => http://10.100.8.137:8080
  + [Proxyeinstellungen](./quellcode/frontend/lib/auth.ts)
    + hier die Variable **proxyON** umstellen
    + true => Sie arbeiten innerhalb eines Proxys 
    + false => Sie arbeiten außerhalb eines Proxys
  + `docker build -t frontend .`
  + `docker run -e TZ=Europe/Berlin -d --restart unless-stopped --name frontend --network swift-network -p 3000:3000 frontend`
  + Container anhalten und entfernen (im Falle eines Updates)
    + `sudo docker stop frontend `
    + `sudo docker rm frontend`

## Regeln der Beteiligung

Alle notwendigen Informationen für eine Beteiligung an diesem Projekt sind in der Datei [CONTRIBUTING](CONTRIBUTING.md) hinterlegt.

## Lizenzinformationen

[MIT Lizenz](../LICENSE)
