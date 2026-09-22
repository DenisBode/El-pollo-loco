🐔 El Pollo Loco

Ein browserbasiertes Jump-&-Run-Spiel, inspiriert vom klassischen Arcade- und Plattformspiel-Genre.

In El Pollo Loco übernimmt der Spieler die Rolle eines kleinen Cowboys, der sich durch eine mexikanisch inspirierte Spielwelt bewegt, Gegner bekämpft, Münzen und Flaschen sammelt und sich schließlich dem Endgegner stellt.

🎮 Spiel

Das Ziel des Spiels ist es, sich durch die verschiedenen Level zu bewegen, Gegner zu besiegen und möglichst viele Gegenstände zu sammeln.

Features

🕹️ Klassisches Jump-&-Run-Gameplay

🐔 Gegner mit unterschiedlichen Verhaltensweisen

👾 Endgegner

🪙 Sammelbare Münzen

🍾 Sammelbare Flaschen

❤️ Lebens- und Energieleiste

🔊 Soundeffekte und Hintergrundmusik

🎬 Intro-, Game- und Endscreen

📱 Responsive Darstellung

🛠️ Technologien

Das Projekt wurde mit klassischen Webtechnologien umgesetzt:

HTML5 – Struktur der Anwendung

CSS3 – Styling und Layout

JavaScript – Spiellogik und Interaktionen

HTML Canvas – Darstellung des Spiels

📁 Projektstruktur
El-Pollo-Loco/
│
├── img/
│   ├── characters/
│   ├── enemies/
│   ├── backgrounds/
│   ├── objects/
│   └── ...
│
├── audio/
│   ├── background.mp3
│   ├── collect.mp3
│   ├── jump.mp3
│   └── ...
│
├── models/
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── level.class.js
│   └── ...
│
├── js/
│   ├── game.js
│   ├── keyboard.class.js
│   └── ...
│
├── index.html
├── style.css
└── README.md


Die genaue Ordnerstruktur kann je nach Projektstand abweichen.

🚀 Installation

Da es sich um ein browserbasiertes JavaScript-Projekt handelt, sind keine umfangreichen Abhängigkeiten erforderlich.

1. Repository klonen
git clone <REPOSITORY-URL>

2. In das Projektverzeichnis wechseln
cd El-Pollo-Loco

3. Projekt starten

Öffne die index.html über einen lokalen Webserver.

Beispielsweise mit VS Code und der Erweiterung Live Server:

Projekt in VS Code öffnen

index.html auswählen

Rechtsklick auf die Datei

Open with Live Server auswählen

🎯 Steuerung
Taste	Aktion
← / →	Nach links / rechts bewegen
↑	Springen
D	Objekt werfen
ENTER	Spiel starten / bestätigen

Die tatsächliche Tastenbelegung kann je nach Implementierung abweichen.

🧩 Spielmechanik

Der Spieler bewegt sich durch die Level und muss verschiedene Hindernisse und Gegner überwinden.

Gegner

Im Spiel gibt es unterschiedliche Gegnertypen. Diese bewegen sich innerhalb des Levels und können dem Spieler Schaden zufügen.

Sammelobjekte

Während des Spiels können verschiedene Gegenstände gesammelt werden.

Dazu gehören unter anderem:

🪙 Münzen

🍾 Flaschen

Gesammelte Gegenstände können für den Spielfortschritt relevant sein.

Kämpfe

Gegner können abhängig von ihrer Position und dem jeweiligen Gegnertyp beispielsweise durch einen Sprung oder durch geworfene Flaschen besiegt werden.

❤️ Lebenssystem

Der Spieler verfügt über eine bestimmte Anzahl an Lebenspunkten.

Bei einer Kollision mit einem Gegner verliert der Spieler Lebensenergie. Sobald keine Lebenspunkte mehr vorhanden sind, endet das Spiel.

👹 Endgegner

Am Ende des Levels wartet ein Bossgegner.

Der Kampf gegen den Endgegner stellt die letzte Herausforderung des Spiels dar. Wird der Boss besiegt, erreicht der Spieler den erfolgreichen Abschluss des Levels.

📱 Responsive Design

Das Spiel ist für verschiedene Bildschirmgrößen ausgelegt.

Für kleinere Displays werden unter anderem Touch-Steuerelemente verwendet, sodass das Spiel auch auf mobilen Geräten gespielt werden kann.

🧑‍💻 Entwicklung

Das Projekt wurde im Rahmen eines Web-Development-Projekts umgesetzt.

Dabei lag der Fokus insbesondere auf:

objektorientierter Programmierung mit JavaScript

Klassen und Vererbung

Canvas-basierter Spieleentwicklung

Kollisionserkennung

Animationen

Audiointegration

DOM-Manipulation

Responsive Webdesign

🔧 Mögliche Erweiterungen

Das Projekt kann zukünftig beispielsweise um folgende Funktionen erweitert werden:

weitere Level

zusätzliche Gegnertypen

neue Charaktere

Highscore-System

weitere Animationen

zusätzliche Soundeffekte

Speichersystem

Multiplayer-Modus

📄 Lizenz

Dieses Projekt wurde zu Lern- und Ausbildungszwecken erstellt.

Verwendete Grafiken, Sounds und weitere Assets unterliegen den jeweiligen Lizenzbedingungen und Copyrights ihrer Urheber.

👨‍💻 Autor

Denis Bode

Web Development Projekt – El Pollo Loco