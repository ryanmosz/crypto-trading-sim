using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections;

/// <summary>
/// This script creates scenes at runtime if they don't exist.
/// Just attach this to any GameObject and hit Play!
/// </summary>
public class RuntimeSceneLoader : MonoBehaviour
{
    private static RuntimeSceneLoader instance;
    
    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
            StartCoroutine(InitializeGame());
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    IEnumerator InitializeGame()
    {
        // Check if we have scenes in build settings
        if (SceneManager.sceneCountInBuildSettings < 2)
        {
            Debug.Log("No scenes in build settings. Creating runtime scenes...");
            CreateLoginSceneRuntime();
        }
        else
        {
            // Load the first scene (Login)
            SceneManager.LoadScene(0);
        }
        
        yield return null;
    }
    
    public static void CreateLoginSceneRuntime()
    {
        // Clear current scene
        foreach (GameObject obj in FindObjectsOfType<GameObject>())
        {
            if (obj != instance.gameObject)
                Destroy(obj);
        }
        
        // Create Canvas
        GameObject canvasGO = new GameObject("Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        var scaler = canvasGO.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        canvasGO.AddComponent<GraphicRaycaster>();
        
        // EventSystem
        CreateEventSystem();
        
        // Background
        CreateBackground(canvas.transform);
        
        // Title with effects
        var titleTextComponent = CreateText(canvas.transform, "TitleText", "CRYPTO TRADING SIM", 
            new Vector2(0, 200), 72, Color.white);
        CoolUIEffects.ApplyTitleEffect(titleTextComponent);
        
        // Alice Button with cool effects
        var aliceBtn = CreateButton(canvas.transform, "AliceButton", 
            "Alice\n$10M → $12M (+20%)", new Vector2(-250, 0), Color.cyan);
        CoolUIEffects.ApplyCoolButtonEffect(aliceBtn.gameObject, Color.cyan);
        aliceBtn.onClick.AddListener(() => {
            UserManager.LoginAsAlice();
            CreateMainSceneRuntime();
        });
        
        // Bob Button with cool effects
        var bobBtn = CreateButton(canvas.transform, "BobButton",
            "Bob\n$10M → $8M (-20%)", new Vector2(250, 0), Color.magenta);
        CoolUIEffects.ApplyCoolButtonEffect(bobBtn.gameObject, Color.magenta);
        bobBtn.onClick.AddListener(() => {
            UserManager.LoginAsBob();
            CreateMainSceneRuntime();
        });
    }
    
    public static void CreateMainSceneRuntime()
    {
        // Clear current scene
        foreach (GameObject obj in FindObjectsOfType<GameObject>())
        {
            if (obj != instance.gameObject)
                Destroy(obj);
        }
        
        // Create Canvas
        GameObject canvasGO = new GameObject("Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        var scaler = canvasGO.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        canvasGO.AddComponent<GraphicRaycaster>();
        
        // EventSystem
        CreateEventSystem();
        
        // Background
        CreateBackground(canvas.transform);
        
        // Texts
        CreateText(canvas.transform, "WelcomeText", $"Welcome, {UserManager.CurrentUser}!", 
            new Vector2(0, 150), 48, Color.white);
        
        var portfolioText = $"Portfolio: ${UserManager.CurrentValue / 1000000f:F1}M\n" +
                           UserManager.GetPerformanceString();
        CreateText(canvas.transform, "PortfolioText", portfolioText, 
            new Vector2(0, 50), 36, Color.white);
        
        string allocation = UserManager.CurrentUser == "Alice" 
            ? UserManager.AliceAllocation 
            : UserManager.BobAllocation;
        CreateText(canvas.transform, "AllocationText", $"Strategy: {allocation}", 
            new Vector2(0, -50), 24, Color.gray);
        
        // Logout button with cool effects
        var logoutBtn = CreateButton(canvas.transform, "LogoutButton", "Logout", 
            new Vector2(0, -150), Color.white);
        logoutBtn.GetComponent<RectTransform>().sizeDelta = new Vector2(200, 60);
        CoolUIEffects.ApplyCoolButtonEffect(logoutBtn.gameObject, Color.white);
        logoutBtn.onClick.AddListener(() => {
            UserManager.Logout();
            CreateLoginSceneRuntime();
        });
    }
    
    static void CreateEventSystem()
    {
        if (FindObjectOfType<UnityEngine.EventSystems.EventSystem>() == null)
        {
            GameObject eventSystem = new GameObject("EventSystem");
            eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
            eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        }
    }
    
    static void CreateBackground(Transform parent)
    {
        GameObject bg = new GameObject("Background");
        bg.transform.SetParent(parent, false);
        RectTransform bgRect = bg.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        Image bgImage = bg.AddComponent<Image>();
        bgImage.color = Color.black;
        bg.AddComponent<AnimatedBackground>(); // Add subtle animation
    }
    
    static TextMeshProUGUI CreateText(Transform parent, string name, string text, 
        Vector2 position, float fontSize, Color color)
    {
        GameObject textGO = new GameObject(name);
        textGO.transform.SetParent(parent, false);
        
        RectTransform rect = textGO.AddComponent<RectTransform>();
        rect.anchoredPosition = position;
        rect.sizeDelta = new Vector2(800, 100);
        
        TextMeshProUGUI tmpText = textGO.AddComponent<TextMeshProUGUI>();
        tmpText.text = text;
        tmpText.fontSize = fontSize;
        tmpText.color = color;
        tmpText.alignment = TextAlignmentOptions.Center;
        
        return tmpText;
    }
    
    static Button CreateButton(Transform parent, string name, string text, 
        Vector2 position, Color textColor)
    {
        GameObject buttonGO = new GameObject(name);
        buttonGO.transform.SetParent(parent, false);
        
        RectTransform rect = buttonGO.AddComponent<RectTransform>();
        rect.anchoredPosition = position;
        rect.sizeDelta = new Vector2(400, 150);
        
        Image image = buttonGO.AddComponent<Image>();
        image.color = new Color(0, 0, 0, 0.2f);
        
        Button button = buttonGO.AddComponent<Button>();
        
        // Button text
        GameObject textGO = new GameObject("Text (TMP)");
        textGO.transform.SetParent(buttonGO.transform, false);
        RectTransform textRect = textGO.AddComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;
        
        TextMeshProUGUI tmpText = textGO.AddComponent<TextMeshProUGUI>();
        tmpText.text = text;
        tmpText.fontSize = 24;
        tmpText.color = textColor;
        tmpText.alignment = TextAlignmentOptions.Center;
        
        return button;
    }
} 