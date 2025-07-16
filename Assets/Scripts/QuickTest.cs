using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Quick test script - attach to any GameObject to test the game flow
/// Shows debug info in the console
/// </summary>
public class QuickTest : MonoBehaviour
{
    void Start()
    {
        Debug.Log("=== CRYPTO TRADING SIM TEST ===");
        Debug.Log($"Current Scene: {SceneManager.GetActiveScene().name}");
        Debug.Log($"Build scenes count: {SceneManager.sceneCountInBuildSettings}");
        
        // Test UserManager
        TestUserManager();
    }
    
    void Update()
    {
        // Press T to test user switching
        if (Input.GetKeyDown(KeyCode.T))
        {
            TestUserSwitching();
        }
        
        // Press R to reload current scene
        if (Input.GetKeyDown(KeyCode.R))
        {
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
    
    void TestUserManager()
    {
        Debug.Log("\n--- Testing UserManager ---");
        
        // Test Alice
        UserManager.LoginAsAlice();
        Debug.Log($"Alice logged in:");
        Debug.Log($"  Current User: {UserManager.CurrentUser}");
        Debug.Log($"  Starting Value: ${UserManager.StartingValue:N0}");
        Debug.Log($"  Current Value: ${UserManager.CurrentValue:N0}");
        Debug.Log($"  Performance: {UserManager.GetPerformanceString()}");
        
        // Test Bob
        UserManager.LoginAsBob();
        Debug.Log($"\nBob logged in:");
        Debug.Log($"  Current User: {UserManager.CurrentUser}");
        Debug.Log($"  Starting Value: ${UserManager.StartingValue:N0}");
        Debug.Log($"  Current Value: ${UserManager.CurrentValue:N0}");
        Debug.Log($"  Performance: {UserManager.GetPerformanceString()}");
        
        // Clear for actual gameplay
        UserManager.Logout();
        Debug.Log("\nLogged out - ready for gameplay");
    }
    
    void TestUserSwitching()
    {
        if (UserManager.CurrentUser == "Alice")
        {
            UserManager.LoginAsBob();
            Debug.Log("Switched to Bob");
        }
        else if (UserManager.CurrentUser == "Bob")
        {
            UserManager.LoginAsAlice();
            Debug.Log("Switched to Alice");
        }
        else
        {
            UserManager.LoginAsAlice();
            Debug.Log("Logged in as Alice");
        }
        
        Debug.Log($"Current performance: {UserManager.GetPerformanceString()}");
    }
    
    void OnGUI()
    {
        // Show debug info on screen
        GUI.Label(new Rect(10, 10, 400, 100), 
            $"Current User: {UserManager.CurrentUser ?? "None"}\n" +
            $"Press T to test user switching\n" +
            $"Press R to reload scene");
    }
} 