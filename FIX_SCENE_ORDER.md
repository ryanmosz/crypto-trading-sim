# 🔧 Fix: Login Scene Not Loading

## The Problem
Your WebGL build is jumping straight to the Main scene (showing "Welcome!" with $0M) instead of starting at the Login scene with Alice/Bob buttons.

## Why This Happened
The Build Settings only included the Main scene, not the Login scene. Unity starts with whatever scene is at index 0.

## Quick Fix (2 minutes)

### Option A: Use the Fix Script
1. In Unity, wait for scripts to compile
2. **Tools → Fix Scene Build Order**
3. **File → Build Settings → Build**
4. Choose the same `02` folder (overwrite)
5. Refresh browser when done

### Option B: Manual Fix
1. **File → Build Settings**
2. You'll see only "Main" in the scene list
3. **File → Open Scene** → Navigate to `Assets/Scenes/Login.unity`
4. Back in Build Settings: Click **Add Open Scenes**
5. **IMPORTANT**: Drag **Login** above **Main** so:
   - ✅ Scenes/Login (0)
   - ✅ Scenes/Main (1)
6. Click **Build**

## After Rebuilding
1. Refresh browser (Cmd/Ctrl + R)
2. You should now see:
   - "CRYPTO TRADING SIM" title
   - Alice button (cyan glow)
   - Bob button (magenta glow)

## Test Flow
1. Click **Alice** → Should show "Welcome, Alice! Portfolio: $12.0M"
2. Click **Logout** → Back to login
3. Click **Bob** → Should show "Welcome, Bob! Portfolio: $8.0M"

---

**Current issue**: Build is starting at Main scene with no user logged in.  
**Solution**: Ensure Login scene is first in Build Settings! 