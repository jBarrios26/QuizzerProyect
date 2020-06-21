import { Field, InputType, Int } from 'type-graphql';

import { Answer } from './Answer';

@InputType()
export class GradingInput {
  @Field(() => Int)
  quizid: number;

  @Field(() => [Answer])
  answers: Answer[];
}
