import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/index.dart';

/// Provider quản lý trạng thái Authentication
class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  bool _isLoading = false;
  bool _isInitialized = false;
  String? _error;

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  bool get isInitialized => _isInitialized;
  String? get error => _error;

  /// Khởi tạo - kiểm tra đã đăng nhập chưa
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    _isLoading = true;
    notifyListeners();

    try {
      final hasToken = await _authService.isLoggedIn();
      
      if (hasToken) {
        final result = await _authService.getCurrentUser();
        if (result.success && result.user != null) {
          _user = result.user;
        } else {
          // Token không hợp lệ, clear
          await _authService.logout();
        }
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    _isInitialized = true;
    notifyListeners();
  }

  /// Đăng ký
  Future<bool> register({
    required String email,
    required String password,
    String? name,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _authService.register(
        email: email,
        password: password,
        name: name,
      );

      if (result.success && result.user != null) {
        _user = result.user;
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _error = result.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Đăng nhập
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _authService.login(
        email: email,
        password: password,
      );

      if (result.success && result.user != null) {
        _user = result.user;
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _error = result.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Đăng xuất
  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _error = null;
    notifyListeners();
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
