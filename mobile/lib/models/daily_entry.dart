/// Model DailyEntry - Ghi nhận cảm xúc hàng ngày
class DailyEntry {
  final String id;
  final String userId;
  final DateTime date;
  final int moodScore;
  final String? note;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;

  DailyEntry({
    required this.id,
    required this.userId,
    required this.date,
    required this.moodScore,
    this.note,
    this.tags = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory DailyEntry.fromJson(Map<String, dynamic> json) {
    // Parse dates and convert to local timezone (UTC+7)
    final parsedDate = DateTime.parse(json['date']).toLocal();
    final parsedCreatedAt = DateTime.parse(json['createdAt']).toLocal();
    final parsedUpdatedAt = DateTime.parse(json['updatedAt']).toLocal();
    
    return DailyEntry(
      id: json['_id'] ?? json['id'],
      userId: json['userId'],
      date: parsedDate,
      moodScore: json['moodScore'],
      note: json['note'],
      tags: json['tags'] != null ? List<String>.from(json['tags']) : [],
      createdAt: parsedCreatedAt,
      updatedAt: parsedUpdatedAt,
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
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  /// Lấy label theo mood score
  String get moodLabel {
    switch (moodScore) {
      case 1:
        return 'Rất tệ';
      case 2:
        return 'Tệ';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Tốt';
      case 5:
        return 'Tuyệt vời';
      default:
        return 'Không xác định';
    }
  }

  /// Lấy emoji theo mood score
  String get moodEmoji {
    switch (moodScore) {
      case 1:
        return '😢';
      case 2:
        return '😔';
      case 3:
        return '😐';
      case 4:
        return '😊';
      case 5:
        return '😄';
      default:
        return '❓';
    }
  }
}
