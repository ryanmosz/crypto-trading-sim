using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
#endif

public class AutoSceneBuilder : MonoBehaviour
{
#if UNITY_EDITOR
    
    static void EnsureCamera(Scene scene)
    {
        // Check if scene already has a camera
        GameObject[] rootObjects = scene.GetRootGameObjects();
        foreach (var obj in rootObjects)
        {
            if (obj.GetComponentInChildren<Camera>() != null)
                return; // Camera already exists
        }
        
        // Create Main Camera
        GameObject cameraObj = new GameObject("Main Camera");
        Camera camera = cameraObj.AddComponent<Camera>();
        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = Color.black;
        camera.orthographic = false;
        camera.fieldOfView = 60;
        cameraObj.AddComponent<AudioListener>();
        cameraObj.tag = "MainCamera";
        cameraObj.transform.position = new Vector3(0, 0, -10);
        
        Debug.Log("Added Main Camera to scene");
    }
    
    [MenuItem("Tools/Build Scenes/Build Login Scene")]
    static void BuildLoginScene()
    {
        // Create new scene
        Scene scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        
        // Ensure camera exists
        EnsureCamera(scene);
        
        // Create Canvas
        GameObject canvasGO = new GameObject("Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasGO.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        canvasGO.GetComponent<CanvasScaler>().referenceResolution = new Vector2(1920, 1080);
        canvasGO.AddComponent<GraphicRaycaster>();
        
        // Create EventSystem
        GameObject eventSystem = new GameObject("EventSystem");
        eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
        eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        
        // Animated Background
        GameObject bg = new GameObject("Background");
        bg.transform.SetParent(canvas.transform, false);
        RectTransform bgRect = bg.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        bgRect.anchoredPosition = Vector2.zero;
        Image bgImage = bg.AddComponent<Image>();
        bgImage.color = Color.black;
        bg.AddComponent<AnimatedBackground>(); // Add subtle animation
        
        // Title with cool effects
        GameObject titleGO = new GameObject("TitleText");
        titleGO.transform.SetParent(canvas.transform, false);
        RectTransform titleRect = titleGO.AddComponent<RectTransform>();
        titleRect.anchoredPosition = new Vector2(0, 200);
        titleRect.sizeDelta = new Vector2(800, 100);
        TextMeshProUGUI titleText = titleGO.AddComponent<TextMeshProUGUI>();
        titleText.text = "CRYPTO TRADING SIM";
        titleText.fontSize = 72;
        titleText.color = Color.white;
        titleText.alignment = TextAlignmentOptions.Center;
        CoolUIEffects.ApplyTitleEffect(titleText); // Add gradient and glow
        
        // Alice Button with cool effects
        GameObject aliceBtn = CreateButton(canvas.transform, "AliceButton",
            "Alice\n$10M (Starting)", new Vector2(-250, 0), Color.cyan);
        CoolUIEffects.ApplyCoolButtonEffect(aliceBtn, Color.cyan);
        
        // Bob Button with cool effects
        GameObject bobBtn = CreateButton(canvas.transform, "BobButton",
            "Bob\n$10M (Starting)", new Vector2(250, 0), Color.magenta);
        CoolUIEffects.ApplyCoolButtonEffect(bobBtn, Color.magenta);
        
        // Add LoginManager
        GameObject manager = new GameObject("LoginManager");
        LoginManager loginManager = manager.AddComponent<LoginManager>();
        loginManager.aliceButton = aliceBtn.GetComponent<Button>();
        loginManager.bobButton = bobBtn.GetComponent<Button>();
        loginManager.titleText = titleText;
        loginManager.aliceButtonText = aliceBtn.GetComponentInChildren<TextMeshProUGUI>();
        loginManager.bobButtonText = bobBtn.GetComponentInChildren<TextMeshProUGUI>();
        
        // Save scene
        EditorSceneManager.SaveScene(scene, "Assets/Scenes/Login.unity");
    }
    
    [MenuItem("Tools/Build Scenes/Build Main Scene")]
    static void BuildMainScene()
    {
        // Create new scene
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        
        // Ensure camera exists
        EnsureCamera(scene);
        
        // Create Canvas (same as login)
        GameObject canvasGO = new GameObject("Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasGO.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        canvasGO.GetComponent<CanvasScaler>().referenceResolution = new Vector2(1920, 1080);
        canvasGO.AddComponent<GraphicRaycaster>();
        
        // EventSystem
        GameObject eventSystem = new GameObject("EventSystem");
        eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
        eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        
        // Background
        GameObject bg = new GameObject("Background");
        bg.transform.SetParent(canvas.transform, false);
        RectTransform bgRect = bg.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        Image bgImage = bg.AddComponent<Image>();
        bgImage.color = Color.black;
        
        // Welcome Text
        GameObject welcomeGO = CreateText(canvas.transform, "WelcomeText", 
            "Welcome!", new Vector2(0, 150), 48);
        
        // Portfolio Text
        GameObject portfolioGO = CreateText(canvas.transform, "PortfolioText",
            "Portfolio: $0M", new Vector2(0, 50), 36);
        
        // Allocation Text
        GameObject allocationGO = CreateText(canvas.transform, "AllocationText",
            "Strategy: ", new Vector2(0, -50), 24);
        allocationGO.GetComponent<TextMeshProUGUI>().color = Color.gray;
        
        // Logout Button with cool effects
        GameObject logoutBtn = CreateButton(canvas.transform, "LogoutButton",
            "Logout", new Vector2(0, -150), Color.white);
        logoutBtn.GetComponent<RectTransform>().sizeDelta = new Vector2(200, 60);
        CoolUIEffects.ApplyCoolButtonEffect(logoutBtn, Color.white);
        
        // Add MainScreenManager
        GameObject manager = new GameObject("MainScreenManager");
        MainScreenManager mainManager = manager.AddComponent<MainScreenManager>();
        mainManager.welcomeText = welcomeGO.GetComponent<TextMeshProUGUI>();
        mainManager.portfolioText = portfolioGO.GetComponent<TextMeshProUGUI>();
        mainManager.allocationText = allocationGO.GetComponent<TextMeshProUGUI>();
        mainManager.logoutButton = logoutBtn.GetComponent<Button>();
        
        // Save scene
        EditorSceneManager.SaveScene(scene, "Assets/Scenes/Main.unity");
    }
    
    static GameObject CreateButton(Transform parent, string name, string text, Vector2 position, Color textColor)
    {
        GameObject buttonGO = new GameObject(name);
        buttonGO.transform.SetParent(parent, false);
        
        RectTransform rect = buttonGO.AddComponent<RectTransform>();
        rect.anchoredPosition = position;
        rect.sizeDelta = new Vector2(400, 150);
        
        Image image = buttonGO.AddComponent<Image>();
        image.color = new Color(0, 0, 0, 0.6f); // Darker for better contrast
        
        Button button = buttonGO.AddComponent<Button>();
        
        // Set button transition to color tint
        ColorBlock colors = button.colors;
        colors.normalColor = Color.white;
        colors.highlightedColor = new Color(1.2f, 1.2f, 1.2f, 1f);
        colors.pressedColor = new Color(0.8f, 0.8f, 0.8f, 1f);
        button.colors = colors;
        
        GameObject textGO = new GameObject("Text (TMP)");
        textGO.transform.SetParent(buttonGO.transform, false);
        RectTransform textRect = textGO.AddComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;
        textRect.anchoredPosition = Vector2.zero;
        
        TextMeshProUGUI tmpText = textGO.AddComponent<TextMeshProUGUI>();
        tmpText.text = text;
        tmpText.fontSize = 24;
        tmpText.color = textColor;
        tmpText.alignment = TextAlignmentOptions.Center;
        
        return buttonGO;
    }
    
    static GameObject CreateText(Transform parent, string name, string text, Vector2 position, float fontSize)
    {
        GameObject textGO = new GameObject(name);
        textGO.transform.SetParent(parent, false);
        
        RectTransform rect = textGO.AddComponent<RectTransform>();
        rect.anchoredPosition = position;
        rect.sizeDelta = new Vector2(800, 100);
        
        TextMeshProUGUI tmpText = textGO.AddComponent<TextMeshProUGUI>();
        tmpText.text = text;
        tmpText.fontSize = fontSize;
        tmpText.color = Color.white;
        tmpText.alignment = TextAlignmentOptions.Center;
        
        return textGO;
    }

    [MenuItem("Tools/Quick Fixes/Add Camera to Current Scene")]
    static void AddCameraToCurrentScene()
    {
        Scene currentScene = EditorSceneManager.GetActiveScene();
        EnsureCamera(currentScene);
        EditorSceneManager.SaveScene(currentScene);
        Debug.Log("Camera added to current scene!");
    }

    [MenuItem("Tools/Build Scenes/Build All Scenes")]
    static void BuildAllScenes()
    {
        BuildLoginScene();
        BuildMainScene();
        Debug.Log("All scenes built successfully!");
    }
#endif
} 