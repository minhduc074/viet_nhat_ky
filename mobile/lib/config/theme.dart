import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Primary colors
  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color primaryLight = Color(0xFFA29BFE);
  static const Color primaryDark = Color(0xFF4834DF);

  // Secondary colors
  static const Color secondaryColor = Color(0xFFFF6B9D);
  static const Color accentColor = Color(0xFFFFD93D);

  // Background colors
  static const Color backgroundColor = Color(0xFFF8F9FD);
  static const Color surfaceColor = Colors.white;
  static const Color cardColor = Colors.white;

  // Text colors
  static const Color textPrimary = Color(0xFF2D3436);
  static const Color textSecondary = Color(0xFF636E72);
  static const Color textLight = Color(0xFFB2BEC3);

  // Status colors
  static const Color successColor = Color(0xFF00B894);
  static const Color warningColor = Color(0xFFFDAA5D);
  static const Color errorColor = Color(0xFFE17055);

  // Mood colors
  static const Color mood1Color = Color(0xFFE53935); // Tệ
  static const Color mood2Color = Color(0xFFFF7043); // Không tốt
  static const Color mood3Color = Color(0xFFFFCA28); // Bình thường
  static const Color mood4Color = Color(0xFF66BB6A); // Tốt
  static const Color mood5Color = Color(0xFF42A5F5); // Tuyệt vời

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
        return mood3Color;
    }
  }

  // Dark theme colors
  static const Color darkBackgroundColor = Color(0xFF1A1A2E);
  static const Color darkSurfaceColor = Color(0xFF16213E);
  static const Color darkCardColor = Color(0xFF0F3460);
  static const Color darkTextPrimary = Color(0xFFE8E8E8);
  static const Color darkTextSecondary = Color(0xFFB8B8B8);

  // Light Theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: secondaryColor,
      surface: surfaceColor,
      error: errorColor,
    ),
    scaffoldBackgroundColor: backgroundColor,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      iconTheme: const IconThemeData(color: textPrimary),
      titleTextStyle: GoogleFonts.nunito(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
    ),
    cardTheme: CardThemeData(
      color: cardColor,
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryColor,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        side: const BorderSide(color: primaryColor, width: 2),
        textStyle: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: errorColor),
      ),
      hintStyle: GoogleFonts.nunito(
        color: textLight,
        fontSize: 14,
      ),
    ),
    textTheme: TextTheme(
      displayLarge: GoogleFonts.nunito(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      displayMedium: GoogleFonts.nunito(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      headlineLarge: GoogleFonts.nunito(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      headlineMedium: GoogleFonts.nunito(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      titleLarge: GoogleFonts.nunito(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      titleMedium: GoogleFonts.nunito(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: textPrimary,
      ),
      bodyLarge: GoogleFonts.nunito(
        fontSize: 16,
        color: textPrimary,
      ),
      bodyMedium: GoogleFonts.nunito(
        fontSize: 14,
        color: textSecondary,
      ),
      labelLarge: GoogleFonts.nunito(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: primaryColor,
      unselectedItemColor: textLight,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
  );

  // Dark Theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: primaryLight,
      secondary: secondaryColor,
      surface: darkSurfaceColor,
      error: errorColor,
    ),
    scaffoldBackgroundColor: darkBackgroundColor,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      iconTheme: const IconThemeData(color: darkTextPrimary),
      titleTextStyle: GoogleFonts.nunito(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: darkTextPrimary,
      ),
    ),
    cardTheme: CardThemeData(
      color: darkCardColor,
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.3),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryLight,
        foregroundColor: darkBackgroundColor,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryLight,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        side: const BorderSide(color: primaryLight, width: 2),
        textStyle: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkSurfaceColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: darkCardColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: primaryLight, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: errorColor),
      ),
      hintStyle: GoogleFonts.nunito(
        color: darkTextSecondary,
        fontSize: 14,
      ),
    ),
    textTheme: TextTheme(
      displayLarge: GoogleFonts.nunito(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: darkTextPrimary,
      ),
      displayMedium: GoogleFonts.nunito(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: darkTextPrimary,
      ),
      headlineLarge: GoogleFonts.nunito(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: darkTextPrimary,
      ),
      headlineMedium: GoogleFonts.nunito(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: darkTextPrimary,
      ),
      titleLarge: GoogleFonts.nunito(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: darkTextPrimary,
      ),
      titleMedium: GoogleFonts.nunito(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: darkTextPrimary,
      ),
      bodyLarge: GoogleFonts.nunito(
        fontSize: 16,
        color: darkTextPrimary,
      ),
      bodyMedium: GoogleFonts.nunito(
        fontSize: 14,
        color: darkTextSecondary,
      ),
      labelLarge: GoogleFonts.nunito(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: darkTextPrimary,
      ),
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: darkSurfaceColor,
      selectedItemColor: primaryLight,
      unselectedItemColor: darkTextSecondary,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),
  );
}
