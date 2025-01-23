export interface User {
  id?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isConnected?: boolean;
  last_connection?: Date;
}
