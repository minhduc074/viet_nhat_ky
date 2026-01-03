import '../config/app_config.dart';
import '../models/index.dart';
import 'api_service.dart';

/// Service xử lý Statistics
class StatsService {
  final ApiService _api = ApiService();

  /// Lấy thống kê theo tháng
  Future<StatsResult<MoodStats>> getMonthlyStats({int? year, int? month}) async {
    final now = DateTime.now();
    final queryParams = {
      'year': (year ?? now.year).toString(),
      'month': (month ?? now.month).toString(),
    };

    final response = await _api.get(
      AppConfig.statsMonthlyEndpoint,
      queryParams: queryParams,
    );

    if (response.success && response.data != null) {
      final stats = MoodStats.fromJson(response.data['stats']);
      return StatsResult(success: true, data: stats);
    }

    return StatsResult(
      success: false,
      message: response.message ?? 'Không thể lấy thống kê tháng',
    );
  }

  /// Lấy thống kê theo tuần
  Future<StatsResult<WeeklyStats>> getWeeklyStats({DateTime? date}) async {
    final queryParams = <String, String>{};
    if (date != null) {
      queryParams['date'] = date.toIso8601String().split('T')[0];
    }

    final response = await _api.get(
      AppConfig.statsWeeklyEndpoint,
      queryParams: queryParams.isNotEmpty ? queryParams : null,
    );

    if (response.success && response.data != null) {
      final stats = WeeklyStats.fromJson(response.data);
      return StatsResult(success: true, data: stats);
    }

    return StatsResult(
      success: false,
      message: response.message ?? 'Không thể lấy thống kê tuần',
    );
  }

  /// Lấy streak
  Future<StatsResult<StreakInfo>> getStreak() async {
    final response = await _api.get(AppConfig.statsStreakEndpoint);

    if (response.success && response.data != null) {
      final streak = StreakInfo.fromJson(response.data);
      return StatsResult(success: true, data: streak);
    }

    return StatsResult(
      success: false,
      message: response.message ?? 'Không thể lấy streak',
    );
  }

  /// Lấy overview
  Future<StatsResult<OverviewStats>> getOverview() async {
    final response = await _api.get(AppConfig.statsOverviewEndpoint);

    if (response.success && response.data != null) {
      final overview = OverviewStats.fromJson(response.data);
      return StatsResult(success: true, data: overview);
    }

    return StatsResult(
      success: false,
      message: response.message ?? 'Không thể lấy overview',
    );
  }
}

/// Generic result cho stats
class StatsResult<T> {
  final bool success;
  final T? data;
  final String? message;

  StatsResult({
    required this.success,
    this.data,
    this.message,
  });
}
