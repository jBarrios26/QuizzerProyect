import { Question } from './question';

export class Quiz {
  id: number;
  username?: string;
  theme?: string;
  numOfQuestions?: number;
  questions: Question[];
}
