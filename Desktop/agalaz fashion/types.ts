export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: Role;
  text: string;
  image?: string;
}

export interface AppUser {
  name: string;
  email: string;
  avatar: string;
  provider: string;
}
