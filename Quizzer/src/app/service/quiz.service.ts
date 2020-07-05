import { Injectable } from '@angular/core';
import {
  CreateQuizMutation,
  CreateQuizGQL,
  QuizInput,
  QuestionInput,
} from '../../generated/graphql';
import { Mutation } from 'apollo-angular';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import {
  OptionInput,
  QuizListGQL,
  QuizListQuery,
  QuizListDocument,
} from '../../generated/graphql';
import { Options } from '../models/options';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private newQuiz: CreateQuizGQL) {}
  sendQuiz(quiz: Quiz) {
    const quizInput: QuizInput = {
      theme: quiz.theme,
      author: quiz.username,
      numberOfQuestion: quiz.numOfQuestions,
      questions: quiz.questions.map((x: Question, index: number) => {
        const question: QuestionInput = {
          relativeid: index + 1,
          content: x.content,
          numOptions: x.numOfOptions,
          type: x.type,
          points: x.points,
          answer: x.answer,
          options: x.options.map((y: Options) => {
            const option: OptionInput = {
              content: y.content,
            };
            return option;
          }),
        };
        return question;
      }),
    };
    return this.newQuiz.mutate(
      { quiz: quizInput },
      { refetchQueries: [{ query: QuizListDocument }] }
    );
  }
}
