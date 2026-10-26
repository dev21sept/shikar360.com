import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Shikhar360 Backend' });
});

// API routes
app.use('/api', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    // Sync models — plain sync only creates missing tables, it never alters
    // existing ones. `alter: true` on SQLite recreates/copies tables on every
    // restart and has been observed to silently drop rows in join tables
    // (e.g. UserRoles), which breaks role-based login after a restart.
    await sequelize.sync();
    console.log('✅ Database tables synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Shikhar360 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failure:', error);
  }
};

startServer();
