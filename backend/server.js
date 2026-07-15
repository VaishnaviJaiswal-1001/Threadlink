require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
require('./config/passport'); // Initialize passport strategy

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const activityRoutes = require('./routes/activityRoutes');
const emailRoutes = require('./routes/emailRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const gcalRoutes = require('./routes/gcalRoutes');
const { swaggerUi, swaggerDocs } = require('./swagger');

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());

// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/gcal', gcalRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ThreadLink Backend Running"
    });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:8080' }
});

app.set('io', io); // make io accessible in express req.app.get('io')

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id} for user: ${socket.user.id}`);
  socket.join(`user:${socket.user.id}`);

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

const { startMailbot } = require('./services/mailbotService');

const PORT = process.env.PORT || 5000;

// Initialize background services
startMailbot();

httpServer.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});
