import { QuestionType } from '../../generated/graphql';
import { Options } from './options';

export class Question {
  id: number;
  relativeId: number;
  content: string;
  type: QuestionType;
  points?: number;
  answer?: number[];
  numOfOptions?: number;
  options: Options[];
}
