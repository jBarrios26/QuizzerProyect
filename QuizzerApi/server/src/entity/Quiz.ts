import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from './Question';
import { Results } from './Results';
import { User } from './User';

@ObjectType()
@Entity()
export class Quiz extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  theme: string;

  @Field(() => Int)
  @Column("int")
  numberOfQuestions: number;

  @Column("varchar", { length: 255 })
  userUsername: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.quizzes, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  user: User;

  @Field(() => Question)
  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  questions: Question[];

  @Field(() => Results)
  @OneToMany(() => Results, (result) => result.quiz)
  results: Results[];
}
