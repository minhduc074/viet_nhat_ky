import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;
  static const String _themeModeKey = 'theme_mode';

  ThemeMode get themeMode => _themeMode;
  bool get isDarkMode => _themeMode == ThemeMode.dark;

  // Initialize theme from saved preference
  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMode = prefs.getString(_themeModeKey);
    
    if (savedMode != null) {
      _themeMode = savedMode == 'dark' ? ThemeMode.dark : ThemeMode.light;
      notifyListeners();
    }
  }

  // Toggle theme
  Future<void> toggleTheme() async {
    _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeModeKey, _themeMode == ThemeMode.dark ? 'dark' : 'light');
  }

  // Set specific theme
  Future<void> setTheme(ThemeMode mode) async {
    if (_themeMode == mode) return;
    
    _themeMode = mode;
    notifyListeners();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeModeKey, mode == ThemeMode.dark ? 'dark' : 'light');
  }
}
