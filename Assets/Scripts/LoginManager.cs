using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class LoginManager : MonoBehaviour
{
    [Header("UI References")]
    public Button aliceButton;
    public Button bobButton;
    public TextMeshProUGUI titleText;
    public TextMeshProUGUI aliceButtonText;
    public TextMeshProUGUI bobButtonText;
    
    void Start()
    {
        // Set up the title
        if (titleText != null)
            titleText.text = "CRYPTO TRADING SIM";
        
        // Set up Alice button
        if (aliceButton != null && aliceButtonText != null)
        {
            aliceButtonText.text = $"Alice\n{GetPerformancePreview("Alice")}";
            aliceButtonText.color = Color.cyan;
            aliceButton.onClick.AddListener(UserManager.LoginAsAlice);
        }
        
        // Set up Bob button
        if (bobButton != null && bobButtonText != null)
        {
            bobButtonText.text = $"Bob\n{GetPerformancePreview("Bob")}";
            bobButtonText.color = Color.magenta;
            bobButton.onClick.AddListener(UserManager.LoginAsBob);
        }
    }
    
    string GetPerformancePreview(string user)
    {
        if (user == "Alice")
            return "$10M → $12M (+20%)";
        else
            return "$10M → $8M (-20%)";
    }
} 