import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Quiz } from './Quiz';
import { Results } from './Results';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn("varchar", { length: 255, nullable: false })
  username: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  name: string;

  @Column("varchar", { length: 255 })
  password: string;

  @Field(() => String)
  @Column("character", { length: 1 })
  gender: string;

  @Field(() => Boolean)
  @Column("boolean")
  publisher: boolean;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes: Quiz[];

  @OneToMany(() => Results, (result) => result.user)
  results: Results[];
}
