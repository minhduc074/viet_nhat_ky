import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  // Singleton pattern
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  User? _currentUser;
  User? get currentUser => _currentUser;

  // Initialize - check if user is logged in
  Future<bool> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    
    if (token != null) {
      _api.setToken(token);
      
      try {
        // Verify token by getting user profile
        final response = await _api.get('/auth/me');
        final data = response['data'] as Map<String, dynamic>;
        _currentUser = User.fromJson(data['user'] as Map<String, dynamic>);
        return true;
      } catch (e) {
        // Token is invalid, clear it
        await logout();
        return false;
      }
    }
    
    return false;
  }

  // Register new user
  Future<User> register({
    required String email,
    required String password,
    String? name,
  }) async {
    final response = await _api.post('/auth/register', body: {
      'email': email,
      'password': password,
      if (name != null) 'name': name,
    });

    final data = response['data'] as Map<String, dynamic>;
    final authResponse = AuthResponse.fromJson(data);
    
    await _saveAuth(authResponse);
    return authResponse.user;
  }

  // Login user
  Future<User> login({
    required String email,
    required String password,
  }) async {
    final response = await _api.post('/auth/login', body: {
      'email': email,
      'password': password,
    });

    final data = response['data'] as Map<String, dynamic>;
    final authResponse = AuthResponse.fromJson(data);
    
    await _saveAuth(authResponse);
    return authResponse.user;
  }

  // Logout user
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
    _api.setToken(null);
    _currentUser = null;
  }

  // Save authentication data
  Future<void> _saveAuth(AuthResponse authResponse) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, authResponse.token);
    _api.setToken(authResponse.token);
    _currentUser = authResponse.user;
  }

  // Check if user is logged in
  bool get isLoggedIn => _currentUser != null && _api.token != null;
}
