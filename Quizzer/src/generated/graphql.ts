import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};



export type Query = {
  __typename?: 'Query';
  getQuizzes: Array<Quiz>;
  getQuiz: Quiz;
  hello: Scalars['String'];
  users: Array<User>;
  bye: Scalars['String'];
};


export type QueryGetQuizArgs = {
  id: Scalars['Int'];
};

export type Quiz = {
  __typename?: 'Quiz';
  id: Scalars['Int'];
  theme: Scalars['String'];
  numberOfQuestions: Scalars['Int'];
  user: User;
  questions: Question;
  results: Results;
};

export type User = {
  __typename?: 'User';
  username: Scalars['String'];
  name: Scalars['String'];
  gender: Scalars['String'];
  publisher: Scalars['Boolean'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['Int'];
  relativeID: Scalars['Int'];
  type: Scalars['String'];
  content: Scalars['String'];
  points: Scalars['Int'];
  numOfOptions: Scalars['Int'];
  answer: Array<Scalars['Int']>;
  quiz: Quiz;
  options: Array<Option>;
};

export type Option = {
  __typename?: 'Option';
  id: Scalars['Int'];
  relativeid: Scalars['Int'];
  content: Scalars['String'];
  question: Question;
};

export type Results = {
  __typename?: 'Results';
  userUsername: Scalars['String'];
  quizId: Scalars['Int'];
  score: Scalars['Int'];
  done: Scalars['DateTime'];
  user: User;
  quiz: Quiz;
};


export type Mutation = {
  __typename?: 'Mutation';
  createQuiz: Scalars['Boolean'];
  grading: Scalars['Boolean'];
  prueba: Scalars['String'];
  login: LoginResponse;
  forgotPassword: Scalars['Boolean'];
  register: Scalars['Boolean'];
};


export type MutationCreateQuizArgs = {
  quiz: QuizInput;
};


export type MutationGradingArgs = {
  answers: GradingInput;
  user: Scalars['String'];
};


export type MutationPruebaArgs = {
  prueba: ArrayInputTest;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  publisher: Scalars['Boolean'];
  gender: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type QuizInput = {
  theme: Scalars['String'];
  author: Scalars['String'];
  numberOfQuestion: Scalars['Int'];
  questions: Array<QuestionInput>;
};

export type QuestionInput = {
  relativeId: Scalars['Int'];
  content: Scalars['String'];
  numOptions: Scalars['Int'];
  points: Scalars['Int'];
  answer: Array<Scalars['Int']>;
  type: QuestionType;
  options: Array<OptionInput>;
};

/** Describes the valid question types */
export enum QuestionType {
  TrueFalse = 'TRUE_FALSE',
  Opts = 'OPTS',
  Mopts = 'MOPTS'
}

export type OptionInput = {
  content: Scalars['String'];
};

export type GradingInput = {
  quizid: Scalars['Int'];
  answers: Array<Answer>;
};

export type Answer = {
  questionid: Scalars['Int'];
  selected: Array<Scalars['Int']>;
};

export type ArrayInputTest = {
  pruebaarr: Array<PruebaInput>;
};

export type PruebaInput = {
  theme: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type QuizListQueryVariables = Exact<{ [key: string]: never; }>;


export type QuizListQuery = (
  { __typename?: 'Query' }
  & { getQuizzes: Array<(
    { __typename?: 'Quiz' }
    & Pick<Quiz, 'id' | 'theme' | 'numberOfQuestions'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);

export type CreateQuizMutationVariables = Exact<{
  quiz: QuizInput;
}>;


export type CreateQuizMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createQuiz'>
);

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type TakeQuizQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TakeQuizQuery = (
  { __typename?: 'Query' }
  & { getQuiz: (
    { __typename?: 'Quiz' }
    & Pick<Quiz, 'theme' | 'numberOfQuestions'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'name'>
    ), questions: (
      { __typename?: 'Question' }
      & Pick<Question, 'id' | 'content' | 'points' | 'relativeID'>
      & { options: Array<(
        { __typename?: 'Option' }
        & Pick<Option, 'id' | 'content'>
      )> }
    ) }
  ) }
);

export const QuizListDocument = gql`
    query QuizList {
  getQuizzes {
    user {
      username
    }
    id
    theme
    numberOfQuestions
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class QuizListGQL extends Apollo.Query<QuizListQuery, QuizListQueryVariables> {
    document = QuizListDocument;
    
  }
export const CreateQuizDocument = gql`
    mutation createQuiz($quiz: QuizInput!) {
  createQuiz(quiz: $quiz)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateQuizGQL extends Apollo.Mutation<CreateQuizMutation, CreateQuizMutationVariables> {
    document = CreateQuizDocument;
    
  }
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HelloGQL extends Apollo.Query<HelloQuery, HelloQueryVariables> {
    document = HelloDocument;
    
  }
export const TakeQuizDocument = gql`
    query takeQuiz($id: Int!) {
  getQuiz(id: $id) {
    theme
    user {
      name
    }
    numberOfQuestions
    questions {
      id
      content
      points
      relativeID
      options {
        id
        content
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TakeQuizGQL extends Apollo.Query<TakeQuizQuery, TakeQuizQueryVariables> {
    document = TakeQuizDocument;
    
  }