using UnityEngine;
using UnityEditor;

[InitializeOnLoad]
public class StartupBuilder
{
    static StartupBuilder()
    {
        // Check if we need to fix build settings
        if (EditorBuildSettings.scenes.Length < 2)
        {
            Debug.Log("🔧 Fixing build settings on startup...");
            
            var scenes = new[]
            {
                new EditorBuildSettingsScene("Assets/Scenes/Login.unity", true),
                new EditorBuildSettingsScene("Assets/Scenes/Main.unity", true)
            };
            
            EditorBuildSettings.scenes = scenes;
            Debug.Log("✅ Build settings fixed! Login is scene 0, Main is scene 1");
            Debug.Log("💡 Use Tools → Build WebGL Now to build");
        }
    }
} 