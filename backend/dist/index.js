import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import jobsRoutes from './routes/jobs';
import profileRoutes from './routes/profile';
import recruiterProfileRoutes from './routes/recruiter-profile';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recruiter-profile', recruiterProfileRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`📝 API documentation: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map