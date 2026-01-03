import 'package:flutter/material.dart';
import '../../config/app_theme.dart';

/// Widget chọn tags
class TagSelector extends StatelessWidget {
  final List<String> availableTags;
  final List<String> selectedTags;
  final Function(String) onTagToggle;
  final int maxTags;

  const TagSelector({
    super.key,
    required this.availableTags,
    required this.selectedTags,
    required this.onTagToggle,
    this.maxTags = 5,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: availableTags.map((tag) {
        final isSelected = selectedTags.contains(tag);
        final canSelect = isSelected || selectedTags.length < maxTags;
        
        return GestureDetector(
          onTap: canSelect ? () => onTagToggle(tag) : null,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 10,
            ),
            decoration: BoxDecoration(
              color: isSelected 
                  ? AppTheme.primaryColor 
                  : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isSelected 
                    ? AppTheme.primaryColor 
                    : Colors.grey.shade300,
                width: 1.5,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: AppTheme.primaryColor.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      )
                    ]
                  : [],
            ),
            child: Text(
              tag,
              style: TextStyle(
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected 
                    ? Colors.white 
                    : (canSelect ? AppTheme.textPrimary : AppTheme.textLight),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
