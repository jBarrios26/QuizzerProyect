import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Question } from "./Question";

@ObjectType()
@Entity()
export class Option extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  relativeid: number;

  @Field(() => String)
  @Column("text")
  content: string;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.options, {
    nullable: false,
  })
  question: Question;
}
