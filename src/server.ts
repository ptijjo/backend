import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { EventRoute } from './routes/events.route';
import { InscriptionRoute } from './routes/inscriptions.route';
import { LikeEventRoute } from './routes/likeEvents.route';
import { CommentaireEventRoute } from './routes/commentaireEvents.route';

ValidateEnv();

const app = new App([new UserRoute(), new EventRoute(), new InscriptionRoute(), new LikeEventRoute(), new CommentaireEventRoute()]);

app.listen();

export const socketInstance = app.getSocketInstance();
