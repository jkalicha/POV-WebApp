import 'dotenv/config';
import express, { Request, Response } from "express";
import { AppDataSource } from "./Database/AppDataSource";
import { UserController } from "./User/UserController";
import { UserService } from "./User/UserService";
import { UserRepository } from "./User/UserRepository";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.post('/user', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    await userController.createUser(name, email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token =await userController.loginUser(email, password);
    res.status(200).json({ 
      message: 'Login successful',
      token: token
     });
  } catch (error: any) {
    console.error('Error logging in:', error);
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/event', async (req: Request, res: Response) => {
  try {
    const { title, date, location } = req.body;
    await userController.createEvent(title, date, location);
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error: any) {
    console.error('Error creating event:', error);
    if (error.message && error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
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
