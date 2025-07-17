using UnityEngine;
using UnityEngine.SceneManagement;

public static class UserManager
{
    public static string CurrentUser { get; set; }
    public static float StartingValue { get; } = 10000000f; // Both start with $10M
    public static float CurrentValue { get; set; }
    
    // Hardcoded allocations for demo
    public static readonly string AliceAllocation = "BTC:40 ETH:30 SOL:20 BNB:10 XRP:0";
    public static readonly string BobAllocation = "BTC:10 ETH:10 SOL:10 BNB:10 XRP:60";
    
    public static void LoginAsAlice()
    {
        CurrentUser = "Alice";
        CurrentValue = 10000000f; // Starting value - no trades yet
        SceneManager.LoadScene("Main");
    }
    
    public static void LoginAsBob()
    {
        CurrentUser = "Bob";
        CurrentValue = 10000000f; // Starting value - no trades yet
        SceneManager.LoadScene("Main");
    }
    
    public static void Logout()
    {
        CurrentUser = null;
        CurrentValue = 0;
        // Try loading by name first, then by index
        try 
        {
            SceneManager.LoadScene("Login");
        }
        catch
        {
            SceneManager.LoadScene(0); // Fallback to scene 0
        }
    }
    
    public static string GetPerformanceString()
    {
        if (CurrentValue == StartingValue)
        {
            return $"${StartingValue / 1000000f:F0}M (Starting)";
        }
        
        float change = CurrentValue - StartingValue;
        float percentage = (change / StartingValue) * 100f;
        string sign = percentage >= 0 ? "+" : "";
        return $"${StartingValue / 1000000f:F0}M → ${CurrentValue / 1000000f:F0}M ({sign}{percentage:F0}%)";
    }
} 