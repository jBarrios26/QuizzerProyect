import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from './Question';

@ObjectType()
@Entity()
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  content: string;

  @Field(() => String)
  @Column("boolean")
  answer: boolean;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.options, {
    nullable: false,
  })
  question: Question;
}
