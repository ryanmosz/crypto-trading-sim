# Quick Start Guide - Unity Crypto Sim with Real Data

## Day 1: Get It Running Fast! 🚀

### Step 1: Unity Project Setup (30 mins)
```bash
# 1. Install Unity Hub
# 2. Install latest Unity LTS (check what's current in July 2025)
#    - Likely Unity 2023.3 LTS or 2024.3 LTS
#    - Choose version with "LTS" label and active support
# 3. Create new project: "CryptoTradingSim"
# 4. Template: 2D (simpler for UI)
# 5. Enable WebGL build support
```

### Step 2: Quick CoinGecko Integration (30 mins)

Create `Assets/Scripts/PriceManager.cs`:

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;

public class PriceManager : MonoBehaviour
{
    // Free CoinGecko API - no key needed!
    private const string API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd";
    
    public Dictionary<string, float> currentPrices = new Dictionary<string, float>();
    
    void Start()
    {
        StartCoroutine(FetchPrices());
        InvokeRepeating(nameof(UpdatePrices), 30f, 30f); // Update every 30 seconds
    }
    
    IEnumerator FetchPrices()
    {
        using (UnityWebRequest request = UnityWebRequest.Get(API_URL))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Parse JSON manually for quick start
                string json = request.downloadHandler.text;
                ParsePrices(json);
                Debug.Log($"Prices updated! BTC: ${currentPrices["BTC"]:F2}");
            }
            else
            {
                Debug.LogError("Failed to fetch prices, using mock data");
                UseMockPrices();
            }
        }
    }
    
    void ParsePrices(string json)
    {
        // Quick and dirty parsing
        currentPrices["BTC"] = ExtractPrice(json, "bitcoin");
        currentPrices["ETH"] = ExtractPrice(json, "ethereum");
        currentPrices["BNB"] = ExtractPrice(json, "binancecoin");
        currentPrices["SOL"] = ExtractPrice(json, "solana");
        currentPrices["XRP"] = ExtractPrice(json, "ripple");
    }
    
    float ExtractPrice(string json, string coinId)
    {
        int start = json.IndexOf($"\"{coinId}\":{{\"usd\":") + coinId.Length + 9;
        int end = json.IndexOf("}", start);
        string priceStr = json.Substring(start, end - start);
        return float.Parse(priceStr);
    }
    
    void UseMockPrices()
    {
        currentPrices["BTC"] = 43567f;
        currentPrices["ETH"] = 2234f;
        currentPrices["BNB"] = 312f;
        currentPrices["SOL"] = 98f;
        currentPrices["XRP"] = 0.54f;
    }
}
```

### Step 3: Neon UI Setup (1 hour)

Create `Assets/Scripts/NeonUIManager.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;

public class NeonUIManager : MonoBehaviour
{
    [Header("Neon Colors")]
    public Color neonCyan = new Color(0, 1, 1, 1);
    public Color neonMagenta = new Color(1, 0, 1, 1);
    public Color neonYellow = new Color(1, 1, 0, 1);
    public Color darkBg = new Color(0.05f, 0.05f, 0.1f, 1);
    
    [Header("UI References")]
    public Image backgroundPanel;
    public Text titleText;
    public Button lockInButton;
    
    void Start()
    {
        SetupNeonStyle();
    }
    
    void SetupNeonStyle()
    {
        // Dark background
        backgroundPanel.color = darkBg;
        
        // Glowing title
        titleText.color = neonCyan;
        titleText.gameObject.AddComponent<GlowEffect>();
        
        // Animated button
        lockInButton.image.color = neonMagenta;
        lockInButton.onClick.AddListener(() => {
            // Add particle burst on click
            SpawnParticles(lockInButton.transform.position);
        });
    }
    
    void SpawnParticles(Vector3 position)
    {
        // Quick particle effect
        GameObject particles = new GameObject("ClickParticles");
        ParticleSystem ps = particles.AddComponent<ParticleSystem>();
        var main = ps.main;
        main.startLifetime = 0.5f;
        main.startSpeed = 5;
        main.startSize = 0.3f;
        main.startColor = neonMagenta;
        
        var emission = ps.emission;
        emission.SetBursts(new ParticleSystem.Burst[] {
            new ParticleSystem.Burst(0.0f, 30)
        });
        
        Destroy(particles, 1f);
    }
}
```

### Step 4: Basic Allocation Screen (1 hour)

Scene Setup:
```
Main Camera
Canvas
├── Background (Image - Dark)
├── Title (Text - "CRYPTO TRADER")
├── AllocationPanel
│   ├── BTCRow
│   │   ├── Icon
│   │   ├── Name (Text)
│   │   ├── Slider
│   │   └── Value (Text)
│   ├── ETHRow (same structure)
│   ├── BNBRow (same structure)
│   ├── SOLRow (same structure)
│   └── XRPRow (same structure)
├── TotalPoints (Text - "Points: 0/100")
└── LockInButton (Button - "LOCK IN")
```

### Step 5: Quick Allocation Logic

```csharp
public class AllocationManager : MonoBehaviour
{
    public Slider[] cryptoSliders;
    public Text totalPointsText;
    public Button lockInButton;
    
    private int totalPoints = 0;
    private Dictionary<string, int> allocations = new Dictionary<string, int>();
    
    void Start()
    {
        foreach (var slider in cryptoSliders)
        {
            slider.onValueChanged.AddListener(OnSliderChanged);
        }
    }
    
    void OnSliderChanged(float value)
    {
        CalculateTotalPoints();
        UpdateUI();
    }
    
    void CalculateTotalPoints()
    {
        totalPoints = 0;
        foreach (var slider in cryptoSliders)
        {
            totalPoints += Mathf.RoundToInt(slider.value);
        }
        
        // Enable lock button only at 100 points
        lockInButton.interactable = (totalPoints == 100);
    }
    
    void UpdateUI()
    {
        totalPointsText.text = $"Points: {totalPoints}/100";
        totalPointsText.color = totalPoints == 100 ? Color.green : Color.white;
    }
}
```

## Day 1 Goals Checklist

- [ ] Unity project created with current LTS version
- [ ] Real prices displaying from CoinGecko
- [ ] Neon-styled UI elements
- [ ] Working allocation sliders
- [ ] 100-point validation
- [ ] Lock-in button with effects

## Quick Testing

1. **In Unity Editor**: Hit Play, check if prices load
2. **WebGL Build**: File → Build Settings → WebGL → Build
3. **Local Test**: Python simple server in build folder:
   ```bash
   python3 -m http.server 8000
   ```
4. **Open**: http://localhost:8000

## Common Issues & Fixes

### CORS Error with API?
Add to CoinGecko URL: `&origin=*` or use proxy:
```
https://api.allorigins.win/raw?url=YOUR_API_URL
```

### Particles Not Showing?
- Check Render Mode on Canvas (Screen Space - Overlay)
- Increase particle Start Size
- Check Z position

### Sliders Not Working?
- Ensure EventSystem exists in scene
- Check Slider min=0, max=100, whole numbers=true

## Unity Version Note (July 2025)

Since Unity 2022.3 LTS is no longer supported, make sure to:
1. Open Unity Hub
2. Look for the latest LTS version (likely 2023.3 LTS or 2024.3 LTS)
3. Choose the one marked "LTS" with the longest support remaining
4. The code in this guide works with any recent Unity version

## Next: Performance Screen (Day 2)

Once allocation works:
1. Save allocations to PlayerPrefs
2. Switch to performance scene
3. Calculate portfolio values
4. Show ranking

You now have real crypto prices in a neon-styled Unity game! 🎮✨ 