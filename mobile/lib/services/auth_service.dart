import '../config/app_config.dart';
import '../models/index.dart';
import 'api_service.dart';

/// Service xử lý Authentication
class AuthService {
  final ApiService _api = ApiService();

  /// Đăng ký tài khoản
  Future<AuthResult> register({
    required String email,
    required String password,
    String? name,
  }) async {
    final response = await _api.post(
      AppConfig.registerEndpoint,
      body: {
        'email': email,
        'password': password,
        if (name != null) 'name': name,
      },
    );

    if (response.success && response.data != null) {
      final user = User.fromJson(response.data['user']);
      final token = response.data['token'] as String;
      await _api.saveToken(token);
      return AuthResult(success: true, user: user, token: token);
    }

    return AuthResult(
      success: false,
      message: response.message ?? 'Đăng ký thất bại',
    );
  }

  /// Đăng nhập
  Future<AuthResult> login({
    required String email,
    required String password,
  }) async {
    final response = await _api.post(
      AppConfig.loginEndpoint,
      body: {
        'email': email,
        'password': password,
      },
    );

    if (response.success && response.data != null) {
      final user = User.fromJson(response.data['user']);
      final token = response.data['token'] as String;
      await _api.saveToken(token);
      return AuthResult(success: true, user: user, token: token);
    }

    return AuthResult(
      success: false,
      message: response.message ?? 'Đăng nhập thất bại',
    );
  }

  /// Lấy thông tin user hiện tại
  Future<AuthResult> getCurrentUser() async {
    final response = await _api.get(AppConfig.meEndpoint);

    if (response.success && response.data != null) {
      final user = User.fromJson(response.data['user']);
      return AuthResult(success: true, user: user);
    }

    return AuthResult(
      success: false,
      message: response.message ?? 'Không thể lấy thông tin user',
    );
  }

  /// Đăng xuất
  Future<void> logout() async {
    await _api.clearToken();
  }

  /// Kiểm tra đã đăng nhập chưa
  Future<bool> isLoggedIn() async {
    await _api.loadToken();
    return _api.hasToken;
  }
}

/// Kết quả xác thực
class AuthResult {
  final bool success;
  final User? user;
  final String? token;
  final String? message;

  AuthResult({
    required this.success,
    this.user,
    this.token,
    this.message,
  });
}
