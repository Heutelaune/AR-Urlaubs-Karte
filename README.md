# AR Urlaubskarte

Eine webbasierte Augmented Reality-Anwendung, die eine tropische Insel über einem AR-Marker anzeigt.

## Beschreibung

Diese Anwendung nutzt Webtechnologien zur Erstellung einer Augmented Reality-Erfahrung. Nach einem initialen Kameratest wird eine 3D-Szene einer tropischen Insel über einem Hiro-Marker gerendert. Die Anwendung wurde entwickelt, um AR-Erlebnisse ohne native App-Installation direkt im Browser zugänglich zu machen.

## Dateien im Projekt

- `index.html` - Die Hauptseite mit der HTML-Struktur
- `style.css` - Alle Stile und das Layout der Anwendung
- `app.js` - Die JavaScript-Funktionalität, einschließlich Kamerazugriff, Skript-Ladung und AR-Szenenaufbau
- `README.md` - Diese Dokumentation

## Erste Schritte

1. Lade alle Dateien herunter und speichere sie im selben Verzeichnis
2. Öffne die `index.html` Datei in einem modernen Browser (vorzugsweise Chrome oder Firefox)
3. Drucke den Hiro-Marker aus (kann über den "Marker herunterladen" Button in der App heruntergeladen werden)
4. Erlaube Kamerazugriff, wenn du dazu aufgefordert wirst
5. Halte den ausgedruckten Marker vor die Kamera, um die AR-Insel zu sehen

## Technische Anforderungen

- Moderner Webbrowser mit WebRTC-Unterstützung für Kamerazugriff
- Internetverbindung zum Laden der externen Bibliotheken
- Für beste Ergebnisse: Mobile Geräte mit aktuellen Browsern

## Verwendete Bibliotheken

Diese Anwendung nutzt folgende externe JavaScript-Bibliotheken:

1. **A-Frame (v1.3.0)**
   - Webframework zur Erstellung von 3D/AR/VR-Erlebnissen
   - Geladen von CDN: `https://cdnjs.cloudflare.com/ajax/libs/aframe/1.3.0/aframe.min.js`
   - Alternative Quelle: `https://aframe.io/releases/1.3.0/aframe.min.js`

2. **AR.js**
   - Erweiterung für A-Frame zur Marker-basierten Augmented Reality
   - Primäre Quelle: `https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js`
   - Alternative Quellen:
     - `https://cdnjs.cloudflare.com/ajax/libs/AR.js/2.4.0/aframe-ar.min.js`
     - `https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.0/aframe/build/aframe-ar.min.js`

## Funktionen

- Kamerazugriffstest vor der AR-Erfahrung
- Dynamisches Laden der AR-Bibliotheken mit Fallback-Quellen
- Tropische Insel mit animierter Palme und umgebendem Wasser
- Feedback, wenn der Marker erkannt oder verloren wird

## Fehlerbehandlung

Die Anwendung versucht, die benötigten Bibliotheken aus mehreren Quellen zu laden, falls primäre Quellen nicht verfügbar sind. Wenn Probleme auftreten, gibt es eine "Erneut versuchen" Option, die die Seite neu lädt.

## Hinweis

Für ein optimales AR-Erlebnis sollte der Marker auf ein nicht glänzendes Material gedruckt werden und gute Lichtverhältnisse vorhanden sein.
