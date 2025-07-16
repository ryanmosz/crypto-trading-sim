# Screen-by-Screen Build Guide

## Initial Setup

### 1. Create Color Palette ScriptableObject

Create `Assets/Scripts/ColorPalette.cs`:
```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "ColorPalette", menuName = "Game/Color Palette")]
public class ColorPalette : ScriptableObject
{
    [Header("Background")]
    public Color blackBg = new Color(0f, 0f, 0f, 1f);
    
    [Header("Primary Colors")]
    public Color cyan = new Color(0f, 1f, 1f, 1f);
    public Color lightCyan = new Color(0.69f, 1f, 1f, 1f);
    public Color white = new Color(1f, 1f, 1f, 1f);
    public Color lightPink = new Color(1f, 0.69f, 1f, 1f);
    public Color magenta = new Color(1f, 0f, 1f, 1f);
    
    [Header("Text Colors")]
    public Color textOnDark = new Color(1f, 1f, 1f, 1f);
    public Color textOnLight = new Color(0f, 0f, 0f, 1f);
    
    [Header("Gradients")]
    public Gradient cyanToPink;
    public Gradient magentaToPink;
    
    public static ColorPalette Instance { get; private set; }
    
    void OnEnable()
    {
        Instance = this;
    }
}
```

### 2. Create Gradient Shader

Save as `Assets/Shaders/UIGradient.shader`:
```shader
Shader "UI/Gradient"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Color1 ("Color 1", Color) = (0,1,1,1)
        _Color2 ("Color 2", Color) = (1,0,1,1)
        _Direction ("Direction", Range(0,1)) = 0
    }
    // Shader implementation...
}
```

## Screen 1: Welcome/Login Screen

### Step 1: Scene Setup
1. Create new scene: `WelcomeScene`
2. Add Canvas (Screen Space - Overlay)
3. Set Canvas Scaler to Scale with Screen Size (1920x1080)

### Step 2: Background
```csharp
// In Unity:
// 1. Right-click Canvas → UI → Image
// 2. Name it "Background"
// 3. Anchor: Stretch all directions
// 4. Color: Black (#000000)
```

### Step 3: Title Implementation
```csharp
public class GradientTitle : MonoBehaviour
{
    public TextMeshProUGUI titleText;
    public Material gradientMaterial;
    
    void Start()
    {
        titleText.text = "CRYPTO TRADER SIMULATOR";
        titleText.fontStyle = FontStyles.Bold;
        titleText.fontSize = 72;
        titleText.material = gradientMaterial;
        
        // Add glow effect
        titleText.fontMaterial.EnableKeyword("GLOW_ON");
        titleText.fontMaterial.SetColor("_GlowColor", ColorPalette.Instance.cyan);
        titleText.fontMaterial.SetFloat("_GlowPower", 0.5f);
    }
}
```

### Step 4: Username Input
```csharp
public class UsernameInput : MonoBehaviour
{
    public TMP_InputField usernameField;
    public Image inputBackground;
    public TextMeshProUGUI placeholderText;
    
    void Start()
    {
        // Style the input field
        inputBackground.color = ColorPalette.Instance.lightCyan;
        usernameField.textComponent.color = ColorPalette.Instance.textOnLight;
        placeholderText.text = "Enter display name (optional)";
        placeholderText.color = new Color(0, 0, 0, 0.5f);
        
        // Round corners
        inputBackground.gameObject.AddComponent<RoundedCorners>().radius = 10f;
    }
}
```

