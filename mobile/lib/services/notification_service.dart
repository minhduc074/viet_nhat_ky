import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  static const String _enabledKey = 'notifications_enabled';
  static const String _timeKey = 'notification_time';
  static const int _dailyNotificationId = 0;

  // Initialize notification service
  Future<void> initialize() async {
    tz.initializeTimeZones();

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Request permissions for iOS
    await _notifications
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );

    // Request permissions for Android 13+
    await _notifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
  }

  // Handle notification tap
  void _onNotificationTapped(NotificationResponse response) {
    // TODO: Navigate to entry creation screen
    print('Notification tapped: ${response.payload}');
  }

  // Check if notifications are enabled
  Future<bool> areNotificationsEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_enabledKey) ?? false;
  }

  // Get notification time
  Future<TimeOfDay> getNotificationTime() async {
    final prefs = await SharedPreferences.getInstance();
    final timeString = prefs.getString(_timeKey) ?? '20:00';
    final parts = timeString.split(':');
    return TimeOfDay(
      hour: int.parse(parts[0]),
      minute: int.parse(parts[1]),
    );
  }

  // Enable daily notifications
  Future<void> enableDailyNotification(TimeOfDay time) async {
    await _cancelDailyNotification();

    final now = DateTime.now();
    var scheduledDate = DateTime(
      now.year,
      now.month,
      now.day,
      time.hour,
      time.minute,
    );

    // If the time has passed today, schedule for tomorrow
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }

    await _notifications.zonedSchedule(
      _dailyNotificationId,
      'Viết nhật ký hôm nay 📔',
      'Hãy dành vài phút để ghi lại cảm xúc của bạn!',
      tz.TZDateTime.from(scheduledDate, tz.local),
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'daily_reminder',
          'Nhắc nhở hàng ngày',
          channelDescription: 'Nhắc nhở viết nhật ký mỗi ngày',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );

    // Save settings
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_enabledKey, true);
    await prefs.setString(_timeKey, '${time.hour}:${time.minute}');
  }

  // Disable daily notifications
  Future<void> disableDailyNotification() async {
    await _cancelDailyNotification();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_enabledKey, false);
  }

  // Cancel notification
  Future<void> _cancelDailyNotification() async {
    await _notifications.cancel(_dailyNotificationId);
  }

  // Show instant test notification
  Future<void> showTestNotification() async {
    await _notifications.show(
      999,
      'Thông báo thử nghiệm',
      'Thông báo đang hoạt động! 🎉',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'test',
          'Test',
          channelDescription: 'Test notifications',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
    );
  }
}

class TimeOfDay {
  final int hour;
  final int minute;

  const TimeOfDay({required this.hour, required this.minute});

  @override
  String toString() {
    return '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }
}
