import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class Answer {
  @Field(() => Int)
  questionid: number;

  @Field(() => [Int])
  selected: number[];
}
