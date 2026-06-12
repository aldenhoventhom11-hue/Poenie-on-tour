# Poenie on Tour: Getaway

Endless runner voor een vriendengroep, gebouwd voor iPhone (liggend) én desktop. De eigenaar is Thom; alle communicatie met hem gaat **in het Nederlands**, net als alle teksten ín het spel en alle code-commentaar.

## Gouden regels

1. **Alles zit in één bestand: `index.html`** (~8 MB door de ingesloten mp3-muziek). Dit blijft zo — het spel wordt gedeeld via één link en geüpload als één bestand. Nooit opsplitsen in losse js/css-bestanden.
2. **Versienummer bumpen bij elke oplevering**: zoek `id="home-version"` (tekst zoals `versie 3.8`) en verhoog hem. Thom checkt dit nummer op zijn iPhone om cache-problemen te herkennen. Huidige versie: **3.8**.
3. **Na elke wijziging testen** (zie Teststrategie). Geen oplevering zonder dat alle zes tests groen zijn.
4. **Bij grote feature-verzoeken**: stel Thom eerst 2-3 verduidelijkende multiple-choice-vragen, implementeer daarna alles in één keer. Dat is zijn uitdrukkelijke voorkeur.
5. Na een oplevering: leg in het Nederlands uit wat er veranderd is en wat hij moet testen, en noem het versienummer.

## Deployment (live)

- GitHub-repo: `aldenhoventhom11-hue/Poenie-on-tour`, bestand `index.html`. Deze repo-clone (`~/Downloads/Poenie-on-tour`) is sinds 2026-06-12 de canonieke werkmap: de game leeft hier als `index.html`, met `CLAUDE.md` en `tests/` ernaast.
- Live URL: https://aldenhoventhom11-hue.github.io/Poenie-on-tour/
- Workflow nu: wijzig `index.html` direct in deze map → tests draaien → committen/pushen vanuit Claude Code → ±2 min wachten → testen in een privé-tabblad op de iPhone. Het handmatige uploaden via de GitHub web-UI is daarmee vervallen.
- Muziek werkt alleen op de live site (autoplay-restricties in previews).

## Teststrategie

Zes Node-testscripts in `tests/` (geen dependencies, puur Node ≥18). Draai vanuit de projectroot:

```bash
for t in tests/*.js; do node "$t"; done
```

- `testtut.js` — tutorial-flow + 20.000 frames lange run (komt voorbij 10.000 m, dekt dus tunnel + oorlogsgebied + alle chase-fasen).
- `testphone.js` — zelfde, maar als liggende iPhone (844×390, pointer:coarse → breed dynamisch speelveld).
- `testsel.js` — karakterselectie: detail openen, traits, terug, bevestigen & starten.
- `testmenu.js` — menu-achtergrond-animatie.
- `testitems.js` — alle vier character-item-flows end-to-end (Julian tegen agent/motor/heli apart; Timo-vuur; Daan-rage incl. onkwetsbaarheid; Thom-freeze incl. bevroren meters).
- `testdemo.js` — alle 14 detail-scherm-demo's frame-voor-frame.

