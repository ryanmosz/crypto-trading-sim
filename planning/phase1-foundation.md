# Phase 1: Foundation Implementation Guide

## Overview
**Duration**: 1 day (4-6 hours)  
**Goal**: Unity project with all 4 screens and working navigation

## Prerequisites
- [ ] Unity Hub installed
- [ ] Unity 2022.3 LTS with WebGL support
- [ ] VS Code or preferred IDE
- [ ] Git initialized

## Milestone 0: Login Screen with Test Users (2 hours)

### Step 1: Create Unity Project (30 min)
```bash
# Create project folder
mkdir -p crypto-trading-sim
cd crypto-trading-sim

# Initialize Git
git init
echo "# Crypto Trading Sim" > README.md
git add . && git commit -m "Initial commit"
```

In Unity Hub:
1. New Project → 2D Core template
2. Project name: CryptoTradingSim
3. Location: your crypto-trading-sim folder
4. Create project

### Step 2: Configure for WebGL (15 min)
1. File → Build Settings
2. Select WebGL platform → Switch Platform
3. Player Settings:
   - Company Name: YourName
   - Product Name: Crypto Trading Sim
   - WebGL Memory Size: 256MB

### Step 3: Create Login Screen (45 min)

#### Canvas Setup
1. GameObject → UI → Canvas
2. Canvas Scaler component:
   - UI Scale Mode: Scale With Screen Size
   - Reference Resolution: 1920x1080
   - Screen Match Mode: 0.5

#### Background & Title
1. Add black background image
2. Add title: "CRYPTO TRADING SIM"
3. Add subtitle: "Choose Test User"

#### Test User Buttons
1. **Alice Button**:
   - Text: "Alice\n$10M → $12M (+20%)"
   - Size: 400x150
   - Position: Left side
   - Color: Cyan (#00FFFF)

2. **Bob Button**:
   - Text: "Bob\n$10M → $8M (-20%)"
   - Size: 400x150
   - Position: Right side
   - Color: Magenta (#FF00FF)

#### User Manager Script
Create `Assets/Scripts/UserManager.cs`:
```csharp
using UnityEngine;
using UnityEngine.SceneManagement;

public static class UserManager
{
    public static string CurrentUser { get; set; }
    public static float PortfolioValue { get; set; }
}

public class LoginManager : MonoBehaviour
{
    public void LoginAsAlice()
    {
        UserManager.CurrentUser = "Alice";
        UserManager.StartingValue = 10000000f; // Started with $10M
        UserManager.CurrentValue = 12000000f;  // Now has $12M (+20%)
        SceneManager.LoadScene("Main");
    }
    
    public void LoginAsBob()
    {
        UserManager.CurrentUser = "Bob";
        UserManager.StartingValue = 10000000f; // Started with $10M
        UserManager.CurrentValue = 8000000f;   // Now has $8M (-20%)
        SceneManager.LoadScene("Main");
    }
}
```

### Step 4: First Build (30 min)
1. Save scene as "Login" in Assets/Scenes/
2. Create basic "Main" scene with welcome text
3. File → Build Settings → Add both scenes (Login first)
4. Build And Run
5. Test switching between Alice and Bob

### Milestone 0 Complete! ✅
You now have:
- Login screen with 2 test users
- Basic user state management
- Scene navigation working
- Different portfolio values for demos

Commit your work:
```bash
git add -A
git commit -m "feat: Login screen with test users Alice and Bob"
git tag v0.1
```

---

## Milestone 1: Screen Navigation (2 hours)

### Step 1: Create Remaining Scenes (30 min)

Create 3 more scenes:
1. File → New Scene → Save as "Allocation"
2. File → New Scene → Save as "Dashboard"  
3. File → New Scene → Save as "Results"

For each scene:
- Add Canvas with same settings
- Add background (black)
- Add title text (scene name)
- Add placeholder content

### Step 2: Scene Manager System (45 min)

Create `Assets/Scripts/Managers/SceneManager.cs`:

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameSceneManager : MonoBehaviour
{
    private static GameSceneManager instance;
    
    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public static void LoadScene(string sceneName)
    {
        SceneManager.LoadScene(sceneName);
    }
    
    public static void LoadAllocation()
    {
        LoadScene("Allocation");
    }
    
    public static void LoadDashboard()
    {
        LoadScene("Dashboard");
    }
    
    public static void LoadResults()
    {
        LoadScene("Results");
    }
    
    public static void LoadWelcome()
    {
        LoadScene("Welcome");
    }
}
```

### Step 3: Wire Navigation (30 min)

Welcome Screen:
1. Select Start Button
2. Add OnClick event
3. Create empty GameObject "SceneManager"
4. Add GameSceneManager script
5. Wire button to `GameSceneManager.LoadAllocation`

Allocation Screen:
1. Add "Lock Portfolio" button
2. Wire to `GameSceneManager.LoadDashboard`

Dashboard Screen:
1. Add temporary "End Game" button
2. Wire to `GameSceneManager.LoadResults`

Results Screen:
1. Add "Play Again" button
2. Wire to `GameSceneManager.LoadWelcome`

### Step 4: Polish & Test (15 min)

1. Add loading transition (fade or simple loading text)
2. Test full navigation flow
3. Build Settings → Add all scenes in order
4. Build and test in browser

### Milestone 1 Complete! ✅
```bash
git add -A
git commit -m "feat: Complete screen navigation with SceneManager"
git tag v0.2
```

---

## Checklist for Phase 1 Completion

### Technical Requirements
- [x] Unity project created with WebGL platform
- [x] 4 scenes created and styled
- [x] Scene navigation working
- [x] Consistent black/cyan/pink theme
- [x] Builds successfully to WebGL

### Visual Requirements  
- [x] Black background on all screens
- [x] Cyan (#00FFFF) as primary color
- [x] Clean, modern UI layout
- [x] TextMeshPro for all text

### Deliverables
- [x] Working WebGL build
- [x] Full navigation flow
- [x] Git repository with tagged versions
- [x] Ready for Phase 2 (allocation system)

## Common Issues & Solutions

**TextMeshPro not showing**: Window → TextMeshPro → Import TMP Essential Resources

**Scene not loading**: Ensure all scenes added to Build Settings

**WebGL build fails**: Check Player Settings → Publishing Settings → Compression Format

**Button not working**: Ensure EventSystem exists in scene (created automatically with Canvas)

## Next Phase

Ready for Phase 2? Open [phase2-mechanics.md](phase2-mechanics.md) to build the allocation system. 