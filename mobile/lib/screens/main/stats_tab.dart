import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../providers/entry_provider.dart';
import '../../widgets/common_widgets.dart';
import '../../models/monthly_insight.dart';
import '../../services/api_service.dart';
import '../../providers/auth_provider.dart';

class StatsTab extends StatefulWidget {
  const StatsTab({super.key});

  @override
  State<StatsTab> createState() => _StatsTabState();
}

class _StatsTabState extends State<StatsTab> {
  DateTime _selectedMonth = DateTime.now();
  MonthlyInsight? _monthlyInsight;
  bool _isLoadingInsight = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStats();
    });
  }

  void _loadStats() {
    final monthStr = DateFormat('yyyy-MM').format(_selectedMonth);
    context.read<EntryProvider>().loadStats(month: monthStr);
  }

  Future<void> _loadMonthlyInsight() async {
    setState(() {
      _isLoadingInsight = true;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      if (!authProvider.isAuthenticated) return;

      final monthString = DateFormat('yyyy-MM').format(_selectedMonth);
      final response = await ApiService().getMonthlyInsights(monthString);

      if (response['success'] == true && response['data'] != null) {
        final data = response['data'] as Map<String, dynamic>;
        setState(() {
          _monthlyInsight = MonthlyInsight.fromJson(data);
          _isLoadingInsight = false;
        });
      } else {
        setState(() {
          _isLoadingInsight = false;
        });
      }
    } catch (e) {
      print('Error loading monthly insight: $e');
      setState(() {
        _isLoadingInsight = false;
      });
    }
  }

  void _changeMonth(int delta) {
    setState(() {
      _selectedMonth = DateTime(
        _selectedMonth.year,
        _selectedMonth.month + delta,
      );
      _monthlyInsight = null;
      _isLoadingInsight = false;
    });
    _loadStats();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<EntryProvider>(
      builder: (context, entryProvider, child) {
        final stats = entryProvider.stats;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Month selector
              _buildMonthSelector(context),
              const SizedBox(height: 24),

              if (stats == null)
                const LoadingWidget(message: 'Đang tải thống kê...')
                else ...[
                // Overview cards
                _buildOverviewCards(context, stats.totalEntries,
                  stats.averageMood, stats.currentStreak),
                const SizedBox(height: 24),

                // Mood distribution chart
                _buildMoodDistributionChart(context, entryProvider),
                const SizedBox(height: 24),

                // Top tags
                if (stats.topTags.isNotEmpty) _buildTopTags(context, stats),
                const SizedBox(height: 24),

                // AI Insights Button
                Center(
                  child: ElevatedButton.icon(
                  onPressed: _monthlyInsight == null && !_isLoadingInsight
                    ? _loadMonthlyInsight
                    : null,
                  icon: const Icon(Icons.psychology),
                  label: const Text('Xem phân tích cho tháng này'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                    ),
                  ),
                  ),
                ),
                const SizedBox(height: 24),

                // Hint card: chỉ hướng dẫn người dùng nhấn nút để hiển thị phân tích AI
                if (!_isLoadingInsight && _monthlyInsight == null)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Center(
                        child: Text(
                          'Nhấn nút "Xem phân tích cho tháng này" để tạo phân tích AI.',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppTheme.textSecondary,
                              ),
                        ),
                      ),
                    ),
                  ),
                if (_monthlyInsight != null || _isLoadingInsight)
                  _buildAIInsights(context),
                
                const SizedBox(height: 100),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildAIInsights(BuildContext context) {
    if (_isLoadingInsight) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(
                'Đang tạo phân tích AI...',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.textSecondary,
                    ),
              ),
            ],
          ),
        ),
      );
    }

    if (_monthlyInsight == null) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              AppTheme.primaryColor.withValues(alpha: 0.05),
              Colors.white,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.psychology,
                    color: AppTheme.primaryColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Phân tích từ AI',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              _monthlyInsight!.insight,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    height: 1.6,
                    color: AppTheme.textPrimary,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthSelector(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              onPressed: () => _changeMonth(-1),
              icon: const Icon(Icons.chevron_left),
            ),
            const SizedBox(width: 16),
            Text(
              DateFormat('MMMM yyyy', 'vi').format(_selectedMonth),
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(width: 16),
            IconButton(
              onPressed: _selectedMonth.month == DateTime.now().month &&
                      _selectedMonth.year == DateTime.now().year
                  ? null
                  : () => _changeMonth(1),
              icon: const Icon(Icons.chevron_right),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewCards(
    BuildContext context,
    int totalEntries,
    double averageMood,
    int streak,
  ) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            context,
            icon: Icons.edit_calendar,
            iconColor: AppTheme.primaryColor,
            value: totalEntries.toString(),
            label: 'Số ngày ghi',
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            context,
            icon: Icons.emoji_emotions,
            iconColor: AppTheme.getMoodColor(averageMood.round()),
            value: averageMood.toStringAsFixed(1),
            label: 'Điểm TB',
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            context,
            icon: Icons.local_fire_department,
            iconColor: AppTheme.warningColor,
            value: streak.toString(),
            label: 'Chuỗi ngày',
          ),
        ),
      ],
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
            Icon(icon, color: iconColor, size: 32),
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

  Widget _buildMoodDistributionChart(
      BuildContext context, EntryProvider entryProvider) {
    final stats = entryProvider.stats;
    if (stats == null || stats.totalEntries == 0) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Icon(
                Icons.pie_chart_outline,
                size: 64,
                color: AppTheme.textLight,
              ),
              const SizedBox(height: 16),
              Text(
                'Chưa có dữ liệu',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppTheme.textSecondary,
                    ),
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Phân bố cảm xúc',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: stats.moodDistribution
                      .where((d) => d.count > 0)
                      .map((dist) {
                    final mood = MoodConfig.getMood(dist.score);
                    return PieChartSectionData(
                      value: dist.count.toDouble(),
                      color: Color(mood.color),
                      title: '${dist.percentage}%',
                      titleStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      radius: 60,
                    );
                  }).toList(),
                  sectionsSpace: 2,
                  centerSpaceRadius: 40,
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Legend
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: stats.moodDistribution.map((dist) {
                final mood = MoodConfig.getMood(dist.score);
                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Color(mood.color),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${mood.emoji} ${dist.label} (${dist.count})',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopTags(BuildContext context, stats) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tags phổ biến',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            ...stats.topTags.map((tagFreq) {
              final maxCount = stats.topTags.first.count;
              final percentage = maxCount > 0 ? tagFreq.count / maxCount : 0.0;

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '#${tagFreq.tag}',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Text(
                          '${tagFreq.count} lần',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: percentage,
                        backgroundColor: Colors.grey.shade200,
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          AppTheme.primaryColor,
                        ),
                        minHeight: 8,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
