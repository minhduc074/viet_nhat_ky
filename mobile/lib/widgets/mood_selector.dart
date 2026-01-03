import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../config/theme.dart';

class MoodSelector extends StatelessWidget {
  final int? selectedMood;
  final ValueChanged<int> onMoodSelected;

  const MoodSelector({
    super.key,
    this.selectedMood,
    required this.onMoodSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: MoodConfig.moods.map((mood) {
        final isSelected = selectedMood == mood.score;
        return GestureDetector(
          onTap: () => onMoodSelected(mood.score),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isSelected
                  ? Color(mood.color).withValues(alpha: 0.2)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
              border: isSelected
                  ? Border.all(color: Color(mood.color), width: 2)
                  : null,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedScale(
                  scale: isSelected ? 1.2 : 1.0,
                  duration: const Duration(milliseconds: 200),
                  child: Text(
                    mood.emoji,
                    style: const TextStyle(fontSize: 40),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  mood.label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected
                        ? Color(mood.color)
                        : AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

class MoodIcon extends StatelessWidget {
  final int moodScore;
  final double size;

  const MoodIcon({
    super.key,
    required this.moodScore,
    this.size = 32,
  });

  @override
  Widget build(BuildContext context) {
    final mood = MoodConfig.getMood(moodScore);
    return Text(
      mood.emoji,
      style: TextStyle(fontSize: size),
    );
  }
}

class MoodBadge extends StatelessWidget {
  final int moodScore;

  const MoodBadge({
    super.key,
    required this.moodScore,
  });

  @override
  Widget build(BuildContext context) {
    final mood = MoodConfig.getMood(moodScore);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Color(mood.color).withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(mood.emoji, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 6),
          Text(
            mood.label,
            style: TextStyle(
              color: Color(mood.color),
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
