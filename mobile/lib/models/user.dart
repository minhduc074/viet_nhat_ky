/// Model User
class User {
  final String id;
  final String email;
  final String? name;
  final String? avatar;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    this.name,
    this.avatar,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'],
      email: json['email'],
      name: json['name'],
      avatar: json['avatar'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'avatar': avatar,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  String get displayName => name ?? email.split('@').first;
}
