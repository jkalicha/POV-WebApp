import 'dotenv/config';
import express, { Request, Response } from "express";
import { AppDataSource } from "./Database/AppDataSource";
import { UserController } from "./User/UserController";
import { IUserService } from "./UserInterfaces/IUserService";
import { UserService } from './User/UserService';
import { UserRepository } from "./User/UserRepository";
import { IEventService } from './EventInterfaces/IEventService';
import { IUserRepository } from './UserInterfaces/IUserRepository';
import { EventService } from './Event/EventService';
import { IEventRepository } from './EventInterfaces/IEventRepository';
import { EventController } from './Event/EventController';
import { EventRepository } from './Event/EventRepository';
import { authenticateToken, AuthenticatedRequest } from './Shared/authMiddleware';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const userController = new UserController(userService);

const eventRepository: IEventRepository = new EventRepository();
const eventService: IEventService = new EventService(eventRepository);
const eventController = new EventController(eventService);

const handleError = (error: any, res: Response) => {
  console.error('Error:', error);
  
  if (error.message) {
    if (error.message.includes('required') || 
        error.message.includes('already exists') ||
        error.message.includes('Invalid') ||
        error.message.includes('String must contain at least') ||
        error.message.includes('Invalid uuid') ||
        error.message.includes('Email already exists')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('Invalid email or password') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Access token required') ||
        error.message.includes('Token expired') ||
        error.message.includes('Invalid token')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes('Forbidden') ||
        error.message.includes('Not allowed') ||
        error.message.includes('Permission denied')) {
      return res.status(403).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: 'Internal server error' });
};

app.post('/user', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    await userController.createUser(name, email, password);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    handleError(error, res);
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await userController.loginUser(email, password);

    res.status(200).json({ 
      message: 'Login successful',
      token: token
     });
  } catch (error: any) {
    handleError(error, res);
  }
});

app.post('/event', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, date, location } = req.body;
    const ownerId = req.user!.userId;
    
    await eventController.createEvent(title, date, location, ownerId);
    
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error: any) {
    handleError(error, res);
  }
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
    process.exit(1);
  });
