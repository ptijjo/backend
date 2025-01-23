/* eslint-disable prettier/prettier */
import { UserService } from '@/services/users.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import {User} from "../../interfaces/users.interface";
// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findMany: jest.fn(), // Mock de la méthode findMany
      findUnique: jest.fn(), // Mock de la méthode findUnique
      delete: jest.fn(), 
      create:jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) }; // Simule PrismaClient
});

afterEach(() => {
  jest.clearAllMocks(); // Réinitialise les mocks entre les tests
});

describe('classe avec les différentes méthodes des utilisateurs', () => {
  let userService: UserService;
  let mockPrisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  // Initialiser une instance avant chaque test
  beforeEach(() => {
    userService = new UserService();
    mockPrisma = new PrismaClient();
  });

  describe("tester la fonction findMany", () => {
    it('should find all users', async () => {
      // Données simulées renvoyées par Prisma
      const mockUsers:User[] = [
        { id: "1", firstName: 'Alice', lastName:"Dupont",email: 'alice@example.com' },
        { id: "2", firstName: 'Bob',lastName:"Marley", email: 'bob@example.com' },
      ];
  
      (mockPrisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);
  
      // Appeler la méthode et vérifier le résultat
      const users:User[] = await userService.findAllUser();
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1); // Prisma est appelé
      expect(users).toEqual(mockUsers); // Les données sont correctes
    });
  
    it('should throw an error if the database query fails', async () => {
      (mockPrisma.user.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await expect(userService.findAllUser()).rejects.toThrow('Database error');
    });
  });

  describe("tester la fonction findUnique", () => {
    it("devrait retourner un utilisateur pour un ID valide", async () => {
      const mockUser:User = { id: "1", firstName: 'Alice', lastName:"Dupont",email: 'alice@example.com' };
        

      // Cast explicite pour permettre l'utilisation de Jest
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      const user = await userService.findUserById("1");
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(user).toEqual(mockUser);
    });

    it("devrait retourner null si aucun utilisateur n'est trouvé", async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
  
      //si il ne trouve rien il lève une erreur de type ("user doesn't exist")
      await expect(userService.findUserById("99")).rejects.toThrow('User doesn\'t exist');
  
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "99" },
      });
    
    });

    it("devrait lever une erreur si la requête échoue", async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await expect(userService.findUserById("1")).rejects.toThrow('Database error');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe("tester la fonction deleteUser", () => {
    it("devrait trouver l'utilisateur et le supprimer", async () => {
      const mockUser:User = { id: "1", firstName: 'Alice', lastName:"Dupont",email: 'alice@example.com' };
          
  
      // Cast explicite pour permettre l'utilisation de Jest
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
      const user:User = await userService.findUserById("1");
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(user).toEqual(mockUser);

      // Mocker delete pour simuler la suppression
      (mockPrisma.user.delete as jest.Mock).mockResolvedValueOnce(mockUser);
      
      const deletedUser = await userService.deleteUser("1");

      expect(mockPrisma.user.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: "1" } });
      // Vérifier que l'utilisateur retourné est bien celui supprimé
      expect(deletedUser).toEqual(mockUser);
    });

    it("devrait lever une erreur si l'utilisateur n'existe pas", async () => {
      // Mocker findUnique pour qu'il retourne null (l'utilisateur n'existe pas)
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    
      // Vérifier que deleteUser lève bien une exception si l'utilisateur n'existe pas
      await expect(userService.deleteUser("99")).rejects.toThrow("User doesn't exist");
    
      // Vérifier que findUnique a bien été appelé une fois avec l'ID "99"
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "99" } });
    
      // Vérifier que delete n'a pas été appelé
      expect(mockPrisma.user.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe("tester la creation d'utilisateur", () => {
    it("devrait se connecter via goole", async () => {
      // Données simulées renvoyées par Prisma
      const mockUsers:User[] = [
        { id: "1", firstName: 'Alice', lastName:"Dupont",email: 'alice@example.com' },
        { id: "2", firstName: 'Bob',lastName:"Marley", email: 'bob@example.com' },
      ];

      console.log(mockUsers);
      
    });
  })

 
});
