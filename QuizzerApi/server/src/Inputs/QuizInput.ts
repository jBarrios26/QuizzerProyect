import { Field, InputType, Int } from 'type-graphql';

import { QuestionInput } from './QuestionInput';

@InputType()
export class QuizInput {
  @Field(() => String)
  theme: string;

  @Field(() => String)
  author: string;

  @Field(() => Int)
  numberOfQuestion: number;

  @Field(() => [QuestionInput])
  questions: QuestionInput[];
}
