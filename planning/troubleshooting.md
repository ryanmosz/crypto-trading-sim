# 🔧 Troubleshooting - Common Unity WebGL Issues

## Unity Installation Issues

### "Unity Hub won't open on Mac"
```bash
# Reset Unity Hub
rm -rf ~/Library/Application\ Support/UnityHub
rm -rf ~/Library/Preferences/com.unity3d.UnityHub*

# Reinstall
brew uninstall --cask unity-hub
brew install --cask unity-hub
```

### "WebGL module not found"
1. Open Unity Hub → Installs
2. Click gear icon on your Unity version
3. Add modules → WebGL Build Support
4. Wait for download (it's large ~1GB)

## Build Errors

### "Build failed: IL2CPP error"
```bash
# Clear build cache
rm -rf Library/
rm -rf Temp/
rm -rf obj/

# In Unity: File → Build Settings → Player Settings
# Publishing Settings → Enable "Decompression Fallback"
```

### "Out of memory during build"
1. Edit → Project Settings → Player → WebGL
2. Publishing Settings → Memory Size: 512 (instead of 256)
3. Close other applications during build
4. Use Docker build instead (more memory efficient)

### "CORS errors in browser"
```javascript
// If testing locally, use a proper web server:
// BAD: file:///path/to/index.html
// GOOD: http://localhost:8000/index.html

// Start local server:
cd builds/WebGL && python3 -m http.server 8000
```

## Runtime Issues

### "Game runs slowly in browser"
1. **Reduce quality settings:**
   ```
   Edit → Project Settings → Quality
   - Create "WebGL" preset
   - Shadows: Disabled
   - Anti Aliasing: 2x Multi Sampling
   ```

2. **Optimize textures:**
   ```
   Select texture → Inspector
   - Max Size: 512 or 1024
   - Compression: Normal Quality
   - Generate Mip Maps: ✓
   ```

3. **Simplify shaders:**
   - Use Mobile shaders even for desktop
   - Avoid transparent materials where possible

### "UI looks blurry or wrong size"
```csharp
// In your Canvas settings:
Canvas Scaler:
- UI Scale Mode: Scale With Screen Size
- Reference Resolution: 1920 x 1080
- Screen Match Mode: 0.5
```

### "Text not showing (TextMeshPro)"
1. Window → TextMeshPro → Import TMP Essential Resources
2. If still broken: Delete and recreate text objects
3. Use "TextMeshPro - Text (UI)" not regular Text

## API / Networking Issues

### "API calls fail from WebGL"
```javascript
// Common issues:
1. CORS not configured on backend
2. Using HTTP instead of HTTPS
3. Certificate issues

// Backend fix (Node.js/Vercel):
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // ... rest of handler
}
```

### "UnityWebRequest timeout"
```csharp
// Increase timeout for slow connections
using UnityEngine.Networking;

UnityWebRequest request = UnityWebRequest.Get(url);
request.timeout = 30; // 30 seconds instead of default 10
yield return request.SendWebRequest();
```

## Docker Issues

### "Unity license not found in Docker"
```bash
# 1. Generate license on your Mac
/Applications/Unity/Unity.app/Contents/MacOS/Unity \
  -quit -batchmode -createManualActivationFile

# 2. Upload Unity_v20XX.X.XX.alf to:
# https://license.unity3d.com/manual

# 3. Save to .env file
echo "UNITY_LICENSE_CONTENT=$(cat Unity_lic.ulf | base64)" > .env

# 4. Update docker-compose.yml to use .env
env_file:
  - .env
```

### "Docker build is very slow"
```yaml
# Add cache mounts to docker-compose.yml:
volumes:
  - .:/project
  - unity-library:/project/Library  # Cache Library folder
  - unity-temp:/project/Temp        # Cache Temp folder
```

## Scene/Navigation Issues

### "Scene won't load"
```csharp
// 1. Add scenes to Build Settings:
// File → Build Settings → Add Open Scenes

// 2. Load scene correctly:
using UnityEngine.SceneManagement;

// Good:
SceneManager.LoadScene("MainMenu");
// Or by index:
SceneManager.LoadScene(0);

// Bad (common mistake):
Application.LoadLevel("MainMenu"); // Deprecated!
```

### "Lost data between scenes"
```csharp
// Use singleton pattern:
public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}

// Or use PlayerPrefs for simple data:
PlayerPrefs.SetFloat("BTCAllocation", 30f);
PlayerPrefs.Save();
```

## Performance Profiling

### Check what's slow:
1. Window → Analysis → Profiler
2. Build Development Build with:
   - Development Build ✓
   - Autoconnect Profiler ✓
3. Look for spikes in:
   - CPU Usage
   - GPU Usage  
   - Memory

### Common performance fixes:
```csharp
// 1. Cache references
private Transform myTransform;
void Start() {
    myTransform = transform; // Cache it
}

// 2. Use object pooling for repeated instantiation
// 3. Reduce Update() calls - use coroutines
// 4. Batch draw calls with sprite atlases
```

## Quick Fixes Checklist

When nothing works:
1. **Clear Unity cache:**
   ```bash
   rm -rf ~/Library/Caches/com.unity3d.*
   ```

2. **Reimport all assets:**
   ```
   Right-click Assets folder → Reimport All
   ```

3. **Reset layout:**
   ```
   Window → Layouts → Default
   ```

4. **Check Unity version:**
   - Use LTS versions only
   - Match exact version in team

5. **Last resort:**
   - Create new project
   - Copy Assets folder only
   - Reconfigure settings

## Getting Help

### Useful resources:
- Unity Forums: https://forum.unity.com
- Unity Discord: https://discord.gg/unity
- Stack Overflow: Tag with [unity3d] [webgl]

### When asking for help, provide:
1. Unity version (e.g., 2022.3.10f1)
2. Build target (WebGL)
3. Error message (full text)
4. What you tried already
5. Minimal reproduction steps

Remember: Most "impossible" bugs are just missing project settings! 🐛✨ 