export interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
  salt: string;
}

let nextId = 1;
export const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function createUser(input: Omit<User, "id">): User {
  const user: User = { id: nextId++, ...input };
  users.push(user);
  return user;
}
