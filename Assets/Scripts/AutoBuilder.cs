#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

public class AutoBuilder : MonoBehaviour
{
    [MenuItem("Tools/Build WebGL Now")]
    public static void BuildWebGLNow()
    {
        // Make sure scenes are in correct order
        var scenes = new[]
        {
            "Assets/Scenes/Login.unity",
            "Assets/Scenes/Main.unity"
        };
        
        // Update build settings
        EditorBuildSettings.scenes = new[]
        {
            new EditorBuildSettingsScene(scenes[0], true),
            new EditorBuildSettingsScene(scenes[1], true)
        };
        
        Debug.Log("Build settings updated - Login is scene 0, Main is scene 1");
        
        // Define build options
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.scenes = scenes;
        buildPlayerOptions.locationPathName = "02";
        buildPlayerOptions.target = BuildTarget.WebGL;
        buildPlayerOptions.options = BuildOptions.None;
        
        Debug.Log("Starting WebGL build to folder: 02");
        
        // Start the build
        BuildPipeline.BuildPlayer(buildPlayerOptions);
    }
    
    [MenuItem("Tools/Quick Test in Editor")]
    public static void QuickTest()
    {
        // Make sure we start at Login scene
        UnityEditor.SceneManagement.EditorSceneManager.OpenScene("Assets/Scenes/Login.unity");
        UnityEditor.EditorApplication.isPlaying = true;
    }
}
#endif 