# ELO Fußball Simulator 🏆

Eine moderne, responsive Website zur Simulation von Fußballspielen und Turnieren mithilfe des ELO-Ratingsystems.

## ✨ Features

### 🎮 Einzelspiel-Simulation
- **Team-Auswahl**: Wähle aus 25 vordefinierten Nationalmannschaften oder gib eigene Teams mit ELO-Werten ein
- **ELO-Berechnung**: Automatische Berechnung der Gewinnerwartung basierend auf ELO-Differenz
- **Spielsimulation**: Realistische Spielergebnisse mit Toren und ELO-Änderungen
- **Sofortige Ergebnisse**: Anzeige der neuen ELO-Werte nach jedem Spiel

### 🏆 Turnier-Modus
- **Flexible Struktur**: Gruppenphase + KO-Phase oder direkte KO-Phase
- **Konfigurierbare Gruppen**: 4, 6 oder 8 Gruppen mit 3-4 Teams pro Gruppe
- **Automatische Simulation**: Alle Spiele werden automatisch simuliert
- **Detaillierte Ergebnisse**: Gruppentabellen, KO-Baum und Turniersieger

### 👥 Team-Übersicht
- **25 Nationalmannschaften**: Von Deutschland bis Slowenien mit aktuellen ELO-Werten
- **Sortierte Darstellung**: Teams nach ELO-Rating sortiert
- **Responsive Grid**: Optimiert für alle Bildschirmgrößen

### 📚 ELO-Erklärung
- **Mathematische Grundlagen**: Detaillierte Erklärung der ELO-Formel
- **Transparente Berechnung**: Alle Formeln und Parameter werden erklärt
- **Verständliche Beispiele**: Praktische Anwendung der ELO-Theorie

## 🎨 Design

- **Moderne Neon-Ästhetik**: Dunkles Design mit leuchtenden Akzentfarben
- **Sportliches Layout**: Inspiriert von professionellen Fußball-Websites
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Smooth Animationen**: Fade-in Effekte, Hover-Animationen und Glow-Effekte
- **Inter Font**: Moderne, lesbare Typografie

## 🚀 Verwendung

### Einzelspiel simulieren
1. Gehe zum Tab "Einzelspiel"
2. Wähle zwei Teams aus oder gib eigene Teams ein
3. Nutze die Preset-Buttons für schnelle Team-Auswahl
4. Klicke "Spiel simulieren"
5. Betrachte das Ergebnis und die ELO-Änderungen

### Turnier erstellen
1. Gehe zum Tab "Turnier"
2. Wähle Teams aus der Team-Liste (mindestens 4)
3. Konfiguriere die Turnierstruktur
4. Klicke "Turnier simulieren"
5. Verfolge alle Spiele und den Turnierverlauf

### Teams erkunden
1. Gehe zum Tab "Teams"
2. Betrachte alle verfügbaren Nationalmannschaften
3. Vergleiche ELO-Werte und Länder

### ELO verstehen
1. Gehe zum Tab "Über ELO"
2. Lerne die mathematischen Grundlagen
3. Verstehe, wie Gewinnerwartungen berechnet werden

## 🧮 ELO-System

### Grundformel
```
Gewinnerwartung: E = 1 / (1 + 10^((R₂ - R₁) / 400))
ELO-Änderung: ΔR = K × (S - E)
```

### Parameter
- **E**: Gewinnerwartung (0-1)
- **R₁, R₂**: ELO-Werte der Teams
- **K**: K-Faktor (Standard: 32 für Fußball)
- **S**: Tatsächliches Ergebnis (1=Sieg, 0.5=Unentschieden, 0=Niederlage)

### Beispiel
- **Team A**: ELO 2000
- **Team B**: ELO 1900
- **Gewinnerwartung A**: 64.0%
- **Gewinnerwartung B**: 36.0%

## 🛠️ Technische Details

- **Vanilla JavaScript**: Keine externen Frameworks
- **CSS Grid & Flexbox**: Moderne Layout-Techniken
- **Responsive Design**: Mobile-First Ansatz
- **ES6+ Features**: Moderne JavaScript-Syntax
- **Modulare Architektur**: Saubere Trennung von UI und Logik

## 📱 Browser-Kompatibilität

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## 🔧 Installation

1. Lade alle Dateien in einen Ordner herunter
2. Öffne `index.html` in einem modernen Browser
3. Keine weitere Installation erforderlich!

## 📁 Projektstruktur

```
ELO/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # CSS-Styles und Animationen
├── script.js           # JavaScript-Logik und ELO-Berechnungen
└── README.md           # Diese Dokumentation
```

## 🎯 Zukünftige Erweiterungen

- **Mehr Teams**: Erweiterung um weitere Nationalmannschaften
- **Historische Daten**: ELO-Verlauf über Zeit
- **Statistiken**: Detaillierte Spiel- und Turnierstatistiken
- **Export-Funktionen**: Speichern und Teilen von Ergebnissen
- **Mehrsprachigkeit**: Unterstützung für weitere Sprachen

## 🤝 Mitwirken

Verbesserungsvorschläge und Bug-Reports sind willkommen! Das Projekt ist als Lernprojekt konzipiert und kann gerne erweitert werden.

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz und kann frei verwendet, modifiziert und weiterverbreitet werden.

---

**Viel Spaß beim Simulieren von Fußballspielen! ⚽🏆**