Snelle syntax-check los van de tests:
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const js=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));new Function(js);console.log('OK');"
```

Eigenaardigheden van de testharnassen: het hele spel zit in een IIFE; de tests strippen die zodat interne variabelen/functies direct bereikbaar zijn na `eval`. De stubs hebben géén echte canvas (alle draw-calls zijn no-ops) en `requestAnimationFrame`-callbacks krijgen geen timestamp — de game-loop heeft daarvoor een synthetisch-tijd-pad (`ts===undefined`). `window.matchMedia` ontbreekt in de stubs behalve in testphone (daar `matches:true`). `setTimeout` voert callbacks NIET uit in de stubs. Voeg je een nieuwe canvas-API toe aan het spel, dan moet die ook in de `mkCtx()`-stub van de tests (bekend voorbeeld: `clip()`).

Bewerk-discipline (uit ervaring): bij geautomatiseerde tekst-vervangingen in het grote bestand altijd eerst controleren dat de oude tekst exact bestaat (alles-of-niets), anders gaan wijzigingen stilletjes verloren.

## Architectuur van index.html

Eén `<script>` met een IIFE. Belangrijkste onderdelen, grofweg in volgorde:

- **Character-tekencode**: `runner(ctx,cx,by,s,f,opts)` tekent elk figuur; per character een opts-object (torso/head-callbacks, kleuren). `legSeg`/`armSeg`/`armSegThin` zijn pose-bewust via de globale `runnerPose` (`'run' | 'slide' | 'jump' | 'dance' | 'lift' | 'throwArm'`): slide = benen recht gestrekt (geen pas), jump = knieën diep ingetrokken en stil, dance = heupwiegen + armen omhoog zwaaiend (Thoms feest), lift = armen recht omhoog (Julian draagt), throwArm = armen zwaaien door voor de worp (Julian/Timo, gestuurd door globale `throwProg`). In `runner()` worden bij jump/slide de swings bevroren (geen tijdcadans). `faceFlush` (0..1, globaal) laat een gezicht rood aanlopen in `faceBase()` (Daan op de pil); zet vóór de draw, reset erna. Zet alle vlaggen vóór een draw en reset ze daarna.
- **Soldatenpak**: globale `soldierMode` (oorlogsgebied). In `runner()` vervangt `soldierTorso()` dan de eigen torso volledig, mouwen/benen worden camo, `soldierHelmet()` over het hoofd. De agent is uitgezonderd via `opts.isPolice`.
- **Achtergrond**: `drawCity()` met parallax-lagen; mid-laag tegels van 190px routeren per zone naar `cityBlock`/`harborBlock`/`parkBlock`/`pomodoroBlock`/`warBlock`. `pomodoroBlock` bevat de twee 1-op-1 nagetekende panden van Thoms foto (Boccaccio Pommie + frietzaak) plus `bigTomato()` en `bikiniBabe()`.
- **Party/feest**: tijdens `party.active` rent de blonde vrouw (`drawWoman`, gedetailleerd) mee op `PLAYER_X+78`. Het publiek (`drawCrowd`) is wereld-verankerd: het krijgt de `scroll`-offset mee en schuift naar links — je rent er dus langs (alleen de vrouw rent mee).
- **Zones**: `ZONES[0..4]` = stad, haven, park, pomodoro, oorlog. `zoneAt(m)`: oorlog (index 4) via `isWarAt(m)` = vanaf `WAR_START=10000` de eerste `WAR_LEN=1200` m van elke `WAR_CYCLE=4800` m; anders `floor(m/ZONE_LEN)%4`. Bij elke normaal↔oorlog-wissel: `tunnelT=240` (4 s tunnel, `drawTunnel()`), arrays leeg, spawn-pauze, outfit-wissel op `tunnelT===120`.
- **Obstakels**: alleen `jump` en `slide` (geen platforms). `makeObstacle` legt `o.zi` vast (zone bij spawn) zodat het uiterlijk nooit wisselt op een zonegrens; `drawObstacle` tekent per `o.zi`: stad = grote bedelende zwerver (47 hoog) / winkel-luifel; haven = zeecontainer / hijskraan met hangende container; park = houten hekje / boomtak; pomodoro = rollende reuzentomaat / zwaaiend neon-uithangbord; oorlog = zandzakken-muur / checkpoint-slagboom met camouflagenet.
- **Chase-systeem**: `chase.phase` 0/1 = agent (`police`), 2/3 = motor (`chase.motorX`), 4 = heli (`chase.heliX`). `chaserDown` = frames "uitgeschakeld". `chaserKind()`/`chaserPos(kind)` zijn de helpers voor effecten op de actieve achtervolger.
- **Superkrachten**: `sk`-object, per character (`SK_NAME`); laadbalk klein linksboven, kleine ronde ⚡-knop links (top:30%).
- **Character-items** (zeldzame pickups, kans 0.32, max 3/run, via `CHAR_ITEM`): bram boomstam (`logHeld/logFly`), jarno poepspray (`sprayHeld/sprayAnim`; bus in de hand via `drawSprayCan`, groene mist met radial-gradients richting de actieve achtervolger), olle hamburger (automatisch, `burgerT`), julian gewichten (`julianAct` met fases reach/carry/throw; `drawCarriedChaser` + worp-strepen/HUP, armpose `lift`/`throwArm`), timo wok (`wokFly` → `burnT=300`; pan getekend met `drawFlamingWok` in één hand/vliegend, chaser volledig in de fik maar blijft volgen), daan rode pil (`pillAnim` → `rageT=600`, onkwetsbaar + rood gezicht via `faceFlush`), thom XXL-bier (`drinkT=120` → `freezeT=300`: update() bevriest de hele wereld vroeg met een return; drinken met `drawHeldGlass` aan de mond, daarna menselijke dans via pose `dance`). Herbruikbare helpers `drawFlamingWok`/`drawHeldGlass`/`drawSprayCan` nemen een optionele `(c, fr)` = doel-ctx + frame, zodat de detail-demo's exact dezelfde animaties tonen. Eén generieke `#item-btn` (emoji per item), gestapeld onder de ⚡-knop links samen met `#log-btn`/`#spray-btn`.
- **Pickup-hitbox**: biertjes én items worden gepakt met een RUIME zone rond het hele lichaam (`grabL/grabR/grabTop/grabBot` in `update()`, hoofd t/m voeten + marge). Obstakels gebruiken bewust de strakke speler-box (`pxL/pw/fT/fB`) — niet ruimer, anders wordt het spel oneerlijk.
- **Detail-demo's**: `drawDetailDemo()` speelt op het 190×250 detail-canvas 14 gescripte mini-scènes af (`detDemo={type:'sk'|'item',t}`), aangestuurd door knoppen `b-demo-sk`/`b-demo-item` in het keuzescherm.
- **Game-loop**: vaste tijdstap (60 updates/s) met accumulator, losgekoppeld van de framerate — dit voorkomt slow motion op trage apparaten. NIET terugdraaien naar 1 update per frame. Vermijd ook `ctx.shadowBlur` (zeer traag op iOS) en DOM-writes per frame (`syncSkButton` schrijft alleen bij echte wijzigingen via `btnState`).
- **Mobiel**: `IS_TOUCH` → dynamische speelveldbreedte `VW` (800–1280, past zich aan de schermverhouding aan); grote onzichtbare raakzones `.ctrl-zone` (32% breed × 58% hoog) voor springen/sliden; menu-panelen schalen zichzelf passend via `fitPanels()` (nooit scrollen). `.screen` heeft `overflow:hidden` (géén scroll) en `fitPanels()` schaalt het zichtbare `.panel`/`.fitwrap` met `transform:scale` op basis van `visualViewport` (iOS URL-balk), getriggerd op `resize`/`orientationchange`/`visualViewport`-events en bij elke `showScreen`. iOS-fullscreen via "Zet op beginscherm"-uitleg (`#ios-tip`, ook op `#rotate-overlay`).
- **Gepakt-cinematic**: bij `endRun()` slow-zoom + letterbox-balken + zwaailicht-tint (`cineStart`), daarna pas de banner.
- **Leaderboard**: gelaagd in `loadBoard`/`saveBoard`: Firebase Realtime Database via REST (als `LB_FIREBASE_URL` is ingevuld; GET/PUT op `/scores.json`) → `window.storage` (Claude-preview) → `localStorage`. `#lb-source` toont de actieve bron. Top **50** scores. Elk apparaat heeft een vast `MY_DEVICE`-id (localStorage `poenie_device_v1`); scores met `dev===MY_DEVICE` worden **goud** gemarkeerd (`.row.mine`) als 'van jou'.
- **Willekeurig karakter**: knop `#b-random` opent `slot-view` (gokkast). `pullLever()` kiest uniform een `slot.target`, de reel rolt met ease-out en landt exact op dat karakter (zie `pullLever`/`slotTick`/`slotDraw`), daarna vuurwerk en `finishSlot()` → auto-start via `beginGame()`. `randomMode` blijft aan: "nog een keer" (`b-again`) opent de gokkast opnieuw. Draait mee in de menu-`setInterval`-loop.

## Openstaande punten

- **Gedeeld online leaderboard activeren (Firebase)**: Thom moet op https://console.firebase.google.com een gratis project maken → Realtime Database aanmaken in testmodus → de database-URL kopiëren en plakken op de regel met `VUL HIER JE FIREBASE DATABASE-URL IN` (variabele `LB_FIREBASE_URL`). Daarna deelt iedereen via de link één leaderboard (top 50, eigen scores goud). Zolang de URL leeg is, valt het terug op alleen-dit-apparaat (localStorage).
- Eerder aangeboden maar nog niet gekozen verfraaiingen: weer per zone, levende achtergrond (auto's/meeuwen/vlinders), score-popups, sfeerverlichting/lichtkegels, lucht die meekleurt met afstand, nat wegdek in de haven.

## Spelcontext

Zeven speelbare vrienden: julian, olle, timo, daan, jarno, bram, thom. Eindscore = meters + 25×biertjes + 250×chicks. Thoms record: 767. Toon: volwassen vriendengroep-humor (bier, kroeg), cartoonesk — geen expliciete content.
