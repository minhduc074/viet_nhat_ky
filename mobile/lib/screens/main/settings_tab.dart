import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/theme_provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/notification_service.dart' as notif;
import '../auth/login_screen.dart';

class SettingsTab extends StatefulWidget {
  const SettingsTab({super.key});

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  final notif.NotificationService _notificationService = notif.NotificationService();
  bool _notificationsEnabled = false;
  notif.TimeOfDay _notificationTime = const notif.TimeOfDay(hour: 20, minute: 0);

  @override
  void initState() {
    super.initState();
    _loadNotificationSettings();
  }

  Future<void> _loadNotificationSettings() async {
    final enabled = await _notificationService.areNotificationsEnabled();
    final time = await _notificationService.getNotificationTime();
    setState(() {
      _notificationsEnabled = enabled;
      _notificationTime = time;
    });
  }

  Future<void> _toggleNotifications(bool value) async {
    if (value) {
      await _notificationService.enableDailyNotification(_notificationTime);
    } else {
      await _notificationService.disableDailyNotification();
    }
    setState(() {
      _notificationsEnabled = value;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            value
                ? 'Đã bật nhắc nhở hàng ngày'
                : 'Đã tắt nhắc nhở hàng ngày',
          ),
        ),
      );
    }
  }

  Future<void> _selectTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(
        hour: _notificationTime.hour,
        minute: _notificationTime.minute,
      ),
    );

    if (picked != null) {
      final newTime = notif.TimeOfDay(hour: picked.hour, minute: picked.minute);
      setState(() {
        _notificationTime = newTime;
      });

      if (_notificationsEnabled) {
        await _notificationService.enableDailyNotification(newTime);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đã cập nhật thời gian nhắc nhở'),
            ),
          );
        }
      }
    }
  }

  void _handleLogout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc muốn đăng xuất?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
            ),
            child: const Text('Đăng xuất'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await context.read<AuthProvider>().logout();
      if (context.mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final themeProvider = context.watch<ThemeProvider>();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // User Info Card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: AppTheme.primaryColor.withValues(alpha: 0.2),
                  child: const Icon(
                    Icons.person,
                    size: 40,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  authProvider.user?.name ?? 'Người dùng',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  authProvider.user?.email ?? '',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Appearance Section
        Text(
          'GIAO DIỆN',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
        ),
        const SizedBox(height: 12),
        Card(
          child: SwitchListTile(
            secondary: Icon(
              themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode,
              color: AppTheme.primaryColor,
            ),
            title: const Text('Chế độ tối'),
            subtitle: Text(
              themeProvider.isDarkMode ? 'Đang bật' : 'Đang tắt',
            ),
            value: themeProvider.isDarkMode,
            onChanged: (_) => themeProvider.toggleTheme(),
          ),
        ),
        const SizedBox(height: 24),

        // Notifications Section
        Text(
          'THÔNG BÁO',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(
                  Icons.notifications_outlined,
                  color: AppTheme.primaryColor,
                ),
                title: const Text('Nhắc nhở hàng ngày'),
                subtitle: Text(
                  _notificationsEnabled ? 'Đang bật' : 'Đang tắt',
                ),
                trailing: Switch(
                  value: _notificationsEnabled,
                  onChanged: _toggleNotifications,
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(
                  Icons.access_time,
                  color: AppTheme.primaryColor,
                ),
                title: const Text('Thời gian nhắc nhở'),
                subtitle: Text(_notificationTime.toString()),
                trailing: const Icon(Icons.chevron_right),
                enabled: _notificationsEnabled,
                onTap: _notificationsEnabled ? _selectTime : null,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // About Section
        Text(
          'THÔNG TIN',
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: AppTheme.textSecondary,
              ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(
                  Icons.info_outline,
                  color: AppTheme.primaryColor,
                ),
                title: const Text('Phiên bản'),
                subtitle: const Text('1.0.0'),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(
                  Icons.description_outlined,
                  color: AppTheme.primaryColor,
                ),
                title: const Text('Chính sách bảo mật'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // TODO: Show privacy policy
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Logout Button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: ElevatedButton.icon(
            onPressed: () => _handleLogout(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
              foregroundColor: Colors.white,
            ),
            icon: const Icon(Icons.logout),
            label: const Text('Đăng xuất'),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}
