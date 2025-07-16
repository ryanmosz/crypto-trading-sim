# Phase 2: Core Mechanics Implementation Guide

## Overview
**Duration**: 1 day (4-6 hours)  
**Goal**: Complete portfolio allocation system with 100-point distribution

## Prerequisites
- [x] Phase 1 complete (4 screens with navigation)
- [x] Unity project building to WebGL
- [x] SceneManager system working

## Milestone 2: Allocation Mechanics (4 hours)

### Step 1: Create Crypto Data Structure (30 min)

Create `Assets/Scripts/Data/CryptoData.cs`:

```csharp
[System.Serializable]
public class CryptoData
{
    public string symbol;
    public string name;
    public float allocation;
    public string colorHex;
    
    public CryptoData(string symbol, string name, string colorHex)
    {
        this.symbol = symbol;
        this.name = name;
        this.colorHex = colorHex;
        this.allocation = 0f;
    }
}

public static class CryptoConfig
{
    public static readonly CryptoData[] Cryptos = new CryptoData[]
    {
        new CryptoData("BTC", "Bitcoin", "#F7931A"),
        new CryptoData("ETH", "Ethereum", "#627EEA"),
        new CryptoData("BNB", "Binance Coin", "#F3BA2F"),
        new CryptoData("SOL", "Solana", "#14F195"),
        new CryptoData("XRP", "Ripple", "#23292F")
    };
}
```

### Step 2: Create Crypto Card Prefab (45 min)

1. In Allocation scene, create UI structure:
   ```
   Canvas
   └── AllocationPanel (Vertical Layout Group)
       └── CryptoCard (Prefab)
           ├── Background (Image)
           ├── CryptoInfo (Horizontal Layout)
           │   ├── Symbol (Text)
           │   └── Name (Text)
           ├── Slider (Slider)
           └── ValueText (Text "0%")
   ```

2. CryptoCard settings:
   - Size: 800x120
   - Background: Dark grey with colored left border
   - Slider: Min=0, Max=100, Whole Numbers=true

3. Save as prefab in Assets/Prefabs/

### Step 3: Allocation Manager (1 hour)

Create `Assets/Scripts/Managers/AllocationManager.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

public class AllocationManager : MonoBehaviour
{
    [Header("UI References")]
    public Transform cryptoContainer;
    public GameObject cryptoCardPrefab;
    public TextMeshProUGUI totalText;
    public Button lockButton;
    public TextMeshProUGUI lockButtonText;
    
    private List<CryptoCard> cryptoCards = new List<CryptoCard>();
    private float totalAllocation = 0f;
    
    void Start()
    {
        CreateCryptoCards();
        UpdateTotal();
    }
    
    void CreateCryptoCards()
    {
        foreach (var crypto in CryptoConfig.Cryptos)
        {
            GameObject cardObj = Instantiate(cryptoCardPrefab, cryptoContainer);
            CryptoCard card = cardObj.GetComponent<CryptoCard>();
            card.Initialize(crypto, OnAllocationChanged);
            cryptoCards.Add(card);
        }
    }
    
    void OnAllocationChanged()
    {
        UpdateTotal();
    }
    
    void UpdateTotal()
    {
        totalAllocation = 0f;
        foreach (var card in cryptoCards)
        {
            totalAllocation += card.GetAllocation();
        }
        
        totalText.text = $"Total: {totalAllocation}/100";
        
        // Enable lock button only when total is exactly 100
        bool canLock = Mathf.Approximately(totalAllocation, 100f);
        lockButton.interactable = canLock;
        
        // Visual feedback
        totalText.color = canLock ? Color.green : Color.red;
        lockButtonText.text = canLock ? "LOCK PORTFOLIO" : $"ALLOCATE {100-totalAllocation} MORE";
    }
    
    public void OnLockPortfolio()
    {
        // Save allocations
        SaveAllocations();
        
        // Navigate to dashboard
        GameSceneManager.LoadDashboard();
    }
    
    void SaveAllocations()
    {
        for (int i = 0; i < cryptoCards.Count; i++)
        {
            PlayerPrefs.SetFloat($"Allocation_{CryptoConfig.Cryptos[i].symbol}", 
                               cryptoCards[i].GetAllocation());
        }
        PlayerPrefs.Save();
    }
}
```

