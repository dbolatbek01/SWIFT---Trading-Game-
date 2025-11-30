# Projektbeschreibung

## Allgemein

|                         |                                             |
| :---------------------- | ------------------------------------------- |
| Projekttitel:           | SWIFT                                       |
| Projektleiter/in:       | Paul Lorentz                                |
| Projektauftraggeber/in: | Wildauer Software Fabrik                    |
| Projektbetreuer         | Prof. Sebastian Rönnau, Hennig Almus        |

## Projektdauer

|                   |            |
| :---------------- | ---------- |
| Geplanter Beginn: | SoSe 25    |
| Geplantes Ende:   | WiSe 25/26 |

## Ausgangssituation / Problembeschreibung

Der Aktienmarkt wird immer schneller und härter. <br> 
Das bedeutet, dass die Lage auf dem Markt immer ungewisser wird. Folglich muss jeder Investor in seinem handeln flexibel sein. <br>
Dabei ist es vor allem wichtig schnell auf die aktuelle Weltlage zu reagieren und die richtigen Schlüsse zu ziehen. <br>
Doch kann sich dies jeder leisten, beziehungsweise hat das Kapital um verschiedene Strategien auszuprobieren und dabei auch Verluste zu verkraften? <br>
Wir von **SWIFT** (Software Wildau Investment and Financial Trading) denken: **NEIN**! Aus diesem Grund wollen wir einen neuen Ansatz fahren und ein Aktienspiel auf dem Markt bringen, welches sowohl Spielspaß bietet, als auch den Umgang, sowie das Handeln mit Aktien in einer sicheren Umgebung ermöglicht. <br>
Dabei haben wir auch andere Anbieter von sogennanten "Aktiensimulationen" beurteilt. Diese setzen ihren Fokus weniger auf das Handeln, als auf den spielerischen Aspekt. Damit bringen sie Elemente wie Käufe von Immobilien oder das Traden mit "imaginären Firmen" ein. <br>
Genau das wollen wir ändern und uns mit SWIFT an der Realität orientieren, um so nicht den Fokus zu verlieren. <br>
Wie dies geklappt hat findet ihr unter **https://swift.wsf.wir.ad.th-wildau.de/** (im VPN der Hochschule) selber heraus!

## Angaben zu Projektzielen

### Projektgesamtziel

Wir von SWIFT wollen den Aktienmarkt für jeden mittels Spiel ermöglichen. <br>
Dabei können unsere Nutzer das Handeln mit Aktien kennenlernen, sich gegen einen realen Markt messen (gegen den NASDAQ100) ohne dabei ein Risiko eingehen zu müssen. <br>
Dabei wollen wir den Fokus auf den Handel und den Aufbau eines eigenen Portfolios setzen. So gehört eine klare Struktur, als auch eine nutzerfreundliche Handhabung ebenfalls zu unserem Projektgesamtziel.

### Projektziele

- Tradingspiel entwickeln
    - als Webapp (um den möglichen Nutzerkreis hoch zu halten)
    - Fokus auf das Handeln legen 
    - klare, einfache Struktur beibehalten 
    - Trading an etablierte Broker anlegen
- Gegen den NASDAQ100 antreten 
    - mit dem eigenen Portfolio versuchen dessen Wachstum zu schlagen
- minütlich reale Aktienkurse abfragen und speichern 
    - während der Handelszeiten des NASDAQ100
    - von den Aktien des NASDAQ100
- Spiel für mehrere Personen zugänglich machen
    - Login einbinden (per Google)
    - Mehrbenutzerfähigkeit realisieren 
    - Spiel per URL erreichbar machen

### Nicht-Ziele

- bereits vorhandene Aktiensimulationen kopieren 
    - den Fokus weg vom Handel, hin zum Spiel setzen
- Multiplayerspiel entwickeln
    - nicht im SoSe 25
- aktuelle Nachrichten einfügen
    - nicht im SoSe 25
- weitere Indexes einfügen gegen die man spielen kann
    - nicht im SoSe 25
- Seasons einfügen mit unterschiedlichen Bedingungen
    - nicht im SoSe 25

## Wirtschaftlicher oder sonstiger Nutzen

Der Nutzen unserer Webapp lässt sich für den Endnutzer gut erkennen. <br>
Er selbst kann beim Handeln und schlagen des NASDAQ100 Erfahrungen sammeln. Darüber hinaus ist auch der Spielspaß groß, womit das Bedürfniss des Weiterspielens in jedem Fall geweckt ist. <br>
Man möchte mit dem Wachstum seinen Portfolio gegen das des NASDAQ100 gewinnen. Aus diesem Grund nutzt man die Webapp, überlegt sich Strategien und lernt so ganz einfach wie der Aktienhandel funktioniert, was für Strategien einen Gewinn erzielen und welche Verluste. <br>
Darüber hinaus wird die aktuelle Weltlage im Spiel wiedergespiegelt (durch reale Kursdaten). Das bedeutet die Nachrichten können einen Aufschluss darauf geben was als nächstes passiert. Kann man dies gut genug einschätzen, so lernt man nicht nur neue Strategien, sondern merkt auch wie die Realität den Markt beeinflusst. <br>
Unsere Zielgruppe ist allerdings noch weitläufiger. Durch die minütlich erfassten Kurse spricht das Spiel auch diejenigen an, die nicht lange auf ihrem Portfolio sitzen bleiben, sondern viele kleine und schnelle Transaktionen ausführen wollen (Daytrader). Auch sie sind Teil der Zielgruppe von SWIFT und damit potentielle Kunden die den Aktienmarkt kennenlernen, beziehungsweise ihre Fähigkeiten erweitern können. <br>
Wichtig dabei ist, dass all dieses Ausprobieren und Testen in einer sicheren Umgebung ohne das Verwenden des eigenen Kapitals passiert. Dies macht SWIFT auch für jüngere Gruppen attraktiv. 

