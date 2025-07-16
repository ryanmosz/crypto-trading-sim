# Unity Quick Setup Checklist

Unity should be opening now. Here's what to do:

## 1. Fix TextMeshPro Import (First Thing!)
When Unity opens, it will show errors. This is normal!
1. Window → TextMeshPro → Import TMP Essential Resources
2. Click "Import" in the popup
3. Errors should disappear

## 2. Create Scenes Folder
1. In Project window: Right-click Assets → Create → Folder → Name it "Scenes"

## 3. Create Login Scene
1. File → New Scene
2. File → Save As → `Assets/Scenes/Login.unity`
3. **Setup Canvas:**
   - Right-click Hierarchy → UI → Canvas
   - Select Canvas → Inspector → Canvas Scaler:
     - UI Scale Mode: Scale With Screen Size
     - Reference Resolution: 1920 x 1080
4. **Add Background:**
   - Right-click Canvas → UI → Panel
   - Rename to "Background"
   - Image component → Color: Black (0,0,0,1)
5. **Add Title:**
   - Right-click Canvas → UI → Text - TextMeshPro
   - Text: "CRYPTO TRADING SIM"
   - Font Size: 72
   - Alignment: Center
   - Position Y: 200
6. **Add Alice Button:**
   - Right-click Canvas → UI → Button - TextMeshPro
   - Rename to "AliceButton"
   - Width: 400, Height: 150
   - Position: X: -250, Y: 0
   - Text: "Alice\n$10M → $12M (+20%)"
   - Text Color: Cyan
7. **Add Bob Button:**
   - Right-click Canvas → UI → Button - TextMeshPro
   - Rename to "BobButton"
   - Width: 400, Height: 150
   - Position: X: 250, Y: 0
   - Text: "Bob\n$10M → $8M (-20%)"
   - Text Color: Magenta
8. **Wire up LoginManager:**
   - Create Empty GameObject → Rename to "LoginManager"
   - Add Component → Scripts → LoginManager
   - Drag UI elements to script fields in Inspector

## 4. Create Main Scene
1. File → New Scene
2. File → Save As → `Assets/Scenes/Main.unity`
3. Similar canvas setup as Login scene
4. Add Welcome Text, Portfolio Text, Logout Button
5. Wire up MainScreenManager script

## 5. Build Settings
1. File → Build Settings
2. Add Open Scenes (Login first, then Main)
3. Platform: WebGL (click Switch Platform)
4. Player Settings → Resolution: 1920x1080

## 6. Test!
1. Hit Play in Login scene
2. Click Alice or Bob
3. Should switch to Main scene
4. Logout should return to Login

## 7. Build WebGL
1. File → Build Settings → Build
2. Choose "Builds/WebGL" folder
3. Wait for build (5-10 minutes first time)
4. Open index.html in browser! 