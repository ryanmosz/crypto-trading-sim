using UnityEngine;
using UnityEngine.SceneManagement;
#if UNITY_EDITOR
using UnityEditor;
using System.Linq;
#endif

public class QuickSceneFix : MonoBehaviour
{
#if UNITY_EDITOR
    [MenuItem("Tools/Fix Scene Build Order")]
    public static void FixSceneBuildOrder()
    {
        // Define the scenes in correct order
        string[] scenePaths = new string[]
        {
            "Assets/Scenes/Login.unity",
            "Assets/Scenes/Main.unity"
        };
        
        // Create EditorBuildSettingsScene array
        EditorBuildSettingsScene[] scenes = scenePaths
            .Select(path => new EditorBuildSettingsScene(path, true))
            .ToArray();
        
        // Set the build scenes
        EditorBuildSettings.scenes = scenes;
        
        Debug.Log("✅ Scene build order fixed!");
        Debug.Log("Scene 0: Login.unity");
        Debug.Log("Scene 1: Main.unity");
        Debug.Log("Now rebuild to WebGL!");
    }
#endif
    
    // Runtime check to ensure we start at Login
    void Awake()
    {
        if (SceneManager.GetActiveScene().name == "Main" && string.IsNullOrEmpty(UserManager.CurrentUser))
        {
            Debug.Log("No user logged in, redirecting to Login scene...");
            SceneManager.LoadScene("Login");
        }
    }
} 