### Step 5: Enter Button
```csharp
public class EnterGameButton : MonoBehaviour
{
    public Button enterButton;
    public Image buttonImage;
    public TextMeshProUGUI buttonText;
    private Material glowMaterial;
    
    void Start()
    {
        // Apply gradient background
        buttonImage.material = new Material(Shader.Find("UI/Gradient"));
        buttonImage.material.SetColor("_Color1", ColorPalette.Instance.magenta);
        buttonImage.material.SetColor("_Color2", ColorPalette.Instance.lightPink);
        
        // Button text
        buttonText.text = "ENTER THE GAME";
        buttonText.color = ColorPalette.Instance.textOnDark;
        
        // Add hover effect
        AddHoverEffect();
        
        // Button click
        enterButton.onClick.AddListener(OnEnterGame);
    }
    
    void AddHoverEffect()
    {
        EventTrigger trigger = gameObject.AddComponent<EventTrigger>();
        
        EventTrigger.Entry enterEntry = new EventTrigger.Entry();
        enterEntry.eventID = EventTriggerType.PointerEnter;
        enterEntry.callback.AddListener((data) => { OnHoverEnter(); });
        trigger.triggers.Add(enterEntry);
        
        EventTrigger.Entry exitEntry = new EventTrigger.Entry();
        exitEntry.eventID = EventTriggerType.PointerExit;
        exitEntry.callback.AddListener((data) => { OnHoverExit(); });
        trigger.triggers.Add(exitEntry);
    }
    
    void OnHoverEnter()
    {
        transform.DOScale(1.05f, 0.2f);
        // Add glow
    }
    
    void OnHoverExit()
    {
        transform.DOScale(1f, 0.2f);
    }
    
    void OnEnterGame()
    {
        // Save username
        string username = GameObject.Find("UsernameInput").GetComponent<TMP_InputField>().text;
        if (string.IsNullOrEmpty(username))
        {
            username = GenerateGuestName();
        }
        PlayerPrefs.SetString("Username", username);
        
        // Load next scene
        SceneManager.LoadScene("AllocationScene");
    }
    
    string GenerateGuestName()
    {
        string[] adjectives = { "Swift", "Smart", "Lucky", "Bold", "Wise" };
        string[] nouns = { "Trader", "Investor", "Whale", "Bull", "Bear" };
        return adjectives[Random.Range(0, adjectives.Length)] + 
               nouns[Random.Range(0, nouns.Length)] + 
               Random.Range(100, 999);
    }
}
```

### Step 6: Live Game Stats
```csharp
public class LiveGameStats : MonoBehaviour
{
    public TextMeshProUGUI statsText;
    
    void Start()
    {
        statsText.color = ColorPalette.Instance.lightCyan;
        StartCoroutine(UpdateStats());
    }
    
    IEnumerator UpdateStats()
    {
        while (true)
        {
            // Fetch from API
            int playerCount = GameAPI.GetCurrentPlayerCount();
            TimeSpan timeRemaining = GameAPI.GetTimeRemaining();
            
            statsText.text = $"Current Game: {playerCount:N0} Players Competing\n" +
                           $"Time Remaining: {timeRemaining:hh\\:mm\\:ss}";
            
            yield return new WaitForSeconds(1f);
        }
    }
}
```

## Screen 2: Portfolio Allocation

### Step 1: Scene Setup
1. Create scene: `AllocationScene`
2. Black background as before
3. Add header text

