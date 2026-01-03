/// Model cho thống kê
class MoodStats {
  final int totalEntries;
  final double averageMood;
  final Map<int, int> moodDistribution;
  final Map<String, int> tagStats;

  MoodStats({
    required this.totalEntries,
    required this.averageMood,
    required this.moodDistribution,
    required this.tagStats,
  });

  factory MoodStats.fromJson(Map<String, dynamic> json) {
    return MoodStats(
      totalEntries: json['totalEntries'] ?? 0,
      averageMood: (json['averageMood'] ?? 0).toDouble(),
      moodDistribution: json['moodDistribution'] != null
          ? Map<int, int>.from(
              (json['moodDistribution'] as Map).map(
                (key, value) => MapEntry(int.parse(key.toString()), value as int),
              ),
            )
          : {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
      tagStats: json['tagStats'] != null
          ? Map<String, int>.from(json['tagStats'])
          : {},
    );
  }
}

/// Model cho thống kê tuần
class WeeklyStats {
  final List<WeekDay> weekDays;
  final int totalEntries;
  final double averageMood;
  final String startDate;
  final String endDate;

  WeeklyStats({
    required this.weekDays,
    required this.totalEntries,
    required this.averageMood,
    required this.startDate,
    required this.endDate,
  });

  factory WeeklyStats.fromJson(Map<String, dynamic> json) {
    return WeeklyStats(
      weekDays: json['weekDays'] != null
          ? (json['weekDays'] as List)
              .map((e) => WeekDay.fromJson(e))
              .toList()
          : [],
      totalEntries: json['totalEntries'] ?? 0,
      averageMood: (json['averageMood'] ?? 0).toDouble(),
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
    );
  }
}

/// Model cho ngày trong tuần
class WeekDay {
  final String date;
  final String dayName;
  final int? moodScore;
  final bool hasEntry;

  WeekDay({
    required this.date,
    required this.dayName,
    this.moodScore,
    required this.hasEntry,
  });

  factory WeekDay.fromJson(Map<String, dynamic> json) {
    return WeekDay(
      date: json['date'],
      dayName: json['dayName'],
      moodScore: json['moodScore'],
      hasEntry: json['hasEntry'] ?? false,
    );
  }
}

/// Model cho streak
class StreakInfo {
  final int currentStreak;
  final int longestStreak;

  StreakInfo({
    required this.currentStreak,
    required this.longestStreak,
  });

  factory StreakInfo.fromJson(Map<String, dynamic> json) {
    return StreakInfo(
      currentStreak: json['currentStreak'] ?? 0,
      longestStreak: json['longestStreak'] ?? 0,
    );
  }
}

/// Model cho overview
class OverviewStats {
  final int totalEntries;
  final DateTime? firstEntryDate;
  final double averageMood;
  final List<TagStat> topTags;
  final Map<int, int> moodDistribution;

  OverviewStats({
    required this.totalEntries,
    this.firstEntryDate,
    required this.averageMood,
    required this.topTags,
    required this.moodDistribution,
  });

  factory OverviewStats.fromJson(Map<String, dynamic> json) {
    return OverviewStats(
      totalEntries: json['totalEntries'] ?? 0,
      firstEntryDate: json['firstEntryDate'] != null
          ? DateTime.parse(json['firstEntryDate'])
          : null,
      averageMood: (json['averageMood'] ?? 0).toDouble(),
      topTags: json['topTags'] != null
          ? (json['topTags'] as List)
              .map((e) => TagStat.fromJson(e))
              .toList()
          : [],
      moodDistribution: json['moodDistribution'] != null
          ? Map<int, int>.from(
              (json['moodDistribution'] as Map).map(
                (key, value) => MapEntry(int.parse(key.toString()), value as int),
              ),
            )
          : {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
    );
  }
}

/// Model cho tag stat
class TagStat {
  final String tag;
  final int count;

  TagStat({
    required this.tag,
    required this.count,
  });

  factory TagStat.fromJson(Map<String, dynamic> json) {
    return TagStat(
      tag: json['tag'],
      count: json['count'],
    );
  }
}
