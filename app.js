document.addEventListener('DOMContentLoaded', function() {
    const testCameraButton = document.getElementById('test-camera');
    const cameraTest = document.getElementById('camera-test');
    const videoElement = document.getElementById('video-element');
    const continueButton = document.getElementById('continue-button');
    const errorMessageDiv = document.getElementById('error-message');
    const infoBox = document.getElementById('info-box');
    const arInfo = document.getElementById('ar-info');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    let videoStream = null;
    let loadingTimeout = null;
    
    testCameraButton.addEventListener('click', function() {
        // Kamera testen
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' },
            audio: false 
        })
        .then(function(stream) {
            videoStream = stream;
            videoElement.srcObject = stream;
            cameraTest.style.display = 'block';
        })
        .catch(function(error) {
            console.error("Kamera-Fehler:", error);
            errorMessageDiv.innerHTML = `
                <strong>Kamerazugriff fehlgeschlagen:</strong><br>
                ${error.message || 'Unbekannter Fehler'}<br><br>
                Bitte erlaubte den Kamerazugriff in deinen Browser-Einstellungen.
            `;
            errorMessageDiv.style.display = 'block';
        });
    });
    
    continueButton.addEventListener('click', function() {
        // Video-Stream stoppen
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        
        // Kameratest ausblenden
        cameraTest.style.display = 'none';
        
        // Info-Box ausblenden
        infoBox.style.display = 'none';
        
        // Lade-Anzeige einblenden
        loadingIndicator.style.display = 'block';
        
        // Safety-Timeout für den Fall, dass loaded-Event nicht ausgelöst wird
        loadingTimeout = setTimeout(function() {
            console.log("Timeout erreicht - blende Ladebildschirm aus");
            loadingIndicator.style.display = 'none';
            arInfo.style.display = 'block';
        }, 8000); // 8 Sekunden Timeout
        
        // AR-Skripte laden und AR-Szene erstellen
        loadARScripts();
    });
    
    // Separate Funktionen zum Laden der Skripte und zum Erstellen der AR-Szene
    function loadARScripts() {
        console.log("Lade AR-Skripte...");
        
        try {
            // Prüfen, ob A-Frame bereits geladen ist
            if (typeof AFRAME !== 'undefined') {
                console.log("A-Frame bereits geladen");
                loadARjsScript();
            } else {
                // A-Frame Script laden - mit Version 1.3.0, die bekannt für gute Kompatibilität mit AR.js ist
                const aframeScript = document.createElement('script');
                aframeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/aframe/1.3.0/aframe.min.js';
                aframeScript.crossOrigin = 'anonymous'; // CORS-Header hinzufügen
                aframeScript.onerror = function(e) {
                    console.error("Fehler beim Laden von A-Frame:", e);
                    // Alternative CDN versuchen
                    const altAframeScript = document.createElement('script');
                    altAframeScript.src = 'https://aframe.io/releases/1.3.0/aframe.min.js';
                    altAframeScript.crossOrigin = 'anonymous';
                    altAframeScript.onerror = function(e) {
                        console.error("Fehler beim Laden von A-Frame von alternativer Quelle:", e);
                        showErrorInLoadingIndicator("Fehler beim Laden von A-Frame");
                    };
                    altAframeScript.onload = loadARjsScript;
                    document.head.appendChild(altAframeScript);
                    console.log("Versuche alternative A-Frame Quelle");
                };
                aframeScript.onload = loadARjsScript;
                document.head.appendChild(aframeScript);
                console.log("A-Frame Script-Tag wurde hinzugefügt");
            }
        } catch (error) {
            console.error("Fehler beim Laden der Skripte:", error);
            showErrorInLoadingIndicator("Fehler beim Laden der Skripte");
        }
    }
    
    function loadARjsScript() {
        console.log("A-Frame geladen, lade AR.js...");
        
        try {
            // Prüfen, ob AR.js bereits geladen ist
            if (typeof THREEx !== 'undefined' && THREEx.ArToolkitContext) {
                console.log("AR.js scheint bereits geladen zu sein");
                createARScene();
            } else {
                // AR.js laden - Version 2.2.2 ist bekannt für bessere Kompatibilität mit A-Frame 1.3.0
                const arjsScript = document.createElement('script');
                arjsScript.crossOrigin = 'anonymous'; // CORS-Header hinzufügen
                
                // Erste Quelle: Raw GitHub (direkt von AR.js Repo)
                arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
                
                arjsScript.onerror = function(e) {
                    console.error("Fehler beim Laden von AR.js von ersten Quelle:", e);
                    
                    // Wenn erste Quelle fehlschlägt, zweite probieren
                    const altArjsScript = document.createElement('script');
                    altArjsScript.crossOrigin = 'anonymous';
                    altArjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/AR.js/2.4.0/aframe-ar.min.js';
                    
                    altArjsScript.onerror = function(e) {
                        console.error("Fehler beim Laden von AR.js von zweiter Quelle:", e);
                        
                        // Wenn auch die zweite Quelle fehlschlägt, dritte probieren
                        const thirdArjsScript = document.createElement('script');
                        thirdArjsScript.crossOrigin = 'anonymous';
                        thirdArjsScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.0/aframe/build/aframe-ar.min.js';
                        
                        thirdArjsScript.onerror = function(e) {
                            console.error("Fehler beim Laden von AR.js von dritter Quelle:", e);
                            showErrorInLoadingIndicator("Fehler beim Laden von AR.js");
                        };
                        
                        thirdArjsScript.onload = function() {
                            console.log("AR.js erfolgreich von dritter Quelle geladen");
                            setTimeout(createARScene, 500);
                        };
                        
                        document.head.appendChild(thirdArjsScript);
                    };
                    
                    altArjsScript.onload = function() {
                        console.log("AR.js erfolgreich von zweiter Quelle geladen");
                        setTimeout(createARScene, 500);
                    };
                    
                    document.head.appendChild(altArjsScript);
                };
                
                arjsScript.onload = function() {
                    console.log("AR.js erfolgreich geladen");
                    // Kleines Timeout, um sicherzustellen, dass AR.js initialisiert ist
                    setTimeout(createARScene, 500);
                };
                
                document.head.appendChild(arjsScript);
                console.log("AR.js Script-Tag wurde hinzugefügt von erster Quelle");
            }
        } catch (error) {
            console.error("Fehler beim Laden von AR.js:", error);
            showErrorInLoadingIndicator("Fehler beim Laden von AR.js: " + error.message);
        }
    }
    
    function showErrorInLoadingIndicator(errorMsg) {
        loadingIndicator.innerHTML = `
            <h3>Fehler beim Laden</h3>
            <p>${errorMsg}</p>
            <button id="retry-button" class="button">Erneut versuchen</button>
        `;
        
        document.getElementById('retry-button').addEventListener('click', function() {
            location.reload();
        });
    }
    
    function createARScene() {
        console.log("Erstelle AR-Szene...");
        
        try {
            // Prüfen, ob AFRAME und AR.js erfolgreich geladen wurden
            if (typeof AFRAME === 'undefined') {
                throw new Error("A-Frame ist nicht geladen");
            }
            
            console.log("AFRAME Version:", AFRAME.version);
            
            // AR-Szene erstellen, aber unterschiedliche Attribute je nach geladener AR.js-Version
            const arScene = document.createElement('a-scene');
            arScene.setAttribute('embedded', '');
            
            // Bei neueren AR.js-Versionen können die Parameter anders sein
            // Versuche beide Varianten, die in verschiedenen AR.js-Versionen funktionieren
            if (AFRAME.version.startsWith('1.3')) {
                // Attribute für AR.js mit A-Frame 1.3.x
                arScene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
            } else {
                // Allgemeine Attribute, die in den meisten Versionen funktionieren sollten
                arScene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;');
            }
            
            // Für ältere Browser: vr-mode-ui deaktivieren
            arScene.setAttribute('vr-mode-ui', 'enabled: false');
            
            // Kamera-Einheit mit Anpassungen für AR.js
            const camera = document.createElement('a-entity');
            camera.setAttribute('camera', '');
            camera.setAttribute('look-controls', 'enabled: false');
            
            // Bei AR.js 3.x wird ein cursor attribute empfohlen
            camera.setAttribute('cursor', 'fuse: false; rayOrigin: mouse;');
            
            // Wichtig: Je nach Version kann eine Gruppe notwendig sein
            const cameraGroup = document.createElement('a-entity');
            cameraGroup.setAttribute('position', '0 0 0');
            cameraGroup.appendChild(camera);
            arScene.appendChild(cameraGroup);
            
            // Marker - verschiedene Arten probieren (falls eine nicht funktioniert)
            const marker = document.createElement('a-marker');
            marker.setAttribute('preset', 'hiro');
            marker.setAttribute('emitevents', 'true'); // Explizit Events aktivieren
            
            // Event-Listener für Marker-Erkennung
            marker.addEventListener('markerFound', function() {
                console.log("Marker gefunden!");
                // Visuelle Rückmeldung im AR-Info
                arInfo.innerHTML = '<p><strong>Marker erkannt!</strong> Die tropische Insel wird angezeigt.</p>';
            });
            
            marker.addEventListener('markerLost', function() {
                console.log("Marker verloren!");
                // Zurück zur Standard-Info
                arInfo.innerHTML = '<p>Halte die Kamera auf den Marker, um die tropische Insel zu sehen.</p>';
            });
            
            // Insel (Basis) - mit Animation für bessere Sichtbarkeit
            const island = document.createElement('a-cylinder');
            island.setAttribute('position', '0 0.1 0');
            island.setAttribute('radius', '1.5');
            island.setAttribute('height', '0.2');
            island.setAttribute('color', '#C2B280');
            island.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear');
            marker.appendChild(island);

            // Wasser um die Insel - mit Animation
            const water = document.createElement('a-ring');
            water.setAttribute('position', '0 0.05 0');  // Positionierung knapp unterhalb der Insel
            water.setAttribute('rotation', '-90 0 0');   // Rotation um 90 Grad, um horizontal zu liegen
            water.setAttribute('radius-inner', '1.5');
            water.setAttribute('radius-outer', '3');
            water.setAttribute('color', '#1E90FF');
            water.setAttribute('animation', 'property: rotation; to: -90 0 360; loop: true; dur: 15000; easing: linear');
            marker.appendChild(water);

            // Hauptpalme mit hellerem Stamm für bessere Sichtbarkeit
            const palmTrunk = document.createElement('a-cylinder');
            palmTrunk.setAttribute('position', '0.5 0.7 0.5');
            palmTrunk.setAttribute('radius', '0.1');
            palmTrunk.setAttribute('height', '1.2');
            palmTrunk.setAttribute('color', '#A0522D');
            marker.appendChild(palmTrunk);

            const palmLeaves = document.createElement('a-cone');
            palmLeaves.setAttribute('position', '0.5 1.4 0.5');
            palmLeaves.setAttribute('radius-bottom', '0.8');
            palmLeaves.setAttribute('radius-top', '0');
            palmLeaves.setAttribute('height', '0.8');
            palmLeaves.setAttribute('color', '#32CD32');
            palmLeaves.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear');
            marker.appendChild(palmLeaves);

            // Größerer Text für bessere Lesbarkeit
            const textTitle = document.createElement('a-text');
            textTitle.setAttribute('value', 'Tropisches Paradies');
            textTitle.setAttribute('position', '0 2.2 0');
            textTitle.setAttribute('rotation', '-90 0 0');
            textTitle.setAttribute('scale', '1.2 1.2 1.2');
            textTitle.setAttribute('color', '#000000');
            textTitle.setAttribute('align', 'center');
            marker.appendChild(textTitle);
            
            // Marker zur Szene hinzufügen
            arScene.appendChild(marker);
            
            // Event-Listeners für die Szene
            arScene.addEventListener('loaded', function() {
                console.log("AR-Szene geladen und bereit!");
                if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    loadingTimeout = null;
                }
                loadingIndicator.style.display = 'none';
                arInfo.style.display = 'block';
            });
            
            // Zusätzliche Events überwachen
            arScene.addEventListener('renderstart', function() {
                console.log("AR-Szene: Rendering gestartet!");
            });
            
            arScene.addEventListener('camera-init', function() {
                console.log("AR-Szene: Kamera initialisiert!");
            });
            
            // Fehlerbehandlung
            arScene.addEventListener('error', function(e) {
                console.error("AR-Szene Fehler:", e);
                showErrorInLoadingIndicator("Fehler beim Initialisieren der AR-Szene");
            });
            
            // Szene zum Body hinzufügen, aber vorher prüfen, ob bereits eine a-scene existiert
            const existingScene = document.querySelector('a-scene');
            if (existingScene) {
                console.log("Eine a-scene existiert bereits - entferne sie zuerst");
                existingScene.parentNode.removeChild(existingScene);
            }
            
            document.body.appendChild(arScene);
            console.log("AR-Szene erstellt und zum DOM hinzugefügt");
            
            // Wenn nach 5 Sekunden das loaded-Event nicht gefeuert wurde, 
            // versuchen wir trotzdem, weiterzumachen
            setTimeout(function() {
                if (loadingIndicator.style.display !== 'none') {
                    console.log("AR-Szene lädt noch immer - forciere Fortfahren");
                    loadingIndicator.style.display = 'none';
                    arInfo.style.display = 'block';
                    
                    // Versuche, die Szene zu initialisieren, falls dies nicht automatisch passiert ist
                    if (typeof AFRAME.scenes !== 'undefined' && AFRAME.scenes.length > 0) {
                        console.log("Versuche, die Szene manuell zu initialisieren");
                        try {
                            AFRAME.scenes[0].play();
                        } catch (e) {
                            console.error("Fehler beim manuellen Initialisieren:", e);
                        }
                    }
                }
            }, 5000);
            
        } catch (error) {
            console.error("Fehler beim Erstellen der AR-Szene:", error);
            showErrorInLoadingIndicator("Fehler beim Erstellen der AR-Szene: " + error.message);
        }
    }
});
