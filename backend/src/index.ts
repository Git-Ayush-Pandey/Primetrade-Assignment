import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import morgan from 'morgan';

import { PORT, MONGO_URI } from './config/env';

import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/notes.routes';
import { errorHandler } from './middleware/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger Docs setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "PrimeTrade Backend API",
      version: "1.0.0",
      description:
        "REST API for user authentication and notes management with JWT authentication and role-based access control."
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use(errorHandler);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('PrimeTrade API is running. Go to /api-docs for documentation.');
});

// Database connection & Server start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err: any) => {
    console.error('Failed to connect to MongoDB:', err);
  });
