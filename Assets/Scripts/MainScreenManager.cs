using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class MainScreenManager : MonoBehaviour
{
    [Header("UI References")]
    public TextMeshProUGUI welcomeText;
    public TextMeshProUGUI portfolioText;
    public TextMeshProUGUI allocationText;
    public Button logoutButton;
    
    void Start()
    {
        // Check if user is logged in
        if (string.IsNullOrEmpty(UserManager.CurrentUser))
        {
            // No user logged in, go back to login
            UserManager.Logout();
            return;
        }
        
        // Set up welcome text
        if (welcomeText != null)
            welcomeText.text = $"Welcome, {UserManager.CurrentUser}!";
        
        // Set up portfolio text
        if (portfolioText != null)
        {
            portfolioText.text = $"Portfolio: ${UserManager.CurrentValue / 1000000f:F1}M\n" +
                                UserManager.GetPerformanceString();
        }
        
        // Show allocation if we have the text component
        if (allocationText != null)
        {
            string allocation = UserManager.CurrentUser == "Alice" 
                ? UserManager.AliceAllocation 
                : UserManager.BobAllocation;
            allocationText.text = $"Strategy: {allocation}";
        }
        
        // Set up logout button
        if (logoutButton != null)
            logoutButton.onClick.AddListener(UserManager.Logout);
    }
} 