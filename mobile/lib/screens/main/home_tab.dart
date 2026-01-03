import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/entry_provider.dart';
import '../../widgets/common_widgets.dart';
import '../../widgets/entry_card.dart';
import '../entry/create_entry_screen.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<EntryProvider>(
      builder: (context, entryProvider, child) {
        if (entryProvider.state == EntryState.loading &&
            entryProvider.todayEntry == null) {
          return const LoadingWidget(message: 'Đang tải...');
        }

        return RefreshIndicator(
          onRefresh: () => entryProvider.loadTodayEntry(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Greeting section
                _buildGreetingSection(context),

                // Today's entry or check-in prompt
                if (entryProvider.hasEntryToday)
                  _buildTodayEntry(context, entryProvider)
                else
                  _buildCheckInPrompt(context),

                const SizedBox(height: 24),

                // Quick stats
                _buildQuickStats(context, entryProvider),

                const SizedBox(height: 100),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildGreetingSection(BuildContext context) {
    final hour = DateTime.now().hour;
    String greeting;
    String emoji;

    if (hour < 12) {
      greeting = 'Chào buổi sáng';
      emoji = '🌅';
    } else if (hour < 18) {
      greeting = 'Chào buổi chiều';
      emoji = '☀️';
    } else {
      greeting = 'Chào buổi tối';
      emoji = '🌙';
    }

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$emoji $greeting!',
            style: Theme.of(context).textTheme.headlineLarge,
          ),
          const SizedBox(height: 4),
          Text(
            _getDateString(),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  String _getDateString() {
    final now = DateTime.now();
    final weekdays = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy'
    ];
    final months = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ];

    return '${weekdays[now.weekday % 7]}, ${now.day} ${months[now.month - 1]} ${now.year}';
  }

  Widget _buildTodayEntry(BuildContext context, EntryProvider entryProvider) {
    return TodayEntryCard(
      entry: entryProvider.todayEntry!,
      onEdit: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => CreateEntryScreen(
              existingEntry: entryProvider.todayEntry,
            ),
          ),
        );
      },
    );
  }

  Widget _buildCheckInPrompt(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Text(
                '✨',
                style: TextStyle(fontSize: 48),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Hôm nay bạn thế nào?',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Hãy dành một phút để ghi lại cảm xúc của bạn',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => const CreateEntryScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.add),
              label: const Text('Ghi nhận cảm xúc'),
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats(BuildContext context, EntryProvider entryProvider) {
    final stats = entryProvider.stats;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tổng quan',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context,
                  icon: Icons.local_fire_department,
                  iconColor: AppTheme.warningColor,
                  value: '${stats?.currentStreak ?? 0}',
                  label: 'Chuỗi ngày',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  context,
                  icon: Icons.calendar_today,
                  iconColor: AppTheme.primaryColor,
                  value: '${stats?.totalEntries ?? 0}',
                  label: 'Tổng entries',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  context,
                  icon: Icons.emoji_emotions,
                  iconColor: AppTheme.successColor,
                  value: '${stats?.averageMood.toStringAsFixed(1) ?? '-'}',
                  label: 'TB cảm xúc',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: iconColor, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
