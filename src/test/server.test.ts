/* eslint-disable prettier/prettier */
import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import request from 'supertest'; // Librairie pour tester les routes HTTP


afterEach(() => {
  jest.clearAllMocks(); // Réinitialise les mocks entre les tests
});

describe("mise en route de notre serveur", () => {

    
    it("devrait démarrer le serveur avec succès", async () => {
        const app = new App([new UserRoute()]);

        const response = await request(app.getServer()).get('/users'); // Remplace "/" par une route définie
        expect(response.status).toBe(200);
      });
})