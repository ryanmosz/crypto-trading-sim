#!/bin/bash

echo "🚀 Starting Unity WebGL Build..."
echo "📁 Project Path: $(pwd)"

# Create necessary directories
mkdir -p builds/WebGL
mkdir -p Assets/Editor

# Check if Unity license is provided
if [ -z "$UNITY_LICENSE_CONTENT" ]; then
    echo "❌ Error: UNITY_LICENSE_CONTENT not set!"
    echo "Please add your Unity license to .env file"
    exit 1
fi

# Activate Unity license
echo "📄 Activating Unity license..."
echo "$UNITY_LICENSE_CONTENT" | tr -d '\r' > /root/.local/share/unity3d/Unity/Unity_lic.ulf

# Create build script if it doesn't exist
if [ ! -f "Assets/Editor/BuildScript.cs" ]; then
    echo "📝 Creating BuildScript.cs..."
    cat > Assets/Editor/BuildScript.cs << 'EOF'
using UnityEditor;
using UnityEngine;
using System.Linq;

public class BuildScript
{
    [MenuItem("Build/Build WebGL")]
    public static void Build()
    {
        // Get all scenes in build settings
        string[] scenes = EditorBuildSettings.scenes
            .Where(scene => scene.enabled)
            .Select(scene => scene.path)
            .ToArray();
        
        if (scenes.Length == 0)
        {
            Debug.LogError("No scenes found in build settings!");
            // If no scenes, try to find a main scene
            scenes = new[] { "Assets/Scenes/Welcome.unity" };
        }
        
        Debug.Log($"Building with {scenes.Length} scenes");
        foreach (var scene in scenes)
        {
            Debug.Log($"  - {scene}");
        }
        
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = "builds/WebGL",
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };
        
        var report = BuildPipeline.BuildPlayer(buildPlayerOptions);
        
        if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded)
        {
            Debug.Log("✅ Build succeeded!");
        }
        else
        {
            Debug.LogError("❌ Build failed!");
            EditorApplication.Exit(1);
        }
    }
}
EOF
fi

# Run the build
echo "🔨 Building WebGL..."
/opt/unity/Editor/Unity \
    -quit \
    -batchmode \
    -nographics \
    -silent-crashes \
    -projectPath . \
    -buildTarget WebGL \
    -customBuildTarget WebGL \
    -customBuildPath builds/WebGL \
    -customBuildName CryptoTradingSim \
    -executeMethod BuildScript.Build \
    -logFile /dev/stdout

# Check if build was successful
if [ -f "builds/WebGL/index.html" ]; then
    echo "✅ Build Complete!"
    echo "📁 Output: builds/WebGL/"
    ls -la builds/WebGL/
else
    echo "❌ Build failed - no output files found"
    exit 1
fi 