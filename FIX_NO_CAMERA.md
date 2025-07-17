# Fix: No Cameras Rendering

## Quick Fix (In Unity)

You're seeing "No cameras rendering" because the scene is missing a camera. Here's how to fix it:

### Option 1: Use the Menu Command (Easiest)
1. In Unity, go to: **Tools > Quick Fixes > Add Camera to Current Scene**
2. The camera will be automatically added and the scene saved

### Option 2: Manually Add Camera
1. Right-click in the Hierarchy
2. Select: **Create > Camera**
3. Rename it to "Main Camera"
4. Make sure its tag is set to "MainCamera" in the Inspector
5. Position: X=0, Y=0, Z=-10

### Option 3: Rebuild the Scene
1. Go to: **Tools > Build Scenes > Build Main Scene**
2. This will rebuild the scene with all proper components including camera

## Prevention

I've added several safeguards:
1. `RuntimeCameraChecker.cs` - Automatically creates a camera at runtime if missing
2. `AutoSceneBuilder.cs` - Now includes cameras when building scenes
3. Updated `MainScreenManager.cs` - Adds camera checker component

## Note
After fixing, you should see:
- Alice's welcome message
- Portfolio value of $12M
- The logout button

The black background with UI elements should be visible in Game view. 