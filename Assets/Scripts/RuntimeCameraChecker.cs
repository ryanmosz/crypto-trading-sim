using UnityEngine;

public class RuntimeCameraChecker : MonoBehaviour
{
    void Awake()
    {
        // Check if there's a camera in the scene
        if (Camera.main == null && FindObjectOfType<Camera>() == null)
        {
            Debug.LogWarning("No camera found in scene! Creating one...");
            
            // Create Main Camera
            GameObject cameraObj = new GameObject("Main Camera (Auto-Generated)");
            Camera camera = cameraObj.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = Color.black;
            camera.orthographic = false;
            camera.fieldOfView = 60;
            cameraObj.AddComponent<AudioListener>();
            cameraObj.tag = "MainCamera";
            cameraObj.transform.position = new Vector3(0, 0, -10);
            
            Debug.Log("Emergency camera created!");
        }
    }
} 