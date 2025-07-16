using UnityEngine;

public static class UIConstants
{
    // Colors
    public static readonly Color BackgroundColor = Color.black;
    public static readonly Color CyanColor = new Color(0f, 1f, 1f, 1f);
    public static readonly Color MagentaColor = new Color(1f, 0f, 1f, 1f);
    public static readonly Color SuccessGreen = new Color(0.2f, 1f, 0.2f, 1f);
    public static readonly Color FailureRed = new Color(1f, 0.2f, 0.2f, 1f);
    
    // Text Sizes
    public const float TitleFontSize = 72f;
    public const float ButtonFontSize = 36f;
    public const float BodyFontSize = 24f;
    
    // Button Sizes
    public const float ButtonWidth = 400f;
    public const float ButtonHeight = 150f;
    
    // Animations
    public const float FadeInDuration = 0.5f;
    public const float ButtonHoverScale = 1.05f;
} 