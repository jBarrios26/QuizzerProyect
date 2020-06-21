import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Quiz } from './Quiz';
import { User } from './User';

@ObjectType()
@Entity()
export class Results extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn("varchar", { length: 255 })
  userUsername: string;

  @Field(() => Int)
  @PrimaryColumn("int")
  quizId: number;

  @Field(() => Int)
  @Column("int")
  score: number;

  @Field(() => Date)
  @CreateDateColumn()
  done: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.results, { nullable: false })
  user: User[];

  @Field(() => Quiz)
  @ManyToOne(() => Quiz, (quiz) => quiz.results, { nullable: false })
  quiz: Quiz[];
}
