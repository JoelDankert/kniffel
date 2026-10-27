# Kniffel · Der Spieltisch

Ein nichtkommerzielles Joke-/Spaßprojekt: Kniffel für 1–8 Personen abwechselnd am selben Gerät. Kein offizielles Produkt. Keine Werbung, Monetarisierung, Analyse oder Tracking. Keine externen Assets oder Dienste und keine automatischen Anfragen an Dritte.

## Starten

`index.html` im Browser öffnen oder aus diesem Verzeichnis `python3 -m http.server 8765` ausführen und `http://localhost:8765/` öffnen. Als statische Website auch für GitHub Pages geeignet; alle Dateien liegen relativ zueinander. Nach dem Laden ist keine Netzwerkverbindung zum Spielen erforderlich. Spielstand und Ton-Einstellung bleiben im localStorage des jeweiligen Browsers und Ursprungs; beim Löschen der Browserdaten gehen sie verloren und sie werden nicht zwischen Geräten synchronisiert.

## Spielen

Spieler konfigurieren, die klassische oder die Meisterschaftsregel auswählen und bis zu dreimal würfeln. Der Becher lässt sich anklicken oder durch Ziehen beziehungsweise Wischen schütteln. Würfel antippen, um sie auf dem Tisch zu halten; gehaltene Würfel wandern beim nächsten Wurf nicht in den Becher. Nach mindestens einem Wurf ein freies Feld wählen, dann Punkte eintragen oder explizit streichen. Jeder Spieler füllt 13 Felder. Ab 63 Punkten im oberen Teil gibt es 35 Bonuspunkte. Full House erfordert exakt 3+2, kleine Straße vier, große Straße fünf aufeinanderfolgende Werte. Kniffel gibt 50 Punkte, Pasche die Summe aller Würfel. Jeder weitere Kniffel gibt zusätzlich 50 Bonuspunkte: Klassisch darf der Höchstwert eines beliebigen freien Feldes gewählt werden, bei der Meisterschaftsregel zählt nur ein zum Wurf passendes Feld oder es wird gestrichen. Freiwilliges Streichen ist als praktische Spieloption auch im klassischen Modus möglich. Bei Gleichstand gewinnen alle Führenden. Neues Spiel erfordert eine Bestätigung. Der Ton ist per Schalter abschaltbar; unterschiedliche Effekte für Bedienung und Spielablauf werden per Web Audio lokal erzeugt und durch eine Benutzeraktion aktiviert. Reduzierte Bewegung wird berücksichtigt.

Als Kniffel zählt in dieser App jeder abgeschlossene Zug mit fünf gleichen Würfeln, auch wenn das Kniffel-Feld zuvor gestrichen wurde. Das ist eine App-Auslegung: Die Herstelleranleitung erläutert diesen Sonderfall nicht ausdrücklich.

Regelquelle: [Original-Spielanleitung von Schmidt Spiele](https://www.schmidtspiele.de/files/Produkte/4/49030%20-%20Kniffel/49030_Kniffel_DE.pdf).

## Tests

`node --test test.js` prüft Kategorien, Grenzfälle, Halten, drei Würfe, Eintragen/Streichen, Spielerwechsel, Bonus, Spielende und Gleichstand. `node --check engine.js && node --check app.js` prüft die JavaScript-Syntax. Keine Installation nötig.
