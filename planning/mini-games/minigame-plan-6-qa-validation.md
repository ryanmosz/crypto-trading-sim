# Mini-Game Task 6.0 – QA & Integration Validation

## Manual Tests
- Two-browser invite → play → result visible on both.
- Latency simulation at 200 ms (Chrome dev-tools) keeps counters synced.
- Auth OFF (logout) → cannot join channel (expect 403).

## Automated
- **Jest** unit tests for `ButtonMashScene` timer & counter.
- **Cypress** e2e: full duel flow happy-path.

## Regression
- Run core Now-mode smoke tests to ensure leaderboard & price polling unaffected.

## Acceptance Criteria
- ≤ 150 ms visual desync between counters
- No unhandled console errors
- Core game KPIs unchanged (FPS, memory)


### Tooling Commands

| Tool | Purpose | Command |
| ---- | ------- | ------- |
| Jest unit tests | Timer & logic | `npx jest src/scenes/__tests__/ButtonMashScene.test.js` |
| Cypress e2e | Full two-player flow | `npx cypress run --spec cypress/e2e/button_mash_duel.cy.js` |
| Lighthouse | Perf budget check | `npx lhci autorun --collect.url=http://localhost:5173` |

### Performance Budgets

| Metric | Budget | Reason |
| ------ | ------ | ------ |
| WebSocket RTT | ≤150 ms | Visually smooth counter |
| First Scene Paint | ≤1.5 s on mid-range laptop | Keeps mini-game snappy |
| Heap growth | <5 MB during duel | Prevent memory leaks |

### Regression Script

Run after every merge to `main`:

```bash
pnpm i
pnpm build
node scripts/smoke-now-mode.js   # ensures core game unchanged
npx jest
npx cypress run
```