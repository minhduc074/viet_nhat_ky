import '../config/app_config.dart';
import '../models/index.dart';
import 'api_service.dart';

/// Service xử lý Daily Entries
class EntryService {
  final ApiService _api = ApiService();

  /// Tạo hoặc cập nhật entry hôm nay
  Future<EntryResult> createOrUpdate({
    required int moodScore,
    String? note,
    List<String>? tags,
  }) async {
    final response = await _api.post(
      AppConfig.entriesEndpoint,
      body: {
        'moodScore': moodScore,
        if (note != null) 'note': note,
        if (tags != null) 'tags': tags,
      },
    );

    if (response.success && response.data != null) {
      final entry = DailyEntry.fromJson(response.data['entry']);
      return EntryResult(success: true, entry: entry);
    }

    return EntryResult(
      success: false,
      message: response.message ?? 'Không thể lưu cảm xúc',
    );
  }

  /// Lấy entry hôm nay
  Future<EntryResult> getTodayEntry() async {
    final response = await _api.get(AppConfig.todayEntryEndpoint);

    if (response.success && response.data != null) {
      final hasEntry = response.data['hasEntry'] ?? false;
      DailyEntry? entry;
      
      if (hasEntry && response.data['entry'] != null) {
        entry = DailyEntry.fromJson(response.data['entry']);
      }
      
      return EntryResult(
        success: true,
        entry: entry,
        hasEntry: hasEntry,
      );
    }

    return EntryResult(
      success: false,
      message: response.message ?? 'Không thể lấy entry hôm nay',
    );
  }

  /// Lấy danh sách entries theo tháng
  Future<EntriesResult> getEntriesByMonth({int? year, int? month}) async {
    final now = DateTime.now();
    final queryParams = {
      'year': (year ?? now.year).toString(),
      'month': (month ?? now.month).toString(),
    };

    final response = await _api.get(
      AppConfig.entriesEndpoint,
      queryParams: queryParams,
    );

    if (response.success && response.data != null) {
      final entries = (response.data['entries'] as List)
          .map((e) => DailyEntry.fromJson(e))
          .toList();
      
      return EntriesResult(
        success: true,
        entries: entries,
        year: response.data['year'],
        month: response.data['month'],
      );
    }

    return EntriesResult(
      success: false,
      message: response.message ?? 'Không thể lấy danh sách entries',
    );
  }

  /// Lấy entries theo khoảng ngày
  Future<EntriesResult> getEntriesByRange({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final queryParams = {
      'startDate': startDate.toIso8601String().split('T')[0],
      'endDate': endDate.toIso8601String().split('T')[0],
    };

    final response = await _api.get(
      '${AppConfig.entriesEndpoint}/range',
      queryParams: queryParams,
    );

    if (response.success && response.data != null) {
      final entries = (response.data['entries'] as List)
          .map((e) => DailyEntry.fromJson(e))
          .toList();
      
      return EntriesResult(success: true, entries: entries);
    }

    return EntriesResult(
      success: false,
      message: response.message ?? 'Không thể lấy entries',
    );
  }

  /// Xóa entry
  Future<bool> deleteEntry(String entryId) async {
    final response = await _api.delete('${AppConfig.entriesEndpoint}/$entryId');
    return response.success;
  }
}

/// Kết quả cho single entry
class EntryResult {
  final bool success;
  final DailyEntry? entry;
  final bool hasEntry;
  final String? message;

  EntryResult({
    required this.success,
    this.entry,
    this.hasEntry = false,
    this.message,
  });
}

/// Kết quả cho danh sách entries
class EntriesResult {
  final bool success;
  final List<DailyEntry> entries;
  final int? year;
  final int? month;
  final String? message;

  EntriesResult({
    required this.success,
    this.entries = const [],
    this.year,
    this.month,
    this.message,
  });
}
