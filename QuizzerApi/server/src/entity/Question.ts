import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { Option } from './Option';
import { Quiz } from './Quiz';

export enum QuestionType {
	TRUE_FALSE = 'TF',
	OPTS = 'opt',
	MOPTS = 'multiple',
}

registerEnumType(QuestionType, {
	name: 'QuestionType',
	description: 'Describes the valid question types',
});

@ObjectType()
@Entity()
export class Question extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => Int)
	@Column('int')
	relativeID: number;

	@Field(() => String)
	@Column({ type: 'enum', enum: QuestionType, default: QuestionType.OPTS })
	type: QuestionType;

	@Field(() => String)
	@Column('text')
	content: string;

	@Field(() => Int)
	@Column('int')
	points: number;

	@Field(() => Int)
	@Column('int')
	numOfOptions: number;

	@Field(() => [Int])
	@Column('int')
	answer: number;

	@Field(() => Quiz)
	@ManyToOne(() => Quiz, (quiz) => quiz.questions, { nullable: false })
	quiz: Quiz;

	@Field(() => [Option])
	@OneToMany(() => Option, (option) => option.question, {
		nullable: false,
		cascade: true,
		eager: true,
	})
	options: Option[];
}
