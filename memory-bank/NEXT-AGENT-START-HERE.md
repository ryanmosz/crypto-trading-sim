# 🚀 NEXT AGENT: START HERE

## Your Mission
Build the bare minimum crypto trading simulator - starting with a login screen with two test users.

## Current Status
- ✅ All planning complete
- ✅ Project structure created
- ✅ Memory bank initialized
- ⏳ Unity not yet installed
- ⏳ No code written yet

## First Task: 2-Hour Bare Minimum Build

### What to Build
1. **Login Screen**
   - Black background
   - Title: "CRYPTO TRADING SIM"
   - Two buttons:
     - "Alice ($10M → $12M)" in cyan
     - "Bob ($10M → $8M)" in magenta

2. **Main Screen**
   - Shows "Welcome, [Username]!"
   - Shows "Portfolio: $[Amount]"
   - Logout button to return to login

### Key Implementation Details
```csharp
// Both users start with $10M
public static float StartingValue = 10000000f;

// Alice made smart choices (BTC/ETH focus)
CurrentValue = 12000000f; // +20%

// Bob made poor choices (XRP heavy)
CurrentValue = 8000000f; // -20%
```

## Step-by-Step Guide
1. **Read**: `/planning/BARE-MINIMUM-PLAN.md`
2. **Install**: Unity Hub via Homebrew
3. **Create**: New 2D Unity project
4. **Build**: Login screen with test users
5. **Test**: WebGL build in browser
6. **Commit**: "feat: MVP login with test users"

## Why Test Users?
- Both start with $10M - fair comparison
- Shows how different choices → different outcomes
- No backend needed - perfect for MVP
- Easy to demo by switching users

## Resources
- **Bare Minimum Plan**: `/planning/BARE-MINIMUM-PLAN.md`
- **Phase 1 Details**: `/planning/phase1-foundation.md`
- **Master Plan**: `/planning/PHASES.md`

## Success Criteria
✅ Unity project created
✅ Login screen with 2 test user buttons
✅ Main screen showing user info
✅ Can switch between users
✅ Builds to WebGL
✅ Runs in browser

---

**Remember**: Ship ugly but functional. Polish comes later. The goal is to have SOMETHING running in 2 hours that demonstrates the core concept - how investment choices affect outcomes. 