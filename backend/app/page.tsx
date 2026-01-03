export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🌟 Viết Nhật Ký API</h1>
      <p>Micro-journaling Backend - Next.js API</p>
      <p>Version: 2.0.0</p>
      <h2>API Endpoints:</h2>
      <ul>
        <li><a href="/api">/api</a> - API Info</li>
        <li><a href="/api-docs">/api-docs</a> - API Documentation (Swagger)</li>
        <li>/api/auth/register - Register</li>
        <li>/api/auth/login - Login</li>
        <li>/api/auth/me - Get/Update Profile</li>
        <li>/api/entries - Journal Entries</li>
        <li>/api/stats - Statistics</li>
      </ul>
    </div>
  );
}
