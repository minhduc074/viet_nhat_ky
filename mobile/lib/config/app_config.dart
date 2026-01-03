/// Cấu hình ứng dụng
class AppConfig {
  // API Base URL - Đổi thành địa chỉ server của bạn
  // static const String baseUrl = 'http://10.0.2.2:3000'; // Android Emulator
  // static const String baseUrl = 'http://localhost:3000'; // iOS Simulator
  static const String baseUrl = 'https://viet-nhat-ky.vercel.app/'; // TODO: Change to your server IP
  
  // API Endpoints
  static const String apiVersion = '/api';
  
  // Auth
  static const String loginEndpoint = '$apiVersion/auth/login';
  static const String registerEndpoint = '$apiVersion/auth/register';
  static const String meEndpoint = '$apiVersion/auth/me';
  
  // Entries
  static const String entriesEndpoint = '$apiVersion/entries';
  static const String todayEntryEndpoint = '$apiVersion/entries/today';
  
  // Stats
  static const String statsMonthlyEndpoint = '$apiVersion/stats/monthly';
  static const String statsWeeklyEndpoint = '$apiVersion/stats/weekly';
  static const String statsStreakEndpoint = '$apiVersion/stats/streak';
  static const String statsOverviewEndpoint = '$apiVersion/stats/overview';
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  
  // App Info
  static const String appName = 'Viết Nhật Ký';
  static const String appVersion = '1.0.0';
}
