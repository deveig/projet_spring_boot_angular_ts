import { User } from './user.model';

export interface Ingredient {
  id: number;
  ingredient: string;
  quantity: number;
  unit: string;
  user: User;
}
