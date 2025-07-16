# Unity Setup Instructions

## Quick Setup (After Unity Hub is installed)

### 1. Install Unity Editor
1. In Unity Hub, go to "Installs" tab
2. Click "Install Editor"
3. Choose **Unity 2022.3 LTS** (latest 2022.3.x version)
4. **IMPORTANT**: Add these modules:
   - ✅ WebGL Build Support
   - ✅ Mac Build Support (if on Mac)
   - ✅ Visual Studio (optional but recommended)

### 2. Create Project
1. Go to "Projects" tab
2. Click "New project"
3. Select **2D (Built-in Render Pipeline)** template
4. Project name: `CryptoTradingSim`
5. Location: This directory (`/Users/ryan/Dropbox/gauntlet/cohort2/G2W5-BTC-SIM`)
6. Click "Create project"

### 3. Import Prepared Scripts
The following scripts are ready in `Assets/Scripts/`:
- `UserManager.cs` - Handles test user state
- `LoginManager.cs` - Controls login screen
- `MainScreenManager.cs` - Controls main screen

### 4. Create Scenes

#### Login Scene
1. File → New Scene
2. Save as `Assets/Scenes/Login.unity`
3. Create UI:
   - Canvas (right-click Hierarchy → UI → Canvas)
   - Set Canvas Scaler to "Scale With Screen Size" (1920x1080)
   - Add Panel (black background)
   - Add Title Text (TextMeshPro)
   - Add 2 Buttons for Alice and Bob
   - Attach `LoginManager.cs` to a GameObject
   - Connect UI elements in Inspector

#### Main Scene
1. File → New Scene
2. Save as `Assets/Scenes/Main.unity`
3. Create UI:
   - Canvas with black background
   - Welcome text
   - Portfolio value text
   - Allocation text (optional)
   - Logout button
   - Attach `MainScreenManager.cs`
   - Connect UI elements

### 5. Build Settings
1. File → Build Settings
2. Add both scenes (Login first, then Main)
3. Switch Platform to WebGL
4. Player Settings:
   - Company Name: Your name
   - Product Name: Crypto Trading Sim
   - Default Canvas Width: 1920
   - Default Canvas Height: 1080

### 6. Build & Test
1. Build and Run (Cmd/Ctrl + B)
2. Test user switching
3. Verify both users show correct values

## Quick Test
- Alice should show: $10M → $12M (+20%)
- Bob should show: $10M → $8M (-20%)
- Can switch between users
- Logout returns to login screen 