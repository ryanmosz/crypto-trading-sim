# Crypto Trader Simulator - Tutorial Steps Documentation

This file lists all tutorial steps (Tour of App) with their current positions and text. Use this to review and adjust positioning.

## Overview
The tutorial uses a spotlight overlay system that highlights UI elements and shows explanatory text. Each step has:
- **Scene**: Which game scene it appears in
- **Position**: X, Y coordinates and width/height of the spotlight
- **Text**: The message shown to the user
- **Text Position**: Where the text box appears (top, bottom, center)

## Tutorial Steps

### Step 1: Welcome Message
- **Scene**: DashboardScene
- **Element**: None (no spotlight)
- **Position**: x: 450, y: 250, w: 700, h: 60
- **Text**: "Welcome to Crypto Trader Simulator! Let's take a quick tour of what you can do here."
- **Text Position**: center
- **Notes**: No spotlight effect, just the text box

### Step 2: New Game Tab
- **Scene**: DashboardScene  
- **Element**: NEW GAME tab
- **Position**: x: 230, y: 150, w: 200, h: 50
- **Text**: "NEW GAME: Start trading through historical crypto events. Test your strategies against real market data!"
- **Text Position**: bottom
- **Notes**: Highlights the NEW GAME tab

### Step 3: Active Games Tab
- **Scene**: DashboardScene
- **Element**: ACTIVE tab
- **Position**: x: 450, y: 150, w: 200, h: 50
- **Text**: "ACTIVE GAMES: Ongoing multiplayer investment challenges with data powered by CoinGecko.com. Challenge your friends! Or enemies!"
- **Text Position**: bottom
- **Notes**: Highlights the ACTIVE tab

### Step 4: Leaderboard Button
- **Scene**: DashboardScene
- **Element**: VIEW LEADERBOARD button
- **Position**: x: 450, y: 530, w: 250, h: 50
- **Text**: "Check the LEADERBOARD to see top traders and compete with others!"
- **Text Position**: top
- **Notes**: Highlights the leaderboard button

### Step 5: Start New Game
- **Scene**: DashboardScene
- **Element**: START NEW GAME button
- **Position**: x: 450, y: 360, w: 400, h: 80
- **Text**: "Ready to start? Click 'START NEW GAME' to begin your trading journey!"
- **Text Position**: top
- **Notes**: Final call to action

### Step 6: Choose Scenario
- **Scene**: ScenarioSelectScene
- **Element**: First scenario card
- **Position**: x: 225, y: 250, w: 200, h: 280
- **Text**: "Choose a historical event to trade through. Each scenario presents different market conditions!"
- **Text Position**: top

### Step 7: Make Allocations
- **Scene**: AllocationScene
- **Element**: Allocation sliders area
- **Position**: x: 450, y: 150, w: 600, h: 60
- **Text**: "Drag the sliders to allocate your $10,000 across different cryptocurrencies. Your goal is to maximize returns!"
- **Text Position**: bottom
- **Notes**: Positioned high on screen to avoid blocking UI

### Step 8: View Results
- **Scene**: ResultsScene
- **Element**: Results breakdown area
- **Position**: x: 450, y: 280, w: 400, h: 200
- **Text**: "See how each investment performed. Your games are automatically saved!"

### Step 9: Past Games
- **Scene**: DashboardScene
- **Element**: Game history area
- **Position**: x: 450, y: 350, w: 800, h: 200
- **Text**: "Your completed games appear here. Try 'NOW MODE' for real-time trading challenges!"
- **Text Position**: top

### Step 10: Now Mode
- **Scene**: DashboardScene
- **Element**: NOW mode section
- **Position**: x: 110, y: 260, w: 180, h: 120
- **Text**: "NOW MODE lets you invest at current prices and track performance over 30-90 days. Perfect for multiplayer competitions!"

### Step 11: Leaderboard View
- **Scene**: DashboardScene
- **Element**: Leaderboard area
- **Position**: x: 740, y: 40, w: 120, h: 40
- **Text**: "Check the LEADERBOARD to see top traders and learn from their strategies!"

## Position Guidelines

### X-axis (horizontal)
- **450**: Center of the 900px wide game
- **230**: Left tab position
- **670**: Right tab position
- **150**: Far left
- **750**: Far right

### Y-axis (vertical)
- **40**: Header area
- **90**: Welcome message
- **150**: Tab buttons
- **280-300**: Main content area starts
- **360**: START NEW GAME button
- **510-530**: Bottom buttons (leaderboard)
- **550**: Sign out button

### Common Issues & Solutions
1. **Text overlapping UI**: Adjust Y position or change text position (top/bottom)
2. **Spotlight too small**: Increase width/height values
3. **Text box off-screen**: Use 'center' position or adjust X coordinate

## Testing Checklist
- [ ] Welcome message appears in empty space
- [ ] Tab highlights don't overlap with tab text
- [ ] Button highlights include full button area
- [ ] Text boxes don't cover important UI elements
- [ ] All steps flow logically
- [ ] Skip and Next buttons are always accessible