## Lösungsansatz

Wir haben das Projekt mit dem Ansatz gestartet Erfahrungen innerhalb des Teams bestmöglich zu benutzen. <br>
Daher wollten wir Technologien verwenden, die bereits einigen von uns durch sonstige Arbeiten und privaten Erkenntnisse bekannt waren. Somit haben wir die Zeit der Einarbeitung reduziert und Teammitglieder, welche weniger Erfahrungen mit den Technologien hatten konnten aus erfahrenen Teammitgliedern einen Nutzen ziehen. <br>
Neben den reinen Erfahrungen gab es im Vorlauf zum Projekt einige Proben um die Verwendbarkeit der Technologien zu überprüfen. Dadurch konnten wir die Machbarkeit beweisen und liefen nicht Gefahr Technologien wechseln zu müssen. <br>
Mit diesem Ansatz konnten wir die vorliegenden Herausforderungen gut meistern und von Beginn an zu 100% arbeiten. So ist es uns gelungen eine hohe Produktivität über die Sprints aufrecht zu erhalten und die Ziele bestmöglich zu erfüllen. 

## Projekt-Randbedingungen

Die wichtigste Randbedingung, die in unserem Projekt funktionieren muss und von der das gesamte Projekt abhängt ist die yFinance Python Bibliothek. <br>
Diese wird benutzt um die minütlichen Kursdaten abzurufen. Ohne sie gäbe es also keine Kurse, ohne Kurse keinen Handel und damit auch kein SWIFT. <br>
Aus diesem Grund muss immer darauf geachtet werden, dass diese Bibliothek auf dem aktuellsten Stand gehalten wird. Ist dies nicht der Fall kann es schnell zu Problemen kommen, es werden keine Kurse mehr ermittelt und das Spiel verliert seinen Spielspaß. <br>
Aus diesem Grund ist diese Bibliothek auch das Größte [Risiko](#projektrisiken-und--unsicherheiten) des Projektes.

## Projektorganisation

### Kernteam

| Name            | Seminargruppe | Bemerkungen                            |
| :-------------- | ------------- | -------------------------------------- |
| Paul Lorentz    | I1-23         | Developer (Team Frontend), PO          |
| Niels           | I2-23         | Developer (Team Frontend)              |
| Enrico          | I2-23         | Developer (Team Frontend)              |
| Danat           | IM24          | Developer (Team Backend)               |
| Laurentz        | I1-23         | Developer (Team Backend)               |
| Niklas Wieling  | IM24          | Developer (Team Backend)               |
| Lukas Sontowski | IM24          | Developer (Team Backend), Scrum Master |

<!--
### Erweitertes Projektteam

| Name | Seminargruppe | Bemerkungen |
| :--- | ------------- | ----------- |
|      |               |             |
|      |               |             |

### Sonstige

\<z.B. ext. Dienstleister, ...\>

| Name | Bemerkungen |
| :--- | ----------- |
|      |             |
|      |             |

-->
## Projektrisiken und -unsicherheiten

Das größte Risiko von SWIFT ist die yFinance Bibliothek in Python. <br>
Über sie werden die Kurse abgefragt. Ohne diese Kurse gibt es keinen Handel in der Webapp, was zum Kollaps von SWIFT führt. <br>
Aus diesem Grund muss, vor allem auf einer Produktivumgebung, darauf geachtet werden, dass diese Bibliothek immer auf dem neuesten Stand ist. <br>
Ebenfalls sollte es Überprüfungen geben ob über den API-Service Kurse ermittelt und in der Datenbank abgespeichert werden, da sonst nur Altdaten in der App angezeigt werden.

Ein weiteres Risiko ist der Google Login. <br>
Sollte Google diesen Dienst einstellen fällt unsere Anmeldemöglichkeit aus. <br>
Da dieses Risiko allerdings sehr gering ist und es Alternativen für den Login gibt, welche schnell eingebaut werden können spielt dies eine untergeordnete Rolle.  <br>
Aus diesem Grund müssen auch keine überprüfenden Maßnahmen getätigt werden.

<!--
## Anlagen

\<z.B. Beschreibungen, Pläne etc. \>
\<einzeln auflisten, und **verlinken** (Ablage im gleichen Ordner)>

|  Nr.  | Name            | Beschreibung        |
| :---: | :-------------- | :------------------ |
|   1   | \<Anlagenname\> | \<Kurzbeschreibung> |
|   2   | \<Anlagenname\> | \<Kurzbeschreibung> |
-->
