import { Field, InputType } from 'type-graphql';

@InputType()
export class OptionInput {
  @Field(() => String)
  content: string;
}
