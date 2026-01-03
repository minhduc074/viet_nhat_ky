'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false }) as any;

export const dynamic = 'force-dynamic';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Viết Nhật Ký API',
    version: '2.0.0',
    description: 'API documentation for Micro-journaling application (Next.js)',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://your-app.vercel.app',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Authentication'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profile updated' },
        },
      },
    },
    '/api/entries': {
      get: {
        tags: ['Entries'],
        summary: 'Get entries by month',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'month', in: 'query', required: true, schema: { type: 'integer', minimum: 1, maximum: 12 } },
        ],
        responses: {
          '200': { description: 'List of entries' },
        },
      },
      post: {
        tags: ['Entries'],
        summary: 'Create or update entry',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content', 'moodScore', 'date'],
                properties: {
                  content: { type: 'string' },
                  moodScore: { type: 'integer', minimum: 1, maximum: 5 },
                  tags: { type: 'array', items: { type: 'string' } },
                  date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Entry created/updated' },
        },
      },
    },
    '/api/entries/today': {
      get: {
        tags: ['Entries'],
        summary: "Get today's entry",
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: "Today's entry" },
        },
      },
    },
    '/api/stats/monthly': {
      get: {
        tags: ['Statistics'],
        summary: 'Get monthly statistics',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'month', in: 'query', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Monthly stats' },
        },
      },
    },
    '/api/stats/overview': {
      get: {
        tags: ['Statistics'],
        summary: 'Get overall statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Overall statistics' },
        },
      },
    },
  },
};

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading API Documentation...</div>;
  }

  return (
    <div>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}
