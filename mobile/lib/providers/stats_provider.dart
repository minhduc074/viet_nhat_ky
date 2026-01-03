import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/index.dart';

/// Provider quản lý Statistics
class StatsProvider with ChangeNotifier {
  final StatsService _statsService = StatsService();

  MoodStats? _monthlyStats;
  WeeklyStats? _weeklyStats;
  StreakInfo? _streak;
  OverviewStats? _overview;
  bool _isLoading = false;
  String? _error;

  // Getters
  MoodStats? get monthlyStats => _monthlyStats;
  WeeklyStats? get weeklyStats => _weeklyStats;
  StreakInfo? get streak => _streak;
  OverviewStats? get overview => _overview;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Lấy thống kê theo tháng
  Future<void> fetchMonthlyStats({int? year, int? month}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _statsService.getMonthlyStats(
        year: year,
        month: month,
      );

      if (result.success && result.data != null) {
        _monthlyStats = result.data;
      } else {
        _error = result.message;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Lấy thống kê theo tuần
  Future<void> fetchWeeklyStats({DateTime? date}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _statsService.getWeeklyStats(date: date);

      if (result.success && result.data != null) {
        _weeklyStats = result.data;
      } else {
        _error = result.message;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Lấy streak
  Future<void> fetchStreak() async {
    try {
      final result = await _statsService.getStreak();

      if (result.success && result.data != null) {
        _streak = result.data;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
    }
  }

  /// Lấy overview
  Future<void> fetchOverview() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _statsService.getOverview();

      if (result.success && result.data != null) {
        _overview = result.data;
      } else {
        _error = result.message;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Lấy tất cả stats cùng lúc
  Future<void> fetchAllStats() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await Future.wait([
        fetchMonthlyStats(),
        fetchWeeklyStats(),
        fetchStreak(),
        fetchOverview(),
      ]);
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Reset state khi logout
  void reset() {
    _monthlyStats = null;
    _weeklyStats = null;
    _streak = null;
    _overview = null;
    _error = null;
    notifyListeners();
  }
}
