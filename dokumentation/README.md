# Informationen zu den optionalen Artefakten <!-- omit in toc -->

- [Grundlegende Hinweise](#grundlegende-hinweise)
- [Nicht optional](#nicht-optional)
  - [Meilensteinplan](#meilensteinplan)
  - [Projektstrukturplan](#projektstrukturplan)
  - [Projektdarstellung  (final für WSF Webseite)](#projektdarstellung--final-für-wsf-webseite)
- [Optional](#optional)
  - [Projektbeschreibung](#projektbeschreibung)
  - [Stakeholderanalyse](#stakeholderanalyse)
  - [Projektmarketing (Vision)](#projektmarketing-vision)
  - [Entwickleranleitung](#entwickleranleitung)
  - [Fachliche Anforderungen als Geschäftsprozesse, Use-Cases oder User-Stories](#fachliche-anforderungen-als-geschäftsprozesse-use-cases-oder-user-stories)
    - [Use-Cases](#use-cases)
    - [User-Stories](#user-stories)
    - [Geschäftsprozesse](#geschäftsprozesse)
  - [Datenbankmodell](#datenbankmodell)
  - [Frontend-Mockups](#frontend-mockups)
  - [Technologiedemo](#technologiedemo)
  - [Installationsanleitung](#installationsanleitung)
  - [Release: Version 1](#release-version-1)
  - [Release: Version 1.1](#release-version-11)
  - [Verzeichnis der Verarbeitungstätigkeiten](#verzeichnis-der-verarbeitungstätigkeiten)
  - [Benutzerhandbuch](#benutzerhandbuch)
  - [Abschlusspräsentation am Semesterende](#abschlusspräsentation-am-semesterende)
  - [Weitere Informationen zu diesem Verzeichnis](#weitere-informationen-zu-diesem-verzeichnis)

## Grundlegende Hinweise

In diesem Verzeichnis und seinen Unterverzeichnissen haben wir für Sie einige mögliche Artefakte zusammengetragen. Dabei sind die wenigsten davon für Sie verpflichtend. Im Normalfall sind sie optional, es sei denn wir als Dozenten setzen Ihnen eines davon explizit auf das Backlog.

## Nicht optional

### Meilensteinplan

|          | Definition                               |
|:---------|------------------------------------------|
| Format   | Gepflegte Meilensteine im Gitlab-Projekt |
| Template | -                                        |

**Hinweise:**

- Ein Meilenstein hat einen geplanten Anfang und ein geplantes Ende.
- Ein Meilenstein ist ein sinnvoll gewähltes Ziel, für das eine bestimmte Menge an Aufgaben erledigt werden muss.
- Das kann auch direkt in Verknüpfung mit einem Sprint genutzt werden.
- Meilensteine sind keine Einmalaufgabe.
  - Es können im Laufe der Zeit neue dazukommen, vorhandene können sich ändern.

----

### Projektstrukturplan

|          | Definition                                                   |
|:---------|--------------------------------------------------------------|
| Format   | Gepflegtes Konstrukt aus Meilensteinen zugeordneten Aufgaben |
| Template | -                                                            |

**Hinweise:**

- Jede Aufgabe ist genau *einem* Projektmitglied zugeordnet.
  - *Ist es aus Sicht der Gruppe sinnvoll eine Aufgabe mehreren Gruppenmitgliedern zuzuordnen, dann ist die Aufgabe zu groß und sollte in Teilaufgaben zerlegt werden.*
- Jede Aufgabe hat ein geplantes Enddatum (Deadline)
- Jede Aufgabe ist einem Meilenstein zugeordnet
- Aufgaben sind sinnvoll betitelt und beschrieben.
- Jede Aufgabe enthält eine "Definition of Done"

----

### Projektdarstellung  (final für WSF Webseite)

|             | Definition                            |
|:------------|---------------------------------------|
| Format      | Markdown                              |
| Verzeichnis | [Ablageverzeichnis](Projektmarketing-final) |

**Hinweise:**

- Die Projektdarstellung orientiert sich an ihrer Vision der Projektdarstellung aus Meilenstein 1. Ihre Beschreibung wird auf der [Webseite der Wildauer Software Fabrik](th-wildau.de/wsf) veröffentlicht.

----

## Optional

### Projektbeschreibung

|          | Definition                                                                  |
|:---------|-----------------------------------------------------------------------------|
| Format   | Markdown                                                                    |
| Template | [Beispielhaftes Template einer Projektbeschreibung](projektbeschreibung.md) |

----

### Stakeholderanalyse

|          | Definition                                                                |
|:---------|---------------------------------------------------------------------------|
| Format   | Markdown                                                                  |
| Template | [Beispielhaftes Template einer Stakeholderanalyse](./offene%20Artefakte/stakeholderanalyse.md) |

**Hinweise:**

- Alle Angaben im Dokument müssen nachvollziehbar und sinnvoll sein.

----

### Projektmarketing (Vision)

|             | Definition                            |
|:------------|---------------------------------------|
| Format      | Markdown                              |
| Verzeichnis | [Ablageverzeichnis](./offene%20Artefakte/Projektmarketing) |

**Hinweise:**

- Beachten Sie die [Hinweise in der ReadMe-Datei](./offene%20Artefakte/Projektmarketing/README.md) im Verzeichnis zur Projektdarstellung.

----

### Entwickleranleitung

|          | Definition                                           |
|:---------|------------------------------------------------------|
| Format   | Markdown                                             |
| Template | [Template CONTRIBUTING](../CONTRIBUTING_template.md) |

**Hinweise:**

- Das Projekt muss eine verständliche Anleitung für neue Entwickler enthalten.
  - Wie muss ein neuer Rechner vorbereitet werden, damit nach dem Pull mit der Entwicklung begonnen werden kann?
  - Welcher Workflow wird im Projekt verwendet?
  - Welche Regeln gibt es bezüglich neuer Issues?
  - Gibt es darüber hinaus spezielle Regeln für Beiträge in diesem Projekt?

----

### Fachliche Anforderungen als Geschäftsprozesse, Use-Cases oder User-Stories

Bitte wählen Sie **eine** der vorgeschlagenen Formen, um Ihre fachlichen Anforderungen zu definieren.

#### Use-Cases

|          | Definition                                   |
|:---------|----------------------------------------------|
| Format   | Markdown (eingebettete Bilder der Diagramme) |
| Template | [Beispielhaftes Template](./offene%20Artefakte/use-cases.md)      |

**Hinweise:**

- Vorgeschlagenes Tool: [Draw.io](https://draw.io)
- Im Verzeichnis liegen neben dem Dokument auch die Quelldateien des verwendeten Tools zur Referenz.
- Die erstellten Diagramme folgen dem UML-Standard.

#### User-Stories

|          | Definition                                   |
|:---------|----------------------------------------------|
| Format   | Markdown (eingebettete Bilder der Diagramme) |
| Template | [Beispielhaftes Template](./offene%20Artefakte/user-stories.md)   |

**Hinweise:**

- Die aufgeführten User-Stories müssen zum Projekt passen.
- *Die User-Stories sind auch im Aufgabenmanagement abgebildet und werden bearbeitet.*

#### Geschäftsprozesse

|          | Definition                                       |
|:---------|--------------------------------------------------|
| Format   | Markdown (eingebettete Bilder der Diagramme)     |
| Template | [Beispielhaftes Template](./offene%20Artefakte/geschaeftsprozesse.md) |

**Hinweise:**

- Vorgeschlagenes Tool: [Cawemo](https://cawemo.com) oder [Draw.io](https://draw.io)
- Im Verzeichnis liegen neben dem Dokument auch die Quelldateien des verwendeten Tools zur Referenz.
- **Die erstellten Diagramme folgen dem BPMN 2.0-Standard!**

----

### Datenbankmodell

|          | Definition                                    |
|:---------|-----------------------------------------------|
| Format   | Markdown (eingebettete Bilder der Diagramme)  |
| Template | [Beispielhaftes Template](datenbankmodell.md) |

**Hinweise:**

- Vorgeschlagenes Tool: [Draw.io](https://draw.io)
- Im Verzeichnis liegen neben dem Dokument auch die Quelldateien des verwendeten Tools zur Referenz.
- Die erstellten Diagramme folgen dem Standard eines ER-Diagramms.

----

### Frontend-Mockups

|          | Definition                                   |
|:---------|----------------------------------------------|
| Format   | Markdown (eingebettete Bilder der Diagramme) |
| Template | [Beispielhaftes Template](./offene%20Artefakte/mockups.md)        |

**Hinweise:**

- Vorgeschlagenes Tool:
  - [Draw.io](https://draw.io) oder
  - [wireframe.cc](https://wireframe.cc/) oder
  - [Yed Live](https://www.yworks.com/yed-live/) oder
  - [Pidoco](https://pidoco.com/de/lp/clickable-prototype)
- Im Verzeichnis liegen neben dem Dokument auch die Quelldateien des verwendeten Tools zur Referenz  
  oder unter dem Bild ist ein Link auf das zugängliche Mockup im Netz gegeben.
- Alternativ ist es auch möglich die Mockups bereits in der gewählten Frontend-Technologie umzusetzen und direkt in der Technologiedemo zu zeigen.
- Die erstellten Mockups müssen sich auf die Prozesse beziehen.

----

### Technologiedemo

|        | Definition                                  |
|:-------|---------------------------------------------|
| Format | Demonstration in einer Zwischenpräsentation |

**Hinweise:**

- Das Projekt muss als Demoanwendung auf einem Server der TH Wildau ausgeliefert sein, und dort funktionieren.
- Die Anwendung sollte dabei das HelloWorld-Niveau bereits übersteigen.

----

### Installationsanleitung

|          | Definition                            |
|:---------|---------------------------------------|
| Format   | Markdown                              |
| Template | [Beispielhaftes Template](./offene%20Artefakte/install.md) |

**Hinweise:**

- Es muss Schritt für Schritt beschrieben werden, wie eine Produktivumgebung vorzubereiten (Systemvorbereitung) ist, und wie die einzelnen Anwendungsteile zu installieren sind.
- Sie dürfen dabei davon ausgehen, dass der Nutzer dieser Anleitung über *grundlegende* administrative Kenntnisse verfügt.

----

### Release: Version 1

|        | Definition                  |
|:-------|-----------------------------|
| Format | Quellcode im GitLab-Projekt |

**Hinweise:**

- Das Projekt muss am Ende eine auslieferbare funktionstüchtige Version haben

----

### Release: Version 1.1

|        | Definition                  |
|:-------|-----------------------------|
| Format | Quellcode im GitLab-Projekt |

**Hinweise:**

- Das Projekt muss am Ende der Phase eine auslieferbare funktionstüchtige Version haben, die das Feedback eines möglichen Auftraggebers nach Präsentation von Version 1 berücksichtigt.

----

### Verzeichnis der Verarbeitungstätigkeiten

|          | Definition                        |
|:---------|-----------------------------------|
| Format   | Markdown                          |
| Template | [Beispielhaftes Template](./offene%20Artefakte/vvt.md) |

**Hinweise:**

- Werden personenbezogene Daten verarbeitet, dann muss dies aus dem VVT hervorgehen.
- Werden keine personenbezogenen Daten verarbeitet, dann ist dies ebenfalls im VVT deutlich zu machen.
- Für weitere Hinweise zum Thema VVT haben wir Ihnen eine Belegarbeit aus dem vergangenen Projekt zur Verfügung gestellt.  
  Sie finden darin allgemeine Informationen zum Thema und auch Beispiele.  
  Link: [Belegarbeit zum Thema Verzeichnis von Verarbeitungstätigkeiten (VVT)](https://elearning.th-wildau.de/mod/resource/view.php?id=298188)

----

### Benutzerhandbuch

|          | Definition                              |
|:---------|-----------------------------------------|
| Format   | Markdown                                |
| Template | [Beispielhaftes Template](./offene%20Artefakte/userguide.md) |

**Hinweise:**

- Das Benutzerhandbuch muss sich an den Bedürfnissen ihres Benutzers ausrichten.
  - Wer ist das?
  - Was braucht er für Einstiegsinformationen?
- Das Benutzerhandbuch muss nicht zwangsläufig als PDF verfasst sein. In den letzten Jahren haben wir tolle Beispiele als Videos, Markdown oder HTML gesehen.

----

### Abschlusspräsentation am Semesterende

|          | Definition                                                                       |
|:---------|----------------------------------------------------------------------------------|
| Format   | Powerpoint (pptx)                                                                |
| Template | [Beispielhaftes Template einer Statuspräsentation](statuspraesentation_p06.pptx) |

**Hinweise:**

- Eine Änderung des Formats (weg von Powerpoint) ist nach Absprache möglich.
- Version 1.1 muss demonstriert werden können
- Ein Resümee über das Projekt und seinen Verlauf muss enthalten sein.

### Weitere Informationen zu diesem Verzeichnis

| Name                                           | Bemerkungen                                                                           |
|:-----------------------------------------------|---------------------------------------------------------------------------------------|
| [Bilder](media)                               | Verzeichnis für die Ablage von Bildern zur Verwendung in allen erstellten Dokumenten. |
| [Auftraggeber-Logbuch](./offene%20Artefakte/auftraggeberlogbuch.md) | Vorlage für die Erfassung von Auftraggebermeetings.                                   |