### Step 2: Crypto Row Prefab
Create `CryptoAllocationRow.cs`:
```csharp
public class CryptoAllocationRow : MonoBehaviour
{
    [Header("UI References")]
    public Image cryptoIcon;
    public TextMeshProUGUI nameText;
    public TextMeshProUGUI priceText;
    public TextMeshProUGUI changeText;
    public Slider allocationSlider;
    public Image sliderFill;
    public TextMeshProUGUI pointsText;
    
    [Header("Data")]
    public string cryptoSymbol;
    public Color barColor;
    
    private AllocationManager manager;
    
    public void Initialize(CryptoData data, Color color, AllocationManager mgr)
    {
        manager = mgr;
        cryptoSymbol = data.symbol;
        barColor = color;
        
        // Set texts
        nameText.text = $"{data.symbol}  {data.name}";
        UpdatePrice(data.currentPrice, data.change24h);
        
        // Set slider
        allocationSlider.minValue = 0;
        allocationSlider.maxValue = 100;
        allocationSlider.wholeNumbers = true;
        allocationSlider.onValueChanged.AddListener(OnSliderChanged);
        
        // Set color
        sliderFill.color = barColor;
        
        // Add +/- buttons
        CreateAdjustButtons();
    }
    
    void UpdatePrice(float price, float change)
    {
        priceText.text = $"${price:N0}";
        changeText.text = $"{(change >= 0 ? "▲" : "▼")} {Mathf.Abs(change):F1}%";
        changeText.color = change >= 0 ? Color.green : Color.red;
    }
    
    void OnSliderChanged(float value)
    {
        int points = Mathf.RoundToInt(value);
        pointsText.text = $"{points} pts";
        
        // Update manager
        manager.UpdateAllocation(cryptoSymbol, points);
        
        // Animate fill
        float fillAmount = points / 100f;
        sliderFill.DOFillAmount(fillAmount, 0.2f);
    }
    
    void CreateAdjustButtons()
    {
        // Create -5, -1, +1, +5 buttons
        CreateButton("-5", -5, -100);
        CreateButton("-1", -1, -60);
        CreateButton("+1", 1, 60);
        CreateButton("+5", 5, 100);
    }
    
    void CreateButton(string label, int delta, float xPos)
    {
        GameObject btn = new GameObject($"Btn{label}");
        btn.transform.SetParent(transform);
        
        Button button = btn.AddComponent<Button>();
        Image img = btn.AddComponent<Image>();
        img.color = ColorPalette.Instance.lightCyan;
        
        TextMeshProUGUI text = new GameObject("Text").AddComponent<TextMeshProUGUI>();
        text.transform.SetParent(btn.transform);
        text.text = label;
        text.color = ColorPalette.Instance.textOnLight;
        
        button.onClick.AddListener(() => {
            allocationSlider.value = Mathf.Clamp(allocationSlider.value + delta, 0, 100);
        });
        
        // Position
        RectTransform rect = btn.GetComponent<RectTransform>();
        rect.anchoredPosition = new Vector2(xPos, 0);
        rect.sizeDelta = new Vector2(40, 40);
    }
}
```

### Step 3: Allocation Manager
```csharp
public class AllocationManager : MonoBehaviour
{
    public GameObject rowPrefab;
    public Transform rowContainer;
    public TextMeshProUGUI totalPointsText;
    public Button lockButton;
    
    private Dictionary<string, int> allocations = new Dictionary<string, int>();
    private List<CryptoAllocationRow> rows = new List<CryptoAllocationRow>();
    
    void Start()
    {
        CreateAllocationRows();
        UpdateTotalDisplay();
    }
    
    void CreateAllocationRows()
    {
        CryptoData[] cryptos = new CryptoData[] {
            new CryptoData { symbol = "BTC", name = "Bitcoin" },
            new CryptoData { symbol = "ETH", name = "Ethereum" },
            new CryptoData { symbol = "BNB", name = "Binance Coin" },
            new CryptoData { symbol = "SOL", name = "Solana" },
            new CryptoData { symbol = "XRP", name = "Ripple" }
        };
        
        Color[] colors = {
            ColorPalette.Instance.cyan,
            ColorPalette.Instance.lightCyan,
            ColorPalette.Instance.white,
            ColorPalette.Instance.lightPink,
            ColorPalette.Instance.magenta
        };
        
        for (int i = 0; i < cryptos.Length; i++)
        {
            GameObject row = Instantiate(rowPrefab, rowContainer);
            CryptoAllocationRow rowScript = row.GetComponent<CryptoAllocationRow>();
            rowScript.Initialize(cryptos[i], colors[i], this);
            rows.Add(rowScript);
            
            allocations[cryptos[i].symbol] = 0;
        }
    }
    
    public void UpdateAllocation(string symbol, int points)
    {
        allocations[symbol] = points;
        UpdateTotalDisplay();
    }
    
    void UpdateTotalDisplay()
    {
        int total = allocations.Values.Sum();
        totalPointsText.text = $"Points Used: {total}/100";
        
        if (total == 100)
        {
            totalPointsText.color = Color.green;
            totalPointsText.text += " ✓";
            lockButton.interactable = true;
            
            // Pulse effect on button
            lockButton.transform.DOScale(1.05f, 0.5f).SetLoops(-1, LoopType.Yoyo);
        }
        else
        {
            totalPointsText.color = total > 100 ? Color.red : Color.white;
            lockButton.interactable = false;
            lockButton.transform.DOKill();
            lockButton.transform.localScale = Vector3.one;
        }
    }
    
    public void OnLockPortfolio()
    {
        // Save allocations
        GameData.SaveAllocations(allocations);
        
        // Particle effect
        SpawnLockParticles();
        
        // Load performance scene after delay
        StartCoroutine(TransitionToPerformance());
    }
    
    IEnumerator TransitionToPerformance()
    {
        // Fade out
        yield return new WaitForSeconds(0.5f);
        SceneManager.LoadScene("PerformanceScene");
    }
}
```

