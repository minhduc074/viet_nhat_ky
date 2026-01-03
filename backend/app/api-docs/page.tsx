'use client';

const ApiDocsPage = () => {
  const apiSpec = {
    info: {
      title: 'Viết Nhật Ký API',
      version: '2.0.0',
      description: 'API documentation for Micro-journaling application (Next.js)',
    },
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    endpoints: {
      auth: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user',
          body: {
            email: 'string (required)',
            password: 'string (required, min 6 chars)',
            name: 'string (optional)',
          },
          response: '201: User registered successfully',
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Login user',
          body: {
            email: 'string (required)',
            password: 'string (required)',
          },
          response: '200: { token: string, user: {...} }',
        },
        {
          method: 'GET',
          path: '/api/auth/me',
          description: 'Get current user profile',
          auth: 'Bearer token required',
          response: '200: { user: {...} }',
        },
        {
          method: 'PUT',
          path: '/api/auth/me',
          description: 'Update user profile',
          auth: 'Bearer token required',
          body: {
            name: 'string (optional)',
            email: 'string (optional)',
          },
          response: '200: Profile updated',
        },
      ],
      entries: [
        {
          method: 'GET',
          path: '/api/entries',
          description: 'Get entries by month',
          auth: 'Bearer token required',
          params: {
            year: 'integer (required)',
            month: 'integer (required, 1-12)',
          },
          response: '200: { entries: [...] }',
        },
        {
          method: 'POST',
          path: '/api/entries',
          description: 'Create or update entry',
          auth: 'Bearer token required',
          body: {
            note: 'string (required)',
            moodScore: 'integer (required, 1-5)',
            tags: 'string[] (optional)',
            date: 'string (required, ISO date)',
          },
          response: '201: Entry created/updated',
        },
        {
          method: 'GET',
          path: '/api/entries/today',
          description: "Get today's entry",
          auth: 'Bearer token required',
          response: "200: Today's entry",
        },
      ],
      stats: [
        {
          method: 'GET',
          path: '/api/stats/monthly',
          description: 'Get monthly statistics',
          auth: 'Bearer token required',
          params: {
            year: 'integer (required)',
            month: 'integer (required)',
          },
          response: '200: Monthly stats',
        },
        {
          method: 'GET',
          path: '/api/stats/overview',
          description: 'Get overall statistics',
          auth: 'Bearer token required',
          response: '200: Overall statistics',
        },
      ],
    },
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{apiSpec.info.title}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>{apiSpec.info.description}</p>
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '30px' }}>
        <strong>Base URL:</strong> <code>{apiSpec.baseUrl}</code>
      </div>

      {Object.entries(apiSpec.endpoints).map(([category, endpoints]) => (
        <div key={category} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', textTransform: 'capitalize', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
            {category}
          </h2>
          {(endpoints as any[]).map((endpoint, idx) => (
            <div key={idx} style={{ marginBottom: '30px', border: '1px solid #e0e0e0', borderRadius: '5px', padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 10px',
                  backgroundColor: endpoint.method === 'GET' ? '#61affe' : endpoint.method === 'POST' ? '#49cc90' : '#fca130',
                  color: 'white',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  fontSize: '12px'
                }}>
                  {endpoint.method}
                </span>
                <code style={{ fontSize: '16px', fontWeight: '500' }}>{endpoint.path}</code>
              </div>
              <p style={{ marginBottom: '15px', color: '#333' }}>{endpoint.description}</p>
              
              {endpoint.auth && (
                <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '3px', marginBottom: '10px' }}>
                  <strong>🔒 Authorization:</strong> {endpoint.auth}
                </div>
              )}

              {endpoint.params && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Query Parameters:</strong>
                  <pre style={{ backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
                    {JSON.stringify(endpoint.params, null, 2)}
                  </pre>
                </div>
              )}

              {endpoint.body && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Request Body:</strong>
                  <pre style={{ backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
                    {JSON.stringify(endpoint.body, null, 2)}
                  </pre>
                </div>
              )}

              {endpoint.response && (
                <div>
                  <strong>Response:</strong>
                  <div style={{ marginTop: '5px', color: '#28a745' }}>{endpoint.response}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ApiDocsPage;
