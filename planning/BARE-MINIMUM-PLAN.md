# 🚀 BARE MINIMUM PLAN - Ship in 2 Hours

## Goal: Get ANYTHING on screen ASAP

After reviewing the full plan, here's what we can CUT to ship immediately:

### ❌ What We're CUTTING (for now)
- ~~4 screens~~ → Just 1 screen
- ~~Navigation system~~ → No navigation needed
- ~~Allocation system~~ → Skip it
- ~~Dashboard~~ → Not needed
- ~~Live prices~~ → Nope
- ~~API integration~~ → Definitely not
- ~~Backend/Multiplayer~~ → Way too much
- ~~Polish~~ → Ship ugly, fix later

### ✅ What We're KEEPING (bare minimum)
1. Unity project that builds to WebGL
2. Login screen with 2 pre-baked test users
3. Main screen that shows which user is logged in
4. Basic user switching for demo purposes

## The 2-Hour Plan

### Hour 1: Unity Setup (60 min)
```bash
# 1. Install Unity Hub
brew install --cask unity-hub

# 2. Install Unity 2022.3 LTS with WebGL
# 3. Create new 2D project
# 4. Switch to WebGL platform
```

### Hour 2: Build Login + Main Screen (60 min)

#### Scene 1: Login Screen (20 min)
1. **Create Canvas** (5 min)
   - GameObject → UI → Canvas
   - Black background
   - Add Title: "CRYPTO TRADING SIM"

2. **Add Test User Buttons** (15 min)
   ```
   TestUser 1: "Alice ($10M → $12M)"
   TestUser 2: "Bob ($10M → $8M)"
   ```
   - Two big buttons
   - OnClick → Load Main Scene with user data

#### Scene 2: Main Screen (20 min)
1. **Show Current User** (10 min)
   - "Welcome, [Username]!"
   - "Portfolio Value: $[Amount]"

2. **Add Logout Button** (10 min)
   - Returns to login screen
   - Can switch users easily

#### Simple User Manager (10 min)
```csharp
public static class UserManager
{
    public static string CurrentUser;
    public static float StartingValue = 10000000; // Both start with $10M
    public static float CurrentValue;
    
    public static void LoginAsAlice()
    {
        CurrentUser = "Alice";
        CurrentValue = 12000000; // +20% from smart BTC/ETH focus
        SceneManager.LoadScene("Main");
    }
    
    public static void LoginAsBob()
    {
        CurrentUser = "Bob";
        CurrentValue = 8000000; // -20% from risky XRP bet
        SceneManager.LoadScene("Main");
    }
}
```

3. **Build & Deploy** (10 min)
   - Add both scenes to Build Settings
   - Build to WebGL
   - Test user switching
   - Ship it! 🎉

## That's It!

### What You Get
- ✅ Working Unity WebGL game
- ✅ Login screen with 2 test users
- ✅ User switching for demos
- ✅ Basic state management
- ✅ Foundation for everything else

### Why Test Users are Perfect for MVP
- **No backend needed** - Everything hardcoded
- **Easy demos** - Switch between Alice and Bob instantly
- **Different states** - Show different portfolio values
- **Real enough** - Feels like a real app
- **Fast to build** - Just buttons and text

### What's Next (LATER)
Once this works, THEN add:
- Real authentication (Phase 4)
- Allocation system (Phase 2)
- Dashboard with live data (Phase 3)
- Actual portfolio differences
- Everything else...

## Why This Works

1. **Proves the pipeline**: Unity → WebGL → Browser
2. **Something to show**: Not just plans
3. **Momentum**: Ship first, improve later
4. **Foundation**: Everything builds on this

## Literally Just Do This

```
1. Install Unity Hub
2. Create project
3. Add text and button
4. Build to WebGL
5. Open in browser
6. Screenshot it
7. Commit it
8. You shipped! 🚀
```

Everything else can wait. Ship THIS first. 