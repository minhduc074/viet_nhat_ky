import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/daily_entry.dart';
import '../models/mood_stats.dart';
import '../services/entry_service.dart';

enum EntryState { initial, loading, loaded, error }

class EntryProvider extends ChangeNotifier {
  final EntryService _entryService = EntryService();

  EntryState _state = EntryState.initial;
  DailyEntry? _todayEntry;
  List<DailyEntry> _entries = [];
  Map<DateTime, DailyEntry> _calendarEntries = {};
  MoodStats? _stats;
  String? _errorMessage;
  DateTime _selectedMonth = DateTime.now();

  EntryState get state => _state;
  DailyEntry? get todayEntry => _todayEntry;
  List<DailyEntry> get entries => _entries;
  Map<DateTime, DailyEntry> get calendarEntries => _calendarEntries;
  MoodStats? get stats => _stats;
  String? get errorMessage => _errorMessage;
  DateTime get selectedMonth => _selectedMonth;
  bool get hasEntryToday => _todayEntry != null;

  // Load today's entry
  Future<void> loadTodayEntry() async {
    _state = EntryState.loading;
    notifyListeners();

    try {
      _todayEntry = await _entryService.getTodayEntry();
      _state = EntryState.loaded;
    } catch (e) {
      _state = EntryState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  // Save entry (create or update)
  Future<bool> saveEntry({
    required int moodScore,
    String? note,
    List<String>? tags,
    String? date,
  }) async {
    _state = EntryState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final request = CreateEntryRequest(
        moodScore: moodScore,
        note: note,
        tags: tags,
        date: date,
      );

      final entry = await _entryService.saveEntry(request);
      
      // If saving for today, update today's entry
      final today = DateTime.now();
      if (date == null || date == DateFormat('yyyy-MM-dd').format(today)) {
        _todayEntry = entry;
      }

      // Update calendar entries
      final dateKey = DateTime(entry.date.year, entry.date.month, entry.date.day);
      _calendarEntries[dateKey] = entry;

      // Reload stats to reflect the new entry
      await loadStats();

      _state = EntryState.loaded;
      notifyListeners();
      return true;
    } catch (e) {
      _state = EntryState.error;
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Load entries for calendar
  Future<void> loadEntriesForMonth(DateTime month) async {
    _selectedMonth = month;
    
    try {
      _calendarEntries = await _entryService.getEntriesForMonth(month);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
    }
  }

  // Load recent entries
  Future<void> loadEntries({int limit = 30}) async {
    _state = EntryState.loading;
    notifyListeners();

    try {
      _entries = await _entryService.getEntries(limit: limit);
      _state = EntryState.loaded;
    } catch (e) {
      _state = EntryState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  // Load statistics
  Future<void> loadStats({String? month, String? year}) async {
    try {
      _stats = await _entryService.getStats(month: month, year: year);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
    }
  }

  // Refresh all data
  Future<void> refreshAll() async {
    await Future.wait([
      loadTodayEntry(),
      loadEntriesForMonth(_selectedMonth),
      loadStats(),
    ]);
  }

  // Clear error
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Get entry for a specific date
  DailyEntry? getEntryForDate(DateTime date) {
    final dateKey = DateTime(date.year, date.month, date.day);
    return _calendarEntries[dateKey];
  }
}
