class DailyEntry {
  final String id;
  final String userId;
  final DateTime date;
  final int moodScore;
  final String? note;
  final List<String> tags;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  DailyEntry({
    required this.id,
    required this.userId,
    required this.date,
    required this.moodScore,
    this.note,
    this.tags = const [],
    this.createdAt,
    this.updatedAt,
  });

  factory DailyEntry.fromJson(Map<String, dynamic> json) {
    return DailyEntry(
      id: json['id'] as String,
      userId: json['userId'] as String,
      date: DateTime.parse(json['date'] as String),
      moodScore: json['moodScore'] as int,
      note: json['note'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'date': date.toIso8601String(),
      'moodScore': moodScore,
      'note': note,
      'tags': tags,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  DailyEntry copyWith({
    String? id,
    String? userId,
    DateTime? date,
    int? moodScore,
    String? note,
    List<String>? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return DailyEntry(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      date: date ?? this.date,
      moodScore: moodScore ?? this.moodScore,
      note: note ?? this.note,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class CreateEntryRequest {
  final int moodScore;
  final String? note;
  final List<String>? tags;
  final String? date;

  CreateEntryRequest({
    required this.moodScore,
    this.note,
    this.tags,
    this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'moodScore': moodScore,
      if (note != null) 'note': note,
      if (tags != null) 'tags': tags,
      if (date != null) 'date': date,
    };
  }
}
