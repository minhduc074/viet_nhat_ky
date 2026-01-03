import 'package:flutter/material.dart';
import '../../config/app_theme.dart';

/// Widget chọn cảm xúc
class MoodSelector extends StatelessWidget {
  final int? selectedMood;
  final Function(int) onMoodSelected;

  const MoodSelector({
    super.key,
    this.selectedMood,
    required this.onMoodSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(5, (index) {
            final moodScore = index + 1;
            final isSelected = selectedMood == moodScore;
            final moodColor = AppTheme.getMoodColor(moodScore);
            
            return GestureDetector(
              onTap: () => onMoodSelected(moodScore),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.elasticOut,
                padding: EdgeInsets.all(isSelected ? 16 : 12),
                decoration: BoxDecoration(
                  color: isSelected 
                      ? moodColor.withOpacity(0.2)
                      : Colors.grey.shade50,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected 
                        ? moodColor
                        : Colors.transparent,
                    width: 2,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: moodColor.withOpacity(0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          )
                        ]
                      : [],
                ),
                child: AnimatedScale(
                  scale: isSelected ? 1.1 : 1.0,
                  duration: const Duration(milliseconds: 200),
                  child: Text(
                    AppTheme.getMoodEmoji(moodScore),
                    style: TextStyle(
                      fontSize: isSelected ? 32 : 28,
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 16),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: selectedMood != null
              ? Text(
                  AppTheme.getMoodLabel(selectedMood!),
                  key: ValueKey(selectedMood),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.getMoodColor(selectedMood!),
                  ),
                )
              : const Text(
                  'Chọn cảm xúc của bạn',
                  key: ValueKey('none'),
                  style: TextStyle(
                    fontSize: 16,
                    color: AppTheme.textLight,
                    fontWeight: FontWeight.w500,
                  ),
                ),
        ),
      ],
    );
  }
}
