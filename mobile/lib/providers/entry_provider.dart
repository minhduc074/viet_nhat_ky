import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/index.dart';

/// Provider quản lý Daily Entries
class EntryProvider with ChangeNotifier {
  final EntryService _entryService = EntryService();

  DailyEntry? _todayEntry;
  List<DailyEntry> _monthEntries = [];
  bool _isLoading = false;
  bool _isSaving = false;
  String? _error;
  int? _currentYear;
  int? _currentMonth;

  // Getters
  DailyEntry? get todayEntry => _todayEntry;
  List<DailyEntry> get monthEntries => _monthEntries;
  bool get isLoading => _isLoading;
  bool get isSaving => _isSaving;
  // API getTodayEntry chỉ trả về entry nếu hôm nay có
  // Nên chỉ cần kiểm tra _todayEntry != null
  bool get hasEntryToday => _todayEntry != null;
  String? get error => _error;

  /// Lấy entry hôm nay
  Future<void> fetchTodayEntry() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _entryService.getTodayEntry();
      
      debugPrint('fetchTodayEntry - success: ${result.success}, hasEntry: ${result.hasEntry}, entry: ${result.entry}');
      
      if (result.success) {
        _todayEntry = result.entry;
        debugPrint('_todayEntry set to: $_todayEntry');
      } else {
        _error = result.message;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Tạo hoặc cập nhật entry hôm nay
  Future<bool> saveEntry({
    required int moodScore,
    String? note,
    List<String>? tags,
  }) async {
    _isSaving = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _entryService.createOrUpdate(
        moodScore: moodScore,
        note: note,
        tags: tags,
      );

      if (result.success && result.entry != null) {
        _todayEntry = result.entry;
        debugPrint('saveEntry success - _todayEntry set to: $_todayEntry');
        debugPrint('hasEntryToday now: $hasEntryToday');
        
        // Cập nhật trong monthEntries nếu đang xem tháng hiện tại
        final now = DateTime.now();
        if (_currentYear == now.year && _currentMonth == now.month) {
          final entryDate = result.entry!.date;
          final index = _monthEntries.indexWhere(
            (e) => e.date.year == entryDate.year &&
                   e.date.month == entryDate.month &&
                   e.date.day == entryDate.day,
          );
          if (index >= 0) {
            _monthEntries[index] = result.entry!;
          } else {
            _monthEntries.insert(0, result.entry!);
          }
        }
        
        _isSaving = false;
        notifyListeners();
        return true;
      }

      _error = result.message;
      _isSaving = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isSaving = false;
      notifyListeners();
      return false;
    }
  }

  /// Lấy entries theo tháng
  Future<void> fetchEntriesByMonth({int? year, int? month}) async {
    final now = DateTime.now();
    _currentYear = year ?? now.year;
    _currentMonth = month ?? now.month;
    
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _entryService.getEntriesByMonth(
        year: _currentYear,
        month: _currentMonth,
      );

      if (result.success) {
        _monthEntries = result.entries;
      } else {
        _error = result.message;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Lấy entry của một ngày cụ thể từ monthEntries
  DailyEntry? getEntryForDate(DateTime date) {
    try {
      return _monthEntries.firstWhere(
        (e) => e.date.year == date.year &&
               e.date.month == date.month &&
               e.date.day == date.day,
      );
    } catch (e) {
      return null;
    }
  }

  /// Xóa entry
  Future<bool> deleteEntry(String entryId) async {
    try {
      final success = await _entryService.deleteEntry(entryId);
      
      if (success) {
        if (_todayEntry?.id == entryId) {
          _todayEntry = null;
        }
        _monthEntries.removeWhere((e) => e.id == entryId);
        notifyListeners();
      }
      
      return success;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Reset state khi logout
  void reset() {
    _todayEntry = null;
    _monthEntries = [];
    _error = null;
    _currentYear = null;
    _currentMonth = null;
    notifyListeners();
  }
}
