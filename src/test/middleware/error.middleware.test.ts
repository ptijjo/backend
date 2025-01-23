/* eslint-disable prettier/prettier */
import { ErrorMiddleware } from '@/middlewares/error.middleware';
import { HttpException } from '@/exceptions/httpException';
import { Request, Response, NextFunction } from 'express';

describe('ErrorMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { method: 'GET', path: '/test' }; // Simule une requête GET sur /test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; // Simule un objet Response
    next = jest.fn(); // Simule le next() middleware
  });

  it('devrait gérer une exception HttpException et retourner un JSON avec le statut et le message', () => {
    // Simuler une exception
    const error = new HttpException(404, 'Resource not found');

    // Appeler le middleware
    ErrorMiddleware(error, req as Request, res as Response, next);

    // Vérifier que le logger affiche l'erreur (facultatif si tu veux tester le logger)
    // Ici, il faudrait moquer le `logger.error`.

    // Vérifier la réponse
    expect(res.status).toHaveBeenCalledWith(404); // Le middleware doit retourner le bon statut
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' }); // Le middleware doit retourner le bon message
  });

  it('devrait gérer une erreur générique et retourner un statut 500 par défaut', () => {
    // Simuler une erreur sans statut ni message
    const error = new Error('Unexpected error');

    // Appeler le middleware
    ErrorMiddleware(error as HttpException, req as Request, res as Response, next);

    // Vérifier la réponse
    expect(res.status).toHaveBeenCalledWith(500); // Le statut par défaut est 500
    expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' }); // Le message par défaut
  });

  it('devrait appeler next() en cas d’erreur dans le middleware', () => {
    // Simuler une erreur interne dans le middleware
    const error = new HttpException(500, 'Internal error');

    jest.spyOn(res, 'status').mockImplementation(() => {
      throw new Error('Middleware failure');
    });

    ErrorMiddleware(error, req as Request, res as Response, next);

    // Vérifie que le next() est appelé avec l’erreur
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
