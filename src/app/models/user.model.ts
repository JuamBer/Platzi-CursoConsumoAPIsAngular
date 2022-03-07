export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface CreateUserDTO extends Omit<User, 'id'> {}
