// API Configuration
class AppConfig {
  // Change this to your backend URL
  // For Android Emulator use: 10.0.2.2 instead of localhost
  // For iOS Simulator use: localhost
  // For physical device: use your computer's IP address
  static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  // For production
  // static const String baseUrl = 'https://your-domain.com/api';
  
  // Timeout settings
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}

// Mood configuration
class MoodConfig {
  static const List<MoodItem> moods = [
    MoodItem(
      score: 1,
      label: 'Tệ',
      emoji: '😢',
      color: 0xFFE53935,
    ),
    MoodItem(
      score: 2,
      label: 'Không tốt',
      emoji: '😔',
      color: 0xFFFF7043,
    ),
    MoodItem(
      score: 3,
      label: 'Bình thường',
      emoji: '😐',
      color: 0xFFFFCA28,
    ),
    MoodItem(
      score: 4,
      label: 'Tốt',
      emoji: '😊',
      color: 0xFF66BB6A,
    ),
    MoodItem(
      score: 5,
      label: 'Tuyệt vời',
      emoji: '🤩',
      color: 0xFF42A5F5,
    ),
  ];

  static MoodItem getMood(int score) {
    return moods.firstWhere(
      (m) => m.score == score,
      orElse: () => moods[2],
    );
  }
}

class MoodItem {
  final int score;
  final String label;
  final String emoji;
  final int color;

  const MoodItem({
    required this.score,
    required this.label,
    required this.emoji,
    required this.color,
  });
}

// Available tags for mood entries
class TagConfig {
  static const List<String> availableTags = [
    'Công việc',
    'Gia đình',
    'Bạn bè',
    'Sức khỏe',
    'Thể thao',
    'Học tập',
    'Giải trí',
    'Tình yêu',
    'Tài chính',
    'Du lịch',
  ];
}
