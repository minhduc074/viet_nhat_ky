class MoodStats {
  final String period;
  final int totalEntries;
  final double averageMood;
  final int currentStreak;
  final List<MoodDistribution> moodDistribution;
  final List<TagFrequency> topTags;

  MoodStats({
    required this.period,
    required this.totalEntries,
    required this.averageMood,
    required this.currentStreak,
    required this.moodDistribution,
    required this.topTags,
  });

  factory MoodStats.fromJson(Map<String, dynamic> json) {
    return MoodStats(
      period: json['period'] as String,
      totalEntries: json['totalEntries'] as int,
      averageMood: (json['averageMood'] as num).toDouble(),
      currentStreak: json['currentStreak'] as int,
      moodDistribution: (json['moodDistribution'] as List<dynamic>)
          .map((e) => MoodDistribution.fromJson(e as Map<String, dynamic>))
          .toList(),
      topTags: (json['topTags'] as List<dynamic>)
          .map((e) => TagFrequency.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class MoodDistribution {
  final int score;
  final String label;
  final int count;
  final int percentage;

  MoodDistribution({
    required this.score,
    required this.label,
    required this.count,
    required this.percentage,
  });

  factory MoodDistribution.fromJson(Map<String, dynamic> json) {
    return MoodDistribution(
      score: json['score'] as int,
      label: json['label'] as String,
      count: json['count'] as int,
      percentage: json['percentage'] as int,
    );
  }
}

class TagFrequency {
  final String tag;
  final int count;

  TagFrequency({
    required this.tag,
    required this.count,
  });

  factory TagFrequency.fromJson(Map<String, dynamic> json) {
    return TagFrequency(
      tag: json['tag'] as String,
      count: json['count'] as int,
    );
  }
}
