import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/theme.dart';
import '../../models/daily_entry.dart';
import '../../providers/auth_provider.dart';
import '../../providers/entry_provider.dart';
import '../../widgets/mood_selector.dart';
import '../../widgets/tag_selector.dart';

class CreateEntryScreen extends StatefulWidget {
  final DailyEntry? existingEntry;
  final DateTime? initialDate;

  const CreateEntryScreen({
    super.key,
    this.existingEntry,
    this.initialDate,
  });

  @override
  State<CreateEntryScreen> createState() => _CreateEntryScreenState();
}

class _CreateEntryScreenState extends State<CreateEntryScreen> {
  int? _selectedMood;
  final _noteController = TextEditingController();
  List<String> _selectedTags = [];
  bool _isSubmitting = false;
  DateTime _selectedDate = DateTime.now();

  bool get _isEditing => widget.existingEntry != null;

  @override
  void initState() {
    super.initState();
    if (widget.existingEntry != null) {
      _selectedMood = widget.existingEntry!.moodScore;
      _noteController.text = widget.existingEntry!.note ?? '';
      _selectedTags = List.from(widget.existingEntry!.tags);
      _selectedDate = widget.existingEntry!.date;
    } else if (widget.initialDate != null) {
      _selectedDate = widget.initialDate!;
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      locale: const Locale('vi', 'VN'),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_selectedMood == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng chọn cảm xúc của bạn'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    final entryProvider = context.read<EntryProvider>();
    final success = await entryProvider.saveEntry(
      moodScore: _selectedMood!,
      note: _noteController.text.trim().isNotEmpty
          ? _noteController.text.trim()
          : null,
      tags: _selectedTags.isNotEmpty ? _selectedTags : null,
      date: DateFormat('yyyy-MM-dd').format(_selectedDate),
    );

    if (!mounted) return;

    setState(() {
      _isSubmitting = false;
    });

    if (success) {
      // Refresh calendar entries for current month after saving
      await entryProvider.loadEntriesForMonth(entryProvider.selectedMonth);
      
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing
              ? 'Đã cập nhật cảm xúc của bạn'
              : 'Đã lưu cảm xúc của bạn'),
          backgroundColor: AppTheme.successColor,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text(entryProvider.errorMessage ?? 'Đã xảy ra lỗi'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }

  Widget build(BuildContext context) {
    final authProvider = context.read<AuthProvider>();
    final isTestUser = authProvider.user?.email == 'a@abc.com';

    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Chỉnh sửa' : 'Ghi nhận cảm xúc'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Date selector (only for test user)
            if (isTestUser)
              Card(
                child: InkWell(
                  onTap: _selectDate,
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, color: AppTheme.primaryColor),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Ngày',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                DateFormat('EEEE, d MMMM yyyy', 'vi').format(_selectedDate),
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 16),
                      ],
                    ),
                  ),
                ),
              ),
            if (isTestUser) const SizedBox(height: 24),

            // Question
            Text(
              'Hôm nay bạn cảm thấy thế nào?',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),

            // Mood selector
            MoodSelector(
              selectedMood: _selectedMood,
              onMoodSelected: (mood) {
                setState(() {
                  _selectedMood = mood;
                });
              },
            ),
            const SizedBox(height: 32),

            // Note section
            Text(
              'Ghi chú (không bắt buộc)',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _noteController,
              maxLines: 4,
              maxLength: 500,
              decoration: const InputDecoration(
                hintText: 'Viết vài dòng về ngày hôm nay...',
                alignLabelWithHint: true,
              ),
            ),
            const SizedBox(height: 24),

            // Tags section
            Text(
              'Tags (không bắt buộc)',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            TagSelector(
              selectedTags: _selectedTags,
              onTagsChanged: (tags) {
                setState(() {
                  _selectedTags = tags;
                });
              },
            ),
            const SizedBox(height: 48),

            // Submit button
            ElevatedButton(
              onPressed: _isSubmitting ? null : _handleSubmit,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 18),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Text(_isEditing ? 'Cập nhật' : 'Lưu'),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