### Step 4: Crypto Card Component (45 min)

Create `Assets/Scripts/UI/CryptoCard.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class CryptoCard : MonoBehaviour
{
    [Header("UI Elements")]
    public Image background;
    public Image accentBar;
    public TextMeshProUGUI symbolText;
    public TextMeshProUGUI nameText;
    public Slider allocationSlider;
    public TextMeshProUGUI valueText;
    
    private CryptoData cryptoData;
    private System.Action onValueChanged;
    
    public void Initialize(CryptoData data, System.Action onChange)
    {
        cryptoData = data;
        onValueChanged = onChange;
        
        // Set UI
        symbolText.text = data.symbol;
        nameText.text = data.name;
        
        // Set color
        Color accentColor;
        ColorUtility.TryParseHtmlString(data.colorHex, out accentColor);
        accentBar.color = accentColor;
        
        // Setup slider
        allocationSlider.value = 0;
        allocationSlider.onValueChanged.AddListener(OnSliderChanged);
        
        UpdateDisplay();
    }
    
    void OnSliderChanged(float value)
    {
        cryptoData.allocation = value;
        UpdateDisplay();
        onValueChanged?.Invoke();
    }
    
    void UpdateDisplay()
    {
        valueText.text = $"{cryptoData.allocation:0}%";
        
        // Visual feedback
        float alpha = cryptoData.allocation > 0 ? 0.3f : 0.1f;
        background.color = new Color(1, 1, 1, alpha);
    }
    
    public float GetAllocation()
    {
        return cryptoData.allocation;
    }
}
```

### Step 5: UI Layout & Polish (45 min)

1. **Allocation Scene Layout**:
   ```
   Canvas
   ├── Header
   │   └── Title ("ALLOCATE YOUR PORTFOLIO")
   ├── InstructionText ("Distribute 100 points across cryptocurrencies")
   ├── ScrollView
   │   └── Content (Vertical Layout Group)
   │       └── [Crypto Cards instantiated here]
   ├── TotalPanel
   │   └── TotalText ("Total: 0/100")
   └── LockButton ("ALLOCATE 100 MORE")
   ```

2. **Visual Polish**:
   - Add spacing between cards (Layout Group spacing: 10)
   - Smooth slider animations
   - Hover effects on cards
   - Pulsing effect on lock button when ready

3. **Constraints System**:
   - Optional: Implement slider constraints so total can't exceed 100
   - Show warning when trying to allocate more than available

### Step 6: Test & Refine (30 min)

1. Test allocation combinations
2. Verify data persists to Dashboard scene
3. Test edge cases (0 allocation, exactly 100, over 100)
4. Add sound effects for slider changes (optional)

### Milestone 2 Complete! ✅
```bash
git add -A
git commit -m "feat: Complete allocation system with 100-point distribution"
git tag v0.3
```

---

## Testing Checklist

### Functionality
- [ ] All 5 crypto cards display correctly
- [ ] Sliders update values in real-time
- [ ] Total updates automatically
- [ ] Lock button only enabled at exactly 100
- [ ] Allocations save to PlayerPrefs
- [ ] Navigation to Dashboard works

### Visual
- [ ] Consistent styling with Phase 1
- [ ] Clear visual feedback for valid/invalid states
- [ ] Smooth animations
- [ ] Responsive layout

### Edge Cases
- [ ] Can't proceed without 100 total
- [ ] Can reset allocations
- [ ] Data persists between scenes
- [ ] Works after scene reload

## Data Verification

Test saved data in Dashboard scene:
```csharp
void Start()
{
    foreach (var crypto in CryptoConfig.Cryptos)
    {
        float allocation = PlayerPrefs.GetFloat($"Allocation_{crypto.symbol}", 0);
        Debug.Log($"{crypto.symbol}: {allocation}%");
    }
}
```

## Next Phase

Ready for Phase 3? Open [phase3-data.md](phase3-data.md) to build the live dashboard with price tracking. 