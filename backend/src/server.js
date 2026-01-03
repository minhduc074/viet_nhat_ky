const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const config = require('./config');
const prisma = require('./config/prisma');
const { authRoutes, entryRoutes, statsRoutes } = require('./routes');
const { errorHandler, notFound } = require('./middleware');

// Khởi tạo app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Viết Nhật Ký API Docs',
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌟 Viết Nhật Ký API - Micro-journaling Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      entries: '/api/entries',
      stats: '/api/stats',
      docs: '/api-docs'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/stats', statsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Kết nối PostgreSQL thành công!');
    
    app.listen(PORT, () => {
      console.log(`
  🚀 Server đang chạy!
  📍 Local: http://localhost:${PORT}
  🌍 Mode: ${config.nodeEnv}
      `);
    });
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = app;
