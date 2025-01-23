import { CreateUserDto } from '@/dtos/users.dto';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { Router } from 'express';

export class LikeEventRoute implements Routes {
  public path = '/likeEvents';
  public router = Router();
  public event = new LikeEventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`);
    this.router.get(`${this.path}/:id(\\d+)`);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto));
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true));
    this.router.delete(`${this.path}/:id(\\d+)`);
  }
}
