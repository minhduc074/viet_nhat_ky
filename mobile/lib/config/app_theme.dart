import 'package:flutter/material.dart';

/// Theme và màu sắc của ứng dụng
class AppTheme {
  // Mood Colors - Pastel & Vibrant mix
  static const Color mood1Color = Color(0xFFFF5252); // Rất tệ - Red Accent
  static const Color mood2Color = Color(0xFFFF9800); // Tệ - Orange
  static const Color mood3Color = Color(0xFFFFD740); // Bình thường - Amber Accent
  static const Color mood4Color = Color(0xFF69F0AE); // Tốt - Green Accent
  static const Color mood5Color = Color(0xFF00E676); // Tuyệt vời - Green
  
  // Primary Colors - Modern Indigo/Violet
  static const Color primaryColor = Color(0xFF6C63FF); // Modern Violet
  static const Color primaryLightColor = Color(0xFFA39BFF);
  static const Color primaryDarkColor = Color(0xFF3F3D56);
  
  // Accent Colors
  static const Color accentColor = Color(0xFFFF6584); // Soft Pink
  
  // Background Colors
  static const Color backgroundColor = Color(0xFFF3F4F6); // Cool Gray
  static const Color surfaceColor = Colors.white;
  static const Color cardColor = Colors.white;
  
  // Text Colors
  static const Color textPrimary = Color(0xFF2D3436); // Dark Gray
  static const Color textSecondary = Color(0xFF636E72); // Medium Gray
  static const Color textLight = Color(0xFFB2BEC3); // Light Gray
  
  // Other Colors
  static const Color successColor = Color(0xFF00B894); // Mint Green
  static const Color errorColor = Color(0xFFFF7675); // Soft Red
  static const Color warningColor = Color(0xFFFFEAA7); // Soft Yellow
  
  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF6C63FF), Color(0xFF4834D4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    colors: [Colors.white, Color(0xFFF8F9FA)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
  
  /// Lấy màu theo mood score
  static Color getMoodColor(int score) {
    switch (score) {
      case 1:
        return mood1Color;
      case 2:
        return mood2Color;
      case 3:
        return mood3Color;
      case 4:
        return mood4Color;
      case 5:
        return mood5Color;
      default:
        return textLight;
    }
  }
  
  /// Lấy emoji theo mood score
  static String getMoodEmoji(int score) {
    switch (score) {
      case 1:
        return '😫';
      case 2:
        return '😔';
      case 3:
        return '😐';
      case 4:
        return '🙂';
      case 5:
        return '🥰';
      default:
        return '🤔';
    }
  }
  
  /// Lấy label theo mood score
  static String getMoodLabel(int score) {
    switch (score) {
      case 1:
        return 'Rất tệ';
      case 2:
        return 'Không vui';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Vui vẻ';
      case 5:
        return 'Hạnh phúc';
      default:
        return 'Không xác định';
    }
  }
  
  /// Light Theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: primaryColor,
    scaffoldBackgroundColor: backgroundColor,
    fontFamily: 'Roboto', // Default, can be changed if custom fonts are added
    
    colorScheme: const ColorScheme.light(
      primary: primaryColor,
      secondary: accentColor,
      surface: surfaceColor,
      error: errorColor,
      background: backgroundColor,
    ),
    
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: textPrimary),
      titleTextStyle: TextStyle(
        color: textPrimary,
        fontSize: 24,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.5,
      ),
    ),
    
    cardTheme: CardThemeData(
      color: cardColor,
      elevation: 0, // Flat design with border or subtle shadow
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: Colors.grey.shade200, width: 1),
      ),
    ),
    
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 4,
        shadowColor: primaryColor.withOpacity(0.4),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    ),
    
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryColor,
        side: const BorderSide(color: primaryColor, width: 2),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: errorColor),
      ),
      contentPadding: const EdgeInsets.all(20),
      hintStyle: const TextStyle(color: textLight),
    ),
    
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: surfaceColor,
      selectedItemColor: primaryColor,
      unselectedItemColor: textLight,
      type: BottomNavigationBarType.fixed,
      elevation: 0,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
      unselectedLabelStyle: TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
    ),
    
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: primaryColor,
      foregroundColor: Colors.white,
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );
}
