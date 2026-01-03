// Mood configuration
export const MOODS = [
  { score: 1, label: 'Tệ', emoji: '😢', color: '#ef4444', bgColor: '#fef2f2' },
  { score: 2, label: 'Không tốt', emoji: '😕', color: '#f97316', bgColor: '#fff7ed' },
  { score: 3, label: 'Bình thường', emoji: '😐', color: '#eab308', bgColor: '#fefce8' },
  { score: 4, label: 'Tốt', emoji: '😊', color: '#22c55e', bgColor: '#f0fdf4' },
  { score: 5, label: 'Tuyệt vời', emoji: '😄', color: '#06b6d4', bgColor: '#ecfeff' },
]

export function getMood(score: number) {
  return MOODS.find(m => m.score === score) || MOODS[2]
}

export function getMoodColor(score: number) {
  return getMood(score).color
}

// Default tags
export const DEFAULT_TAGS = [
  'Công việc',
  'Gia đình',
  'Bạn bè',
  'Sức khỏe',
  'Học tập',
  'Giải trí',
  'Tình yêu',
  'Tài chính',
]
