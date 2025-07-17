# Quick Fix: Update Unity Scene to Show $10M Starting Values

The code is updated but the Unity scene still shows old values. Here's how to fix it:

## Option 1: Rebuild the Scenes (Recommended)
1. In Unity, go to menu: **Tools > Build Scenes > Build All Scenes**
2. This will rebuild both Login and Main scenes with the new $10M values
3. Save the project (Ctrl/Cmd + S)

## Option 2: Quick Fix Current Scene
1. Go to: **Tools > Quick Fixes > Add Camera to Current Scene**
2. Then rebuild: **Tools > Build Scenes > Build Main Scene**
3. Save the project

## Option 3: Build Fresh WebGL
1. Go to: **Tools > Build WebGL Now**
2. Wait for build to complete
3. Refresh your browser at http://localhost:8080

## What You Should See After Fix:
- Login screen: Both buttons show "$10M (Starting)"
- Main screen: Shows "Portfolio: $10.0M" and "$10M (Starting)"
- No more $12M or $8M values

## Why This Happened
The scenes were created with the old values hardcoded. Our code changes updated the scripts, but the existing scene files still had the old text values. Rebuilding the scenes uses the updated scripts to create fresh scenes with the correct values. 