## Screen 3: Live Performance Dashboard

### Step 1: Portfolio Header
```csharp
public class PortfolioHeader : MonoBehaviour
{
    public TextMeshProUGUI valueText;
    public TextMeshProUGUI returnText;
    public TextMeshProUGUI rankText;
    public Image borderGradient;
    
    void Start()
    {
        // Apply gradient border
        borderGradient.material = new Material(Shader.Find("UI/Gradient"));
        borderGradient.material.SetColor("_Color1", ColorPalette.Instance.cyan);
        borderGradient.material.SetColor("_Color2", ColorPalette.Instance.magenta);
        
        StartCoroutine(UpdatePortfolioValue());
    }
    
    IEnumerator UpdatePortfolioValue()
    {
        while (true)
        {
            var portfolio = GameAPI.GetPortfolioStatus();
            
            // Animate value change
            DOTween.To(() => float.Parse(valueText.text.Replace("$", "").Replace(",", "")), 
                      x => valueText.text = $"YOUR PORTFOLIO: ${x:N0}", 
                      portfolio.currentValue, 
                      0.5f);
            
            // Update return with color
            returnText.text = $"RETURN: {portfolio.returnPercent:+0.00;-0.00}%";
            returnText.color = portfolio.returnPercent >= 0 ? Color.green : Color.red;
            
            // Update rank
            rankText.text = $"RANK: #{portfolio.rank:N0}/{portfolio.totalPlayers:N0}";
            
            // Check for rank improvement
            CheckRankChange(portfolio.rank);
            
            yield return new WaitForSeconds(2f);
        }
    }
    
    void CheckRankChange(int newRank)
    {
        int oldRank = PlayerPrefs.GetInt("LastRank", newRank);
        
        if (newRank < oldRank)
        {
            // Improved! Show particles
            SpawnRankUpParticles();
        }
        
        PlayerPrefs.SetInt("LastRank", newRank);
    }
}
```

### Step 2: Asset Performance Display
```csharp
public class AssetPerformanceDisplay : MonoBehaviour
{
    public GameObject performanceRowPrefab;
    public Transform rowContainer;
    
    void Start()
    {
        CreatePerformanceRows();
        StartCoroutine(UpdatePerformance());
    }
    
    void CreatePerformanceRows()
    {
        var allocations = GameData.GetAllocations();
        
        foreach (var kvp in allocations)
        {
            if (kvp.Value > 0)
            {
                CreateRow(kvp.Key, kvp.Value);
            }
        }
    }
    
    void CreateRow(string symbol, int allocation)
    {
        GameObject row = Instantiate(performanceRowPrefab, rowContainer);
        PerformanceRow rowScript = row.GetComponent<PerformanceRow>();
        rowScript.Initialize(symbol, allocation);
    }
    
    IEnumerator UpdatePerformance()
    {
        while (true)
        {
            // Update all rows
            foreach (Transform child in rowContainer)
            {
                child.GetComponent<PerformanceRow>().UpdatePerformance();
            }
            
            yield return new WaitForSeconds(1f);
        }
    }
}

public class PerformanceRow : MonoBehaviour
{
    public TextMeshProUGUI assetText;
    public TextMeshProUGUI valueText;
    public TextMeshProUGUI changeText;
    public Image performanceBar;
    
    private string symbol;
    private int allocation;
    private float lastValue;
    
    public void Initialize(string sym, int alloc)
    {
        symbol = sym;
        allocation = alloc;
        assetText.text = $"{symbol} ({allocation}%)";
        
        // Set bar color based on symbol
        performanceBar.color = GetColorForSymbol(symbol);
    }
    
    public void UpdatePerformance()
    {
        var performance = GameAPI.GetAssetPerformance(symbol);
        float currentValue = performance.currentValue * allocation / 100f;
        
        // Animate value
        DOTween.To(() => lastValue, 
                  x => valueText.text = $"${x:N0}", 
                  currentValue, 
                  0.5f);
        
        // Update change
        changeText.text = $"{(performance.change >= 0 ? "▲" : "▼")} {Mathf.Abs(performance.change):F2}%";
        changeText.color = performance.change >= 0 ? Color.green : Color.red;
        
        // Animate bar
        float barFill = allocation / 100f;
        performanceBar.DOFillAmount(barFill, 0.3f);
        
        lastValue = currentValue;
    }
}
```

