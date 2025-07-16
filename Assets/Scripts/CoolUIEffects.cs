using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

/// <summary>
/// Adds cool visual effects to UI elements to match the HTML mockup
/// </summary>
public class CoolUIEffects : MonoBehaviour
{
    public static void ApplyCoolButtonEffect(GameObject button, Color glowColor)
    {
        // Add outline for glow effect
        var outline = button.AddComponent<Outline>();
        outline.effectColor = glowColor;
        outline.effectDistance = new Vector2(3, 3);
        
        // Add shadow for depth
        var shadow = button.AddComponent<Shadow>();
        shadow.effectColor = new Color(glowColor.r, glowColor.g, glowColor.b, 0.5f);
        shadow.effectDistance = new Vector2(5, -5);
        
        // Add hover effect
        button.AddComponent<ButtonHoverEffect>().glowColor = glowColor;
        
        // Style the button background
        var image = button.GetComponent<Image>();
        if (image != null)
        {
            image.color = new Color(0, 0, 0, 0.8f); // Darker background
        }
        
        // Add border (using a second image)
        var borderGO = new GameObject("Border");
        borderGO.transform.SetParent(button.transform, false);
        var borderRect = borderGO.AddComponent<RectTransform>();
        borderRect.anchorMin = Vector2.zero;
        borderRect.anchorMax = Vector2.one;
        borderRect.sizeDelta = Vector2.zero;
        borderRect.SetAsFirstSibling(); // Behind text
        
        var borderImage = borderGO.AddComponent<Image>();
        borderImage.color = new Color(glowColor.r, glowColor.g, glowColor.b, 0.3f);
        borderImage.raycastTarget = false;
    }
    
    public static void ApplyTitleEffect(TextMeshProUGUI title)
    {
        // Add gradient
        title.enableVertexGradient = true;
        title.colorGradient = new VertexGradient(
            Color.white,
            Color.white,
            new Color(0.5f, 0.5f, 0.5f, 1f),
            new Color(0.5f, 0.5f, 0.5f, 1f)
        );
        
        // Add outline
        title.outlineWidth = 0.2f;
        title.outlineColor = new Color32(0, 255, 255, 128); // Cyan glow
        
        // Make it bold
        title.fontStyle = FontStyles.Bold;
    }
}

/// <summary>
/// Hover effect for buttons
/// </summary>
public class ButtonHoverEffect : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public Color glowColor = Color.cyan;
    private Vector3 originalScale;
    private Outline outline;
    private Image image;
    
    void Start()
    {
        originalScale = transform.localScale;
        outline = GetComponent<Outline>();
        image = GetComponent<Image>();
    }
    
    public void OnPointerEnter(PointerEventData eventData)
    {
        // Scale up
        transform.localScale = originalScale * 1.05f;
        
        // Increase glow
        if (outline != null)
        {
            outline.effectDistance = new Vector2(5, 5);
        }
        
        // Brighten background slightly
        if (image != null)
        {
            image.color = new Color(0.1f, 0.1f, 0.1f, 0.9f);
        }
    }
    
    public void OnPointerExit(PointerEventData eventData)
    {
        // Reset scale
        transform.localScale = originalScale;
        
        // Reset glow
        if (outline != null)
        {
            outline.effectDistance = new Vector2(3, 3);
        }
        
        // Reset background
        if (image != null)
        {
            image.color = new Color(0, 0, 0, 0.8f);
        }
    }
}

/// <summary>
/// Animated gradient background
/// </summary>
public class AnimatedBackground : MonoBehaviour
{
    private Image backgroundImage;
    private float time = 0;
    
    void Start()
    {
        backgroundImage = GetComponent<Image>();
    }
    
    void Update()
    {
        if (backgroundImage != null)
        {
            time += Time.deltaTime * 0.1f;
            
            // Subtle color shift
            float r = Mathf.Sin(time) * 0.05f;
            float g = Mathf.Sin(time + 1) * 0.05f;
            float b = Mathf.Sin(time + 2) * 0.05f + 0.1f;
            
            backgroundImage.color = new Color(r, g, b, 1f);
        }
    }
} 