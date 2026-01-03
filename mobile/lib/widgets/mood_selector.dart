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
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: MoodConfig.moods.map((mood) {
          final isSelected = selectedMood == mood.score;
          return GestureDetector(
            onTap: () => onMoodSelected(mood.score),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutBack,
              margin: const EdgeInsets.symmetric(horizontal: 6),
              padding: EdgeInsets.all(isSelected ? 12 : 8),
              decoration: BoxDecoration(
                color: isSelected
                    ? Color(mood.color).withValues(alpha: 0.15)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                border: isSelected
                    ? Border.all(color: Color(mood.color), width: 2)
                    : Border.all(color: Colors.transparent, width: 2),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: Color(mood.color).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        )
                      ]
                    : [],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedScale(
                    scale: isSelected ? 1.2 : 1.0,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.elasticOut,
                    child: Text(
                      mood.emoji,
                      style: const TextStyle(fontSize: 36),
                    ),
                  ),
                  const SizedBox(height: 8),
                  AnimatedDefaultTextStyle(
                    duration: const Duration(milliseconds: 200),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight:
                          isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected
                          ? Color(mood.color)
                          : AppTheme.textSecondary,
                      fontFamily: 'Nunito', // Ensure font consistency
                    ),
                    child: Text(mood.label),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
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
