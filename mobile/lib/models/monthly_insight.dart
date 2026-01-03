class MonthlyInsight {
  final String insight;
  final String month;
  final int totalEntries;
  final InsightStats? stats;

  MonthlyInsight({
    required this.insight,
    required this.month,
    required this.totalEntries,
    this.stats,
  });

  factory MonthlyInsight.fromJson(Map<String, dynamic> json) {
    return MonthlyInsight(
      insight: json['insight'] as String,
      month: json['month'] as String,
      totalEntries: json['totalEntries'] as int,
      stats: json['stats'] != null
          ? InsightStats.fromJson(json['stats'] as Map<String, dynamic>)
          : null,
    );
  }
}

class InsightStats {
  final double avgMood;
  final Map<String, int> moodDistribution;

  InsightStats({
    required this.avgMood,
    required this.moodDistribution,
  });

  factory InsightStats.fromJson(Map<String, dynamic> json) {
    final distribution = json['moodDistribution'] as Map<String, dynamic>;
    return InsightStats(
      avgMood: (json['avgMood'] as num).toDouble(),
      moodDistribution: distribution.map(
        (key, value) => MapEntry(key, value as int),
      ),
    );
  }
}
