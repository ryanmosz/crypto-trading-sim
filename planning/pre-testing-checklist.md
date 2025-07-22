# Pre-Testing Checklist

Based on O3's second opinion review, here are the tasks to complete before starting comprehensive testing:

## ✅ Critical Tasks (Must Do)

### 1. Verify RLS Policies
- [ ] Run `test-rls-verification.html` to verify:
  - Anonymous users can view multiplayer games
  - Authenticated users see their own + multiplayer games
  - Game participants are publicly readable
  - Find by game code works for all users
- [ ] Fix any RLS policy issues found

### 2. Monitor API Usage
- [ ] Check current CoinGecko API usage in dashboard
- [ ] Verify we're staying under daily limits (10-25k calls)
- [ ] Confirm we're only fetching 5 cryptos (BTC, ETH, BNB, SOL, XRP)

## 📝 Nice to Have (Can Do During Testing)

### 3. Quick Code Cleanup
- [ ] Run ESLint on all scene files
- [ ] Fix any linting errors found
- [ ] Verify all scenes are under 500 LOC (they should be)

### 4. Document Test Results
- [ ] Use `MULTIPLAYER_TESTING_PLAN.md` as guide
- [ ] Document any issues found
- [ ] Track API usage during testing

## 🚀 Future Improvements (Post-MVP)

These are O3's valid suggestions for v2.0:
- Add automated Edge Function tests (Jest/Mocha)
- Implement caching layer for API calls
- Add pagination for games >100 players
- Consider WebSocket for real-time updates
- Build admin tools for game management

## Testing Instructions

Once the critical tasks are complete:

1. Open `test-rls-verification.html` in browser
2. Run all 4 tests and verify they pass
3. If all pass, proceed with comprehensive multiplayer testing
4. Use `test-multiplayer-comprehensive.html` for full flow testing

**Remember**: The multiplayer implementation is complete and ready. We're just verifying security policies before testing! 