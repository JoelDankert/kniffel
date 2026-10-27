# Kniffel · Der Spieltisch

Ein nichtkommerzielles Joke-/Spaßprojekt: Kniffel für 1–8 Personen abwechselnd am selben Gerät. Kein offizielles Produkt. Keine Werbung, Monetarisierung, Analyse oder Tracking. Keine externen Assets, Dienste oder Netzwerkanfragen.

## Starten

`index.html` im Browser öffnen oder aus diesem Verzeichnis `python3 -m http.server 8765` ausführen und `http://localhost:8765/` öffnen. Als statische Website auch für GitHub Pages geeignet; alle Dateien liegen relativ zueinander. Nach dem Laden ist keine Netzwerkverbindung zum Spielen erforderlich. Spielstand und Ton-Einstellung bleiben im localStorage des jeweiligen Browsers und Ursprungs; beim Löschen der Browserdaten gehen sie verloren und sie werden nicht zwischen Geräten synchronisiert.

## Spielen

Spieler konfigurieren, die klassische oder die Meisterschaftsregel auswählen, bis zu dreimal würfeln und Würfel antippen, um sie zu halten. Nach mindestens einem Wurf ein freies Feld wählen, dann Punkte eintragen oder explizit streichen. Jeder Spieler füllt 13 Felder. Ab 63 Punkten im oberen Teil gibt es 35 Bonuspunkte. Full House erfordert exakt 3+2, kleine Straße vier, große Straße fünf aufeinanderfolgende Werte. Kniffel gibt 50 Punkte, Pasche die Summe aller Würfel. Jeder weitere eingetragene Kniffel gibt zusätzlich 50 Bonuspunkte: Klassisch darf der Höchstwert eines beliebigen freien Feldes gewählt werden, bei der Meisterschaftsregel zählt nur ein zum Wurf passendes Feld oder es wird gestrichen. Freiwilliges Streichen ist als praktische Spieloption auch im klassischen Modus möglich. Bei Gleichstand gewinnen alle Führenden. Neues Spiel erfordert eine Bestätigung. Der Ton ist per Schalter abschaltbar; er wird per Web Audio lokal erzeugt und durch eine Benutzeraktion aktiviert. Reduzierte Bewegung wird berücksichtigt.

Regelquelle: [Original-Spielanleitung von Schmidt Spiele](https://www.schmidtspiele.de/files/Produkte/4/49030%20-%20Kniffel/49030_Kniffel_DE.pdf).

## Tests

`node --test test.js` prüft Kategorien, Grenzfälle, Halten, drei Würfe, Eintragen/Streichen, Spielerwechsel, Bonus, Spielende und Gleichstand. `node --check engine.js && node --check app.js` prüft die JavaScript-Syntax. Keine Installation nötig.
