# Unity Button Positioning Guide

## Alice Button (Cyan - Left Side)
- **GameObject Name**: AliceButton
- **Position**: X: -250, Y: 0, Z: 0
- **Width**: 400
- **Height**: 150
- **Text**: 
  ```
  Alice
  $10M → $12M (+20%)
  ```
- **Text Color**: Cyan (R:0, G:255, B:255)
- **Font Size**: 24

## Bob Button (Magenta - Right Side)
- **GameObject Name**: BobButton
- **Position**: X: 250, Y: 0, Z: 0
- **Width**: 400
- **Height**: 150
- **Text**:
  ```
  Bob
  $10M → $8M (-20%)
  ```
- **Text Color**: Magenta (R:255, G:0, B:255)
- **Font Size**: 24

## Visual Layout
```
        CRYPTO TRADING SIM
              (Title)

    [Alice Button]    [Bob Button]
       (Cyan)          (Magenta)
    X: -250, Y: 0     X: 250, Y: 0
```

## Making Buttons Look Good
1. Select button → Image component
2. Set Color to slightly transparent black: (R:0, G:0, B:0, A:50)
3. This creates a subtle background for the button 