# 🚀 Unity Automated Setup - Minimal Interaction!

I've created a script that builds everything for you. Here's all you need to do:

## Step 1: In Unity (One Time Only)
1. **Import TextMeshPro** if you see errors:
   - Window → TextMeshPro → Import TMP Essential Resources
   
2. **Wait for Unity to compile** the scripts (progress bar at bottom)

3. **Run the Scene Builder**:
   - Top menu: **Tools → Build Crypto Sim Scenes**
   - This creates both scenes automatically!

## Step 2: Configure Build Settings
1. **File → Build Settings**
2. Click **Add Open Scenes** (should add Login.unity)
3. Open Main scene: **File → Open Scene → Assets/Scenes/Main.unity**
4. In Build Settings, click **Add Open Scenes** again
5. Make sure Login is scene 0, Main is scene 1
6. Click **Switch Platform** and choose **WebGL**

## Step 3: Test in Editor
1. Open Login scene: **File → Open Scene → Assets/Scenes/Login.unity**
2. Hit **Play** button (triangle at top)
3. Click Alice or Bob - should switch scenes!
4. Click Logout - should return to login

## Step 4: Build for Web
1. **File → Build Settings → Build**
2. Create a folder called `Builds`
3. Build there
4. Open `Builds/index.html` in browser

## That's It!
The `AutoSceneBuilder.cs` script created everything:
- Canvas with proper settings
- All UI elements positioned correctly
- Scripts wired up automatically
- Both scenes ready to go

Total Unity interaction time: ~5 minutes instead of 30! 