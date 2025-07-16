# Unity WebGL Implementation Plan

## Project Setup & Architecture

### Unity Project Structure
```
CryptoTradingSim/
├── Assets/
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── GameManager.cs
│   │   │   ├── Portfolio.cs
│   │   │   └── CryptoAsset.cs
│   │   ├── UI/
│   │   │   ├── AllocationScreen.cs
│   │   │   ├── PerformanceScreen.cs
│   │   │   └── UIManager.cs
│   │   ├── Networking/
│   │   │   ├── APIClient.cs
│   │   │   └── PriceUpdateManager.cs
│   │   └── Utils/
│   │       ├── NumberFormatter.cs
│   │       └── ColorManager.cs
│   ├── Prefabs/
│   │   ├── UI/
│   │   │   ├── CryptoAllocationRow.prefab
│   │   │   ├── PerformanceRow.prefab
│   │   │   └── RankingPanel.prefab
│   ├── Materials/
│   ├── Textures/
│   │   └── CryptoIcons/
│   └── Scenes/
│       └── Main.unity
```

## Development Phases

### Phase 1: Unity Foundation (Week 1)

#### Day 1-2: Project Setup
- [ ] Create new Unity project (2021.3 LTS)
- [ ] Configure WebGL build settings
- [ ] Import TextMeshPro
- [ ] Set up basic scene structure
- [ ] Create UI canvas with proper scaling

#### Day 3-4: Core Data Structures
```csharp
// GameData.cs
[System.Serializable]
public class CryptoData {
    public string symbol;
    public string name;
    public float currentPrice;
    public Sprite icon;
}

// Portfolio.cs
public class Portfolio : MonoBehaviour {
    private Dictionary<string, int> allocations = new Dictionary<string, int>();
    private float totalValue = 10000000f;
    
    public void SetAllocation(string symbol, int points) {
        allocations[symbol] = points;
    }
    
    public float CalculateValue(Dictionary<string, float> prices) {
        // Implementation
    }
}
```

#### Day 5-7: Allocation Screen UI
- [ ] Create allocation screen layout
- [ ] Implement point allocation system
- [ ] Add increment/decrement buttons
- [ ] Create visual progress bars
- [ ] Add validation logic (max 100 points)

### Phase 2: Backend Integration (Week 2)

#### Day 1-2: Mock Data System
```csharp
// MockPriceProvider.cs
public class MockPriceProvider : MonoBehaviour {
    private Dictionary<string, float> basePrices = new Dictionary<string, float>() {
        {"BTC", 43567f},
        {"ETH", 2234f},
        {"BNB", 312f},
        {"SOL", 98f},
        {"XRP", 0.54f}
    };
    
    public float GetPrice(string symbol) {
        // Add random fluctuation for testing
        float randomChange = Random.Range(-0.05f, 0.05f);
        return basePrices[symbol] * (1 + randomChange);
    }
}
```

#### Day 3-4: API Client
- [ ] Create API client for real price data
- [ ] Implement HTTP requests using UnityWebRequest
- [ ] Add JSON parsing for price data
- [ ] Create fallback to mock data

#### Day 5-7: Real-time Updates
- [ ] Implement coroutine for periodic updates
- [ ] Add WebSocket support (optional)
- [ ] Create smooth price animations
- [ ] Handle connection errors gracefully

### Phase 3: Performance Screen (Week 3)

#### Day 1-3: Performance UI
- [ ] Design performance dashboard layout
- [ ] Create portfolio value display
- [ ] Add individual asset performance rows
- [ ] Implement color-coded indicators

#### Day 4-5: Ranking System
```csharp
// RankingManager.cs
public class RankingManager : MonoBehaviour {
    public class PlayerRanking {
        public string playerId;
        public float returnPercentage;
        public int rank;
    }
    
    public PlayerRanking CalculateRanking(float playerReturn, List<float> allReturns) {
        // Sort and find position
        allReturns.Sort((a, b) => b.CompareTo(a));
        int rank = allReturns.IndexOf(playerReturn) + 1;
        float percentile = (float)(allReturns.Count - rank) / allReturns.Count * 100;
        
        return new PlayerRanking {
            returnPercentage = playerReturn,
            rank = rank
        };
    }
}
```

#### Day 6-7: Visual Polish
- [ ] Add animations using DOTween
- [ ] Implement particle effects for gains
- [ ] Create smooth transitions
- [ ] Add sound effects

### Phase 4: WebGL Optimization (Week 4)

#### Day 1-2: Performance Optimization
- [ ] Optimize texture compression
- [ ] Reduce draw calls
- [ ] Implement object pooling for UI elements
- [ ] Profile and fix performance bottlenecks

#### Day 3-4: Build Configuration
```json
// WebGL Build Settings
{
    "compressionFormat": "Gzip",
    "linkerTarget": "Wasm",
    "memorySize": 256,
    "exceptionSupport": "None",
    "webglTemplate": "Minimal"
}
```

#### Day 5-7: Testing & Deployment
- [ ] Test on multiple browsers
- [ ] Implement loading screen
- [ ] Add error handling
- [ ] Deploy to web server

## Technical Implementation Details

### Key Scripts Overview

#### 1. GameManager.cs
```csharp
public class GameManager : MonoBehaviour {
    public static GameManager Instance;
    
    public enum GameState {
        Allocation,
        Performance
    }
    
    private GameState currentState;
    private Portfolio playerPortfolio;
    
    void Awake() {
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
    
    public void LockInvestment() {
        currentState = GameState.Performance;
        UIManager.Instance.ShowPerformanceScreen();
        StartCoroutine(UpdatePortfolioValue());
    }
}
```

#### 2. AllocationRow.cs
```csharp
public class AllocationRow : MonoBehaviour {
    public TextMeshProUGUI cryptoName;
    public Slider allocationSlider;
    public TextMeshProUGUI pointsText;
    public Image progressBar;
    
    private string cryptoSymbol;
    
    public void Initialize(CryptoData data) {
        cryptoSymbol = data.symbol;
        cryptoName.text = $"{data.name} ({data.symbol})";
        allocationSlider.onValueChanged.AddListener(OnSliderChanged);
    }
    
    private void OnSliderChanged(float value) {
        int points = Mathf.RoundToInt(value);
        pointsText.text = $"{points} points";
        progressBar.fillAmount = value / 100f;
        
        AllocationManager.Instance.UpdateAllocation(cryptoSymbol, points);
    }
}
```

### Unity-Specific Considerations

1. **UI Anchoring**
   - Use proper anchor presets
   - Test on different aspect ratios
   - Implement safe area for future mobile

2. **WebGL Limitations**
   - No threading (use coroutines)
   - Limited local storage
   - CORS considerations for API calls

3. **Performance Tips**
   - Use object pooling for frequently updated UI
   - Batch UI updates
   - Minimize texture memory usage

## Immediate Next Steps

1. **Install Unity Hub** and Unity 2021.3 LTS
2. **Create new project** with WebGL template
3. **Set up version control** (Git with LFS for Unity)
4. **Begin Phase 1** implementation

## Testing Strategy

### Local Testing
- Unity Play Mode for rapid iteration
- WebGL builds served locally
- Mock data for offline development

### Browser Testing
- Chrome (primary)
- Firefox
- Safari
- Edge

### Performance Targets
- 60 FPS on modern browsers
- < 3 second initial load
- < 50MB build size 