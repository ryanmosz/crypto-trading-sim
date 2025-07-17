using UnityEngine;
using TMPro;

public class QuickRuntimeTest : MonoBehaviour
{
    [ContextMenu("Refresh Portfolio Display")]
    public void RefreshPortfolioDisplay()
    {
        // Find and update portfolio text
        var portfolioText = GameObject.Find("PortfolioText")?.GetComponent<TextMeshProUGUI>();
        if (portfolioText != null && UserManager.CurrentUser != null)
        {
            portfolioText.text = $"Portfolio: ${UserManager.CurrentValue / 1000000f:F1}M\n" +
                                UserManager.GetPerformanceString();
            Debug.Log($"Updated portfolio display for {UserManager.CurrentUser}: {portfolioText.text}");
        }
        
        // Update welcome text too
        var welcomeText = GameObject.Find("WelcomeText")?.GetComponent<TextMeshProUGUI>();
        if (welcomeText != null && UserManager.CurrentUser != null)
        {
            welcomeText.text = $"Welcome, {UserManager.CurrentUser}!";
        }
    }
    
    void Update()
    {
        // Press R to refresh display
        if (Input.GetKeyDown(KeyCode.R))
        {
            RefreshPortfolioDisplay();
        }
    }
} 