### Step 3: Leaderboard
```csharp
public class Leaderboard : MonoBehaviour
{
    public GameObject leaderboardRowPrefab;
    public Transform rowContainer;
    public ScrollRect scrollRect;
    
    void Start()
    {
        StartCoroutine(UpdateLeaderboard());
    }
    
    IEnumerator UpdateLeaderboard()
    {
        while (true)
        {
            var leaders = GameAPI.GetTopPerformers(100);
            var myRank = GameAPI.GetMyRank();
            
            // Clear old entries
            foreach (Transform child in rowContainer)
            {
                Destroy(child.gameObject);
            }
            
            // Add top performers
            foreach (var leader in leaders)
            {
                CreateLeaderRow(leader);
            }
            
            // Ensure player is visible
            if (myRank > 100)
            {
                CreateLeaderRow(new LeaderData { 
                    rank = myRank, 
                    username = PlayerPrefs.GetString("Username"), 
                    returnPercent = GameAPI.GetMyReturn(),
                    isPlayer = true 
                });
            }
            
            // Scroll to player
            ScrollToPlayer();
            
            yield return new WaitForSeconds(5f);
        }
    }
    
    void CreateLeaderRow(LeaderData data)
    {
        GameObject row = Instantiate(leaderboardRowPrefab, rowContainer);
        
        TextMeshProUGUI text = row.GetComponentInChildren<TextMeshProUGUI>();
        text.text = $"{data.rank}. {data.username}     {data.returnPercent:+0.00}%";
        
        if (data.isPlayer)
        {
            // Highlight player row
            Image bg = row.GetComponent<Image>();
            bg.color = ColorPalette.Instance.lightPink;
            text.color = ColorPalette.Instance.textOnLight;
            
            // Add pulsing effect
            bg.DOFade(0.8f, 0.5f).SetLoops(-1, LoopType.Yoyo);
        }
    }
}
```

## Screen 4: Universal Results Screen

