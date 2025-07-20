# UI Consistency Guide

## Button Hover Effects

### Standard Hover Behavior
All interactive elements in the game follow a consistent hover pattern established from the Simulation Speed page design:

1. **Border Change**
   - Default: 2px gray border (#666666)
   - Hover: 2px accent color border (cyan #00ffff or pink #ff1493)
   - Border thickness remains constant (no scaling)

2. **Text Change**
   - Primary text changes from white (#ffffff) to accent color on hover
   - Secondary/descriptive text stays gray (#666666 or #999999) and never changes

3. **Background**
   - Background color remains unchanged on hover
   - No fill effects or transparency changes

4. **No Scaling**
   - Elements maintain their size (no scale transforms on hover)

### Implementation Examples

#### Primary Buttons (Login, Scenario Select, Speed Select)
```javascript
button
    .on('pointerover', () => {
        button.setStrokeStyle(2, 0x00ffff);
        primaryText.setColor('#00ffff');
        // descriptiveText stays gray - no change
    })
    .on('pointerout', () => {
        button.setStrokeStyle(2, 0x666666);
        primaryText.setColor('#ffffff');
    })
```

#### Back Buttons
- Use cyan (#00ffff) for all back button hovers
- Both border and "BACK" text change to cyan

#### Special Buttons
- **Skip Button**: Text changes from gray to cyan
- **Play Again**: Border and text use cyan
- **Try Again**: Border and text use pink (to indicate retry/failure context)

### Color Palette
- **Primary Text**: #ffffff (white)
- **Secondary Text**: #666666 or #999999 (gray shades)
- **Cyan Accent**: #00ffff (success, forward progress, primary actions)
- **Pink Accent**: #ff1493 (retry, loss, secondary actions)
- **Backgrounds**: #000000 (black), #111111 (dark gray), #333333 (medium gray)

### Hierarchy Rules
1. **Main action text** (e.g., "Bob", "2013", "Regular Speed") → Changes color on hover
2. **Descriptive text** (e.g., "Risk Taker", "(24 hours)", "15 seconds total") → Stays gray always
3. **Border** → Always changes to match the main text color

This creates a clean, modern look where users can clearly see what's interactive while maintaining visual hierarchy between primary and secondary information. 