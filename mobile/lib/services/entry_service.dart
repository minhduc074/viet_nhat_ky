import 'package:intl/intl.dart';
import '../models/daily_entry.dart';
import '../models/mood_stats.dart';
import 'api_service.dart';

class EntryService {
  final ApiService _api = ApiService();

  // Singleton pattern
  static final EntryService _instance = EntryService._internal();
  factory EntryService() => _instance;
  EntryService._internal();

  // Get today's entry
  Future<DailyEntry?> getTodayEntry() async {
    final response = await _api.get('/entries/today');
    final data = response['data'] as Map<String, dynamic>;
    
    if (data['entry'] != null) {
      return DailyEntry.fromJson(data['entry'] as Map<String, dynamic>);
    }
    return null;
  }

  // Check if user has entry today
  Future<bool> hasEntryToday() async {
    final response = await _api.get('/entries/today');
    final data = response['data'] as Map<String, dynamic>;
    return data['hasEntryToday'] as bool;
  }

  // Create or update entry
  Future<DailyEntry> saveEntry(CreateEntryRequest request) async {
    final response = await _api.post('/entries', body: request.toJson());
    final data = response['data'] as Map<String, dynamic>;
    return DailyEntry.fromJson(data['entry'] as Map<String, dynamic>);
  }

  // Get entries list
  Future<List<DailyEntry>> getEntries({
    String? month, // Format: YYYY-MM
    String? year,
    int limit = 30,
    int offset = 0,
  }) async {
    final queryParams = <String, String>{
      'limit': limit.toString(),
      'offset': offset.toString(),
    };
    
    if (month != null) queryParams['month'] = month;
    if (year != null) queryParams['year'] = year;

    final response = await _api.get('/entries', queryParams: queryParams);
    final data = response['data'] as Map<String, dynamic>;
    final entries = data['entries'] as List<dynamic>;
    
    return entries
        .map((e) => DailyEntry.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  // Get entries for a specific month (for calendar)
  Future<Map<DateTime, DailyEntry>> getEntriesForMonth(DateTime month) async {
    final monthStr = DateFormat('yyyy-MM').format(month);
    final entries = await getEntries(month: monthStr, limit: 31);
    
    final Map<DateTime, DailyEntry> entriesMap = {};
    for (final entry in entries) {
      final dateKey = DateTime(entry.date.year, entry.date.month, entry.date.day);
      entriesMap[dateKey] = entry;
    }
    
    return entriesMap;
  }

  // Get statistics
  Future<MoodStats> getStats({String? month, String? year}) async {
    final queryParams = <String, String>{};
    if (month != null) queryParams['month'] = month;
    if (year != null) queryParams['year'] = year;

    final response = await _api.get('/stats', queryParams: queryParams);
    final data = response['data'] as Map<String, dynamic>;
    return MoodStats.fromJson(data);
  }
}
