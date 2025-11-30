# Informationen für die Beteiligung an diesem Projekt <!-- omit in toc -->

## Inhaltsverzeichnis

- [Inhaltsverzeichnis](#inhaltsverzeichnis)
- [Allgemein](#allgemein)
- [Projektstruktur](#projektstruktur)
  - [Workflow im Projekt](#workflow-im-projekt)
  - [Informationen zu den Standard-Branches](#informationen-zu-den-standard-branches)
- [Beteiligung](#beteiligung)
  - [Etwas melden](#etwas-melden)
  - [Die eigene Entwicklungsumgebung vorbereiten](#die-eigene-entwicklungsumgebung-vorbereiten)
  - [Vorgehen für das Beitragen von Code](#vorgehen-für-das-beitragen-von-code)
  - [Versionierung im Projekt](#versionierung-im-projekt)
  - [Aufgaben eines Maintainers](#aufgaben-eines-maintainers)
- [Abschließende Worte](#abschließende-worte)

## Allgemein

Herzlich Willkommen im WSF-Projekt SWIFT (Software Wildau Investment and Financial Trading)! <br>
Wir haben uns vorgenommen den Markt der Aktienspiele mit Hilfe eines Tradingspiels zu revolutionieren. <br>
Hört sich das für Sie interessant an? Super! Wie genau Sie uns dabei helfen können, unsere Vision Wirklichkeit werden zu lassen, ist im Folgenden erklärt.

## Projektstruktur

### Workflow im Projekt

+ Issue assignen
  + falls keine Issues erstellt sind, wie folgt anlegen 
    + Benennung Issue => **User-Storie-Nummer_prägnanter Name_B/F**
      + **B** für Backend Aufgaben 
      + **F** für Frontend Aufgaben 
      + **User-Storie-Nummer** kann in bestimmten Fällen den Wert 0 haben
        + bezieht sich auf kleinere Issues, die keiner konkreten User Story zugeordnet sind
          + z.B. Verbesserungen bestehender Funktionalitäten oder Designelemente
          + z.B. eigenständige, kleinere Aufgaben, die keinen unmittelbaren Bezug zu einer übergeordneten User Story haben und deshalb direkt als Issue bearbeitet werden
    + Beschreibung hinzufügen
      ```md 
      **Titel:** Kurzer Titel des Issues (kann dem Namen des Issues ähneln)

      **Beschreibung:**
      Beschreibung der Aufgabe und was damit erreicht werden soll!

      **Aufgaben:**

      * Was ist zu erledigen um das Issue zu bearbeiten?

      **Akzeptanzkriterien:**

      * [ ] Was muss erfüllt sein um das Issue abschließen zu können?
      ```
    + Labels hinzufügen 
      + High, Medium, Low
      + Backend, Frontend
    + Milestone hinzufügen 
    + Enddatum des Issues eintragen
      + bis wann abgearbeitet (meist Daten des Sprints)
      + **Optional** => Startdatum des Issues eintragen
+ Branch erstellen 
  + Name des Branch => **NummerIssue_kurzerName_B/F**  
+ nach vollständiger Bearbeitung Issue Merge Request erstellen 
  + merge auf Sprint Branch!
  + Squash Commits nicht vergessen! (außer bei Merge auf **main**)
  + Edit Commit Message 
    + Beschreibung der Tätigkeit einfügen (kurz und prägnant)
  + **Optional** 
    + Reviewer assignen, der den Quellcode und die Funktionalität bestätigt
    + Merge Request auf sich selbst assignen 
    + Labels zum Merge Request hinzufügen
+ nach Merge
  + Issue Label **Finished** hinzufügen
  + Issue schließen
<!-- Video einfügen für den Workflow einfügen, wenn bereits ein Issue erstellt ist! -->

### Informationen zu den Standard-Branches

+ ein **main** Branch
  + enthält die Produktivumgebung (Produktionsbranch)
+ ein zusätzlicher Branch je Sprint (von **main** abgehend)
  + beispielhafte Benennung => **SPRINT01**, **BETA**
+ Branch je Issue (von Sprintbranch abgehend)
  + beispielhafte Benennung => **70_Verkaufroute_anpassen_B** 

## Beteiligung

### Etwas melden

Sollte ein Fehler in der Software auftreten oder Ihnen beim Benutzen von SWIFT auffallen bitten wir Sie diesen an uns zu melden. Um eine schnellstmögliche Bearbeitung zu gewährleisten folgen Sie den nachstehenden Schritten und helfen bestenfalls gleich selbst bei der Behebung um allen den Spielspaß zu erhalten.

+ Sollte ein Fehler auftreten muss ein Issue im GitLab erstellt werden 
+ Benennung Issue => **Error_prägnanterName_B/F**
  + Beschreibung des Fehlers und unter welchen Bedingungen dieser Fehler auftaucht in die Beschreibung des Issues schreiben
  + Labels hinzufügen 
    + High, Medium, Low
    + Backend, Frontend

### Die eigene Entwicklungsumgebung vorbereiten

Sollten Sie hilfe bei der Einrichtung Ihrer Entwicklungsumgebung und in den nötigen benötigen schlagen sie [hier](README.md#installationsanleitung) nach.

### Vorgehen für das Beitragen von Code

Sie wollen etwas in unserem Projekt beitragen? **SUPER!** <br>
Bitte halten Sie sich bei der Bearbeitung an bestimmte Regeln. <br>
Diese Regeln sind [hier](#workflow-im-projekt) definiert und einzuhalten!

### Versionierung im Projekt

Die im Projekt vorgenomme Versionierung ist recht einfach gestaltet und in ihren Grundzügen bereits [hier](#informationen-zu-den-standard-branches) dargelegt. <br>
Dabei gibt es einen **main** Branch. Dieser fungiert als Produktionsbranch. Er enthält also den Stand nach einem Sprint. Während des Sprintes wird nicht in main gearbeitet. <br>
In dieser Zeit wird innerhalb eines eigenen **Sprint** Branches gearbeitet. Dieser enthält den aktuellsten Stand der Software mit einer funktionierenden Version. Am Anfang jeden Sprintes wird dieser Branch von main abgehend erstellt und am Ende jeden Sprintes wieder auf main gemerged. <br>
Für die Bearbeitung von einzelnen Issues muss jeder Entwickler einen extra **Issue** Branch erstellen. Dieser wird abgehend vom Sprint Branch erzeugt und nach Beendigung und erfolgreicher Testung auf Funktionalität wieder auf diesen gemerged. Da während der Bearbeitung nicht davon ausgegangen werden kann das in den Issue Branches alles fehlerfrei läuft wird hier im laufenden Prozess keine funktionale Version erwartet. Nach Beendigung der Arbeiten und vor dem mergen auf den Sprint Branch muss allerdings alles fehlerfrei funktionieren. <br>

### Aufgaben eines Maintainers

Ein Maintainer innerhalb des Projektes muss sich ebenso wie jeder andere Entwickler an die allgemein geltenden Richtlinien halten! <br>
Darüber hinaus gibt es allerdings zusätzliche Aufgaben die erfüllt werden müssen: <br>
  + Merge Requestes der Sprint Branches nach Sprint Ende auf **main** erstellen
    + **WICHTIG!** Commits nicht squashen 
  + aktuelle Version vom Merge Requestes auf Funktionalität überprüfen 
    + Quellcode auf Fehler durchsuchen
    + volle Funktionalität der Software überprüfen 
  + Merge Request auf main druchführen/bestätigen 
    + **ERNEUT WICHTIG!** Commits nicht squashen 

## Abschließende Worte

Sollten Sie sich dazu entscheiden dem SWIFT Team beizutreten freuen wir uns sehr. Durch eine solche Entscheidung werden Sie offiziell ein **Swiftie**. Darüber hinaus unterstützen Sie dabei unsere Vision und helfen den Aktienmarkt für jeden spielerisch erreichbar zu machen ohne dabei Risiken einzugehen und Kapital investieren zu müssen.

