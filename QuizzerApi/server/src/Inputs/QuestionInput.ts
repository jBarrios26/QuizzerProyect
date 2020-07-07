import { Field, InputType, Int } from 'type-graphql';

import { QuestionType } from '../entity/Question';
import { OptionInput } from './OptionInput';

@InputType()
export class QuestionInput {
	@Field(() => Int)
	relativeId: number;

	@Field(() => String)
	content: string;

	@Field(() => Int)
	numOptions: number;

	@Field(() => Int)
	points: number;

	@Field(() => [Int])
	answer: number[];

	@Field(() => QuestionType)
	type: QuestionType;

	@Field(() => [OptionInput])
	options: OptionInput[];
}
