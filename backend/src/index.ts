import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./Database/AppDataSource";
import { UserController } from "./User/UserController";
import { IUserService } from "./UserInterfaces/IUserService";
import { UserService } from "./User/UserService";
import { UserRepository } from "./User/UserRepository";
import { IEventService } from "./EventInterfaces/IEventService";
import { IUserRepository } from "./UserInterfaces/IUserRepository";
import { EventService } from "./Event/EventService";
import { IEventRepository } from "./EventInterfaces/IEventRepository";
import { EventController } from "./Event/EventController";
import { EventRepository } from "./Event/EventRepository";
import { EventInvitationRepository } from "./EventInvitation/EventInvitationRepository";
import { EventPhotoController } from "./EventPhoto/EventPhotoController";
import { EventPhotoService } from "./EventPhoto/EventPhotoService";
import { EventPhotoRepository } from "./EventPhoto/EventPhotoRepository";
import { IEventPhotoService } from "./EventPhotoInterfaces/IEventPhotoService";
import { IEventPhotoRepository } from "./EventPhotoInterfaces/IEventPhotoRepository";
import { upload } from "./Shared/uploadMiddleware";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "./Shared/authMiddleware";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Servir archivos estáticos de uploads en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const userController = new UserController(userService);

const eventRepository: IEventRepository = new EventRepository();
const eventInvitationRepository = new EventInvitationRepository();
const eventService: IEventService = new EventService(
  eventRepository,
  eventInvitationRepository,
  userRepository
);
const eventController = new EventController(eventService);

const eventPhotoRepository: IEventPhotoRepository = new EventPhotoRepository();
const eventPhotoService: IEventPhotoService = new EventPhotoService(eventPhotoRepository);
const eventPhotoController = new EventPhotoController(eventPhotoService);

const handleError = (error: any, res: Response) => {

  if (error.message) {
    if (
      error.message.includes("required") ||
      error.message.includes("already exists") ||
      error.message.includes("Invalid") ||
      error.message.includes("String must contain at least") ||
      error.message.includes("Invalid uuid") ||
      error.message.includes("Email already exists") ||
      error.message.includes("Password must be at least") ||
      error.message.includes("Password must contain")
    ) {
      return res.status(400).json({ error: error.message });
    }
    if (
      error.message.includes("Invalid email or password") ||
      error.message.includes("Unauthorized") ||
      error.message.includes("Access token required") ||
      error.message.includes("Token expired") ||
      error.message.includes("Invalid token")
    ) {
      return res.status(401).json({ error: error.message });
    }
    if (
      error.message.includes("Forbidden") ||
      error.message.includes("Not allowed") ||
      error.message.includes("Permission denied")
    ) {
      return res.status(403).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Internal server error" });
};

app.post("/user", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    await userController.createUser(name, email, password);

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    handleError(error, res);
  }
});

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await userController.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

app.post(
  "/event",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, date, location } = req.body;
      const ownerId = req.user!.userId;

      await eventController.createEvent(title, date, location, ownerId);

      res.status(201).json({ message: "Event created successfully" });
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

app.get(
  "/events",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const events = await eventController.getEventsForUser(userId);
      res.status(200).json(events);
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

app.post(
  "/event/:id/invite",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const ownerId = req.user!.userId;
      const eventId = req.params.id;
      const inviteeEmails = (req.body?.invitees ||
        req.body?.emails ||
        []) as string[];

      const result = await eventController.inviteUsersToEvent(
        ownerId,
        eventId,
        inviteeEmails
      );
      res.status(200).json({ message: "Invitations processed", ...result });
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

// 📸 PHOTO ENDPOINTS
// POST /event/:id/photos - Subir foto al evento
app.post(
  "/event/:id/photos",
  authenticateToken,
  upload.single("photo"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const eventId = req.params.id;
      const userId = req.user!.userId;
      const caption = req.body.caption;
      
      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó archivo" });
      }

      await eventPhotoController.uploadPhoto(
        eventId,
        userId,
        req.file.buffer,
        req.file.originalname,
        caption
      );

      res.status(201).json({ message: "Foto subida exitosamente" });
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

// GET /event/:id/photos - Ver fotos del evento
app.get(
  "/event/:id/photos",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const eventId = req.params.id;
      const photos = await eventPhotoController.getEventPhotos(eventId);
      res.status(200).json(photos);
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

// DELETE /photo/:id - Eliminar foto propia
app.delete(
  "/photo/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const photoId = req.params.id;
      const userId = req.user!.userId;
      
      await eventPhotoController.deletePhoto(photoId, userId);
      res.status(200).json({ message: "Foto eliminada exitosamente" });
    } catch (error: any) {
      handleError(error, res);
    }
  }
);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      // Server started
    });
  })
  .catch(() => {
    process.exit(1);
  });
