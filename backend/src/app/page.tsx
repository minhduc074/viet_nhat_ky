export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🌟 Viết Nhật Ký API</h1>
        <p className="text-xl mb-8">Backend API cho ứng dụng Micro-journaling</p>
        
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
          <ul className="text-left space-y-2">
            <li>📝 POST /api/auth/register</li>
            <li>🔐 POST /api/auth/login</li>
            <li>👤 GET /api/auth/me</li>
            <li>📅 GET /api/entries/today</li>
            <li>📋 GET /api/entries</li>
            <li>✍️ POST /api/entries</li>
            <li>📊 GET /api/stats</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
