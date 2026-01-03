import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/app_theme.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';

/// Tags có sẵn
const List<String> availableTags = [
  'Công việc',
  'Gia đình',
  'Sức khỏe',
  'Tình yêu',
  'Bạn bè',
  'Thể thao',
  'Học tập',
  'Giải trí',
  'Tài chính',
  'Khác',
];

/// Màn hình chính - Check-in cảm xúc
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int? _selectedMood;
  final _noteController = TextEditingController();
  List<String> _selectedTags = [];
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _loadTodayEntry();
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _loadTodayEntry() async {
    final entryProvider = Provider.of<EntryProvider>(context, listen: false);
    await entryProvider.fetchTodayEntry();
    
    // Nếu đã có entry, set giá trị
    if (entryProvider.todayEntry != null) {
      setState(() {
        _selectedMood = entryProvider.todayEntry!.moodScore;
        _noteController.text = entryProvider.todayEntry!.note ?? '';
        _selectedTags = List.from(entryProvider.todayEntry!.tags);
      });
    }
  }

  void _toggleTag(String tag) {
    setState(() {
      if (_selectedTags.contains(tag)) {
        _selectedTags.remove(tag);
      } else if (_selectedTags.length < 5) {
        _selectedTags.add(tag);
      }
    });
  }

  Future<void> _saveEntry() async {
    if (_selectedMood == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng chọn cảm xúc của bạn'),
          backgroundColor: AppTheme.warningColor,
        ),
      );
      return;
    }

    final entryProvider = Provider.of<EntryProvider>(context, listen: false);
    
    final success = await entryProvider.saveEntry(
      moodScore: _selectedMood!,
      note: _noteController.text.trim().isNotEmpty 
          ? _noteController.text.trim() 
          : null,
      tags: _selectedTags.isNotEmpty ? _selectedTags : null,
    );

    if (!mounted) return;

    if (success) {
      setState(() {
        _isEditing = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Đã lưu cảm xúc! 🎉'),
          backgroundColor: AppTheme.successColor,
        ),
      );
      
      // Refresh stats
      final statsProvider = Provider.of<StatsProvider>(context, listen: false);
      statsProvider.fetchStreak();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(entryProvider.error ?? 'Không thể lưu'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }

  void _startEditing() {
    setState(() {
      _isEditing = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final entryProvider = Provider.of<EntryProvider>(context);
    final statsProvider = Provider.of<StatsProvider>(context);

    return Scaffold(
      body: entryProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadTodayEntry,
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    expandedHeight: 200.0,
                    floating: false,
                    pinned: true,
                    flexibleSpace: FlexibleSpaceBar(
                      background: Container(
                        decoration: const BoxDecoration(
                          gradient: AppTheme.primaryGradient,
                        ),
                        child: SafeArea(
                          child: Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const SizedBox(height: 20),
                                Text(
                                  DateFormat('EEEE, dd/MM/yyyy', 'vi').format(DateTime.now()),
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.white.withOpacity(0.8),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Xin chào,\n${authProvider.user?.displayName ?? 'Bạn'}! 👋',
                                  style: const TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    height: 1.2,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    actions: [
                      IconButton(
                        icon: const Icon(Icons.logout, color: Colors.white),
                        onPressed: () async {
                          await authProvider.logout();
                          if (!mounted) return;
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                      ),
                    ],
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Streak Card
                          if (statsProvider.streak != null)
                            Container(
                              margin: const EdgeInsets.only(bottom: 24),
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppTheme.primaryColor.withOpacity(0.1),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.shade50,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Text(
                                      '🔥',
                                      style: TextStyle(fontSize: 32),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${statsProvider.streak!.currentStreak} ngày liên tiếp',
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.textPrimary,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Kỷ lục: ${statsProvider.streak!.longestStreak} ngày',
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: AppTheme.textSecondary,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),

                          // Main Content
                          if (entryProvider.hasEntryToday && !_isEditing) ...[
                            // Đã ghi - Hiển thị card
                            Container(
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                              decoration: BoxDecoration(
                                color: AppTheme.successColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Icon(Icons.check_circle, color: AppTheme.successColor, size: 20),
                                  SizedBox(width: 8),
                                  Text(
                                    'Bạn đã ghi nhận hôm nay',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: AppTheme.successColor,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            EntryCard(
                              entry: entryProvider.todayEntry!,
                              onEdit: _startEditing,
                            ),
                          ] else ...[
                            // Chưa ghi hoặc đang edit - Hiển thị form
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: Colors.grey.shade100),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Text(
                                    _isEditing 
                                        ? 'Chỉnh sửa cảm xúc'
                                        : 'Hôm nay bạn thế nào?',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 32),

                                  // Mood Selector
                                  MoodSelector(
                                    selectedMood: _selectedMood,
                                    onMoodSelected: (mood) {
                                      setState(() {
                                        _selectedMood = mood;
                                      });
                                    },
                                  ),

                                  const SizedBox(height: 32),

                                  // Note field
                                  TextField(
                                    controller: _noteController,
                                    maxLines: 4,
                                    maxLength: 500,
                                    decoration: InputDecoration(
                                      hintText: 'Viết vài dòng về hôm nay...',
                                      hintStyle: TextStyle(color: Colors.grey.shade400),
                                      alignLabelWithHint: true,
                                    ),
                                  ),

                                  const SizedBox(height: 24),

                                  // Tags
                                  const Text(
                                    'Điều gì ảnh hưởng đến bạn?',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  TagSelector(
                                    availableTags: availableTags,
                                    selectedTags: _selectedTags,
                                    onTagToggle: _toggleTag,
                                  ),

                                  const SizedBox(height: 32),

                                  // Save button
                                  SizedBox(
                                    height: 56,
                                    child: ElevatedButton(
                                      onPressed: entryProvider.isSaving 
                                          ? null 
                                          : _saveEntry,
                                      child: entryProvider.isSaving
                                          ? const SizedBox(
                                              width: 24,
                                              height: 24,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor: AlwaysStoppedAnimation<Color>(
                                                  Colors.white,
                                                ),
                                              ),
                                            )
                                          : Text(_isEditing ? 'Cập nhật nhật ký' : 'Lưu nhật ký'),
                                    ),
                                  ),

                                  if (_isEditing) ...[
                                    const SizedBox(height: 16),
                                    TextButton(
                                      onPressed: () {
                                        setState(() {
                                          _isEditing = false;
                                          // Reset về giá trị cũ
                                          if (entryProvider.todayEntry != null) {
                                            _selectedMood = entryProvider.todayEntry!.moodScore;
                                            _noteController.text = 
                                                entryProvider.todayEntry!.note ?? '';
                                            _selectedTags = 
                                                List.from(entryProvider.todayEntry!.tags);
                                          }
                                        });
                                      },
                                      child: const Text('Hủy bỏ'),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ],
                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