### Step 1: Results Display
```csharp
public class ResultsScreen : MonoBehaviour
{
    public TextMeshProUGUI headerText;
    public TextMeshProUGUI congratsText;
    public TextMeshProUGUI rankText;
    public TextMeshProUGUI portfolioText;
    public TextMeshProUGUI returnText;
    public Image rankBox;
    
    void Start()
    {
        DisplayResults();
    }
    
    void DisplayResults()
    {
        var results = GameAPI.GetFinalResults();
        
        // Header
        headerText.text = "GAME COMPLETE!";
        ApplyGradientToText(headerText);
        
        // Main message - same for everyone
        congratsText.text = "CONGRATULATIONS! YOU FINISHED";
        rankText.text = $"#{results.rank:N0} OUT OF {results.totalPlayers:N0}";
        
        // Apply gradient border to rank box
        rankBox.material = new Material(Shader.Find("UI/Gradient"));
        rankBox.material.SetColor("_Color1", ColorPalette.Instance.cyan);
        rankBox.material.SetColor("_Color2", ColorPalette.Instance.magenta);
        
        // Portfolio stats
        portfolioText.text = $"Final Portfolio: ${results.finalValue:N0}";
        returnText.text = $"Total Return: {results.returnPercent:+0.00;-0.00}%";
        returnText.color = results.returnPercent >= 0 ? Color.green : Color.red;
        
        // Show performance breakdown
        ShowPerformanceBreakdown();
        
        // Particle effects for top performers
        if (results.rank == 1)
        {
            SpawnCelebrationParticles();
        }
    }
    
    void ShowPerformanceBreakdown()
    {
        var breakdown = GameAPI.GetPerformanceBreakdown();
        
        // Display best and worst picks
        bestPickText.text = $"Best Pick: {breakdown.bestSymbol} {breakdown.bestReturn:+0.00}%";
        worstPickText.text = $"Worst Pick: {breakdown.worstSymbol} {breakdown.worstReturn:+0.00}%";
        
        // Strategy assessment
        string strategy = AssessStrategy(breakdown);
        strategyText.text = $"Overall Strategy: {strategy}";
    }
    
    string AssessStrategy(PerformanceBreakdown breakdown)
    {
        // Simple strategy assessment based on allocation patterns
        if (breakdown.concentrationScore > 0.7f)
            return "AGGRESSIVE";
        else if (breakdown.concentrationScore < 0.3f)
            return "DIVERSIFIED";
        else
            return "MODERATE";
    }
    
    void SpawnCelebrationParticles()
    {
        // Special effects for winner
        var particles = ParticleManager.Instance.victoryConfetti;
        var main = particles.main;
        main.startColor = new ParticleSystem.MinMaxGradient(
            ColorPalette.Instance.cyan, 
            ColorPalette.Instance.magenta
        );
        particles.Play();
    }
    
    public void OnPlayAgain()
    {
        // Reset game state
        GameData.Clear();
        SceneTransitionManager.TransitionTo("WelcomeScene");
    }
    
    public void OnViewLeaderboard()
    {
        // Show full leaderboard popup or scene
        LeaderboardPopup.Show();
    }
}
```

## Common Components

### Particle Manager
```csharp
public class ParticleManager : MonoBehaviour
{
    public static ParticleManager Instance;
    
    public ParticleSystem rankUpParticles;
    public ParticleSystem lockInParticles;
    public ParticleSystem victoryConfetti;
    
    void Awake()
    {
        Instance = this;
    }
    
    public void PlayRankUp(Vector3 position)
    {
        rankUpParticles.transform.position = position;
        var main = rankUpParticles.main;
        main.startColor = ColorPalette.Instance.cyan;
        rankUpParticles.Play();
    }
    
    public void PlayLockIn(Vector3 position)
    {
        lockInParticles.transform.position = position;
        var main = lockInParticles.main;
        main.startColor = ColorPalette.Instance.magenta;
        lockInParticles.Play();
    }
}
```

### Scene Transition Manager
```csharp
public class SceneTransitionManager : MonoBehaviour
{
    public Image fadeOverlay;
    
    public static void TransitionTo(string sceneName)
    {
        Instance.StartCoroutine(Instance.DoTransition(sceneName));
    }
    
    IEnumerator DoTransition(string sceneName)
    {
        // Fade to black
        fadeOverlay.gameObject.SetActive(true);
        fadeOverlay.color = new Color(0, 0, 0, 0);
        fadeOverlay.DOFade(1f, 0.5f);
        
        yield return new WaitForSeconds(0.5f);
        
        // Load new scene
        SceneManager.LoadScene(sceneName);
    }
}
```

## Build Checklist

### Per Screen
- [ ] Welcome Screen
  - [ ] Gradient title effect
  - [ ] Username input styling
  - [ ] Enter button with hover
  - [ ] Live stats display
  
- [ ] Allocation Screen
  - [ ] 5 crypto rows with sliders
  - [ ] Point validation
  - [ ] Lock button activation
  - [ ] Price display with changes
  
- [ ] Performance Screen
  - [ ] Portfolio value header
  - [ ] Asset performance rows
  - [ ] Animated leaderboard
  - [ ] Countdown timer
  
- [ ] Results Screen (Universal)
  - [ ] Congratulations message
  - [ ] Dynamic rank display
  - [ ] Performance breakdown
  - [ ] Play again/leaderboard options

### Global Systems
- [ ] Color palette ScriptableObject
- [ ] Gradient shaders
- [ ] Particle effects
- [ ] Scene transitions
- [ ] Sound effects
- [ ] API integration
- [ ] Data persistence 