import { Injectable } from '@angular/core';
import {
  CreateQuizMutation,
  CreateQuizGQL,
  QuizInput,
  QuestionInput,
  TakeQuizGQL,
} from '../../generated/graphql';
import { Mutation } from 'apollo-angular';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import {
  OptionInput,
  QuizListQuery,
  QuizListDocument,
} from '../../generated/graphql';
import { Options } from '../models/options';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { log } from 'util';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private newQuiz: CreateQuizGQL, private getQuiz: TakeQuizGQL) {}
  sendQuiz(quiz: Quiz) {
    const quizInput: QuizInput = {
      theme: quiz.theme,
      author: quiz.username,
      numberOfQuestion: quiz.numOfQuestions,
      questions: quiz.questions.map((x: Question, index: number) => {
        const question: QuestionInput = {
          relativeId: index + 1,
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

  fetchQuiz(id: number) {
    return this.getQuiz.watch({ id: id }).valueChanges.pipe(
      map((x) => {
        const quiz = new Quiz();
        quiz.id = x.data.getQuiz.id;
        quiz.theme = x.data.getQuiz.theme;
        quiz.username = x.data.getQuiz.user.name;
        quiz.numOfQuestions = x.data.getQuiz.numberOfQuestions;
        quiz.questions = x.data.getQuiz.questions.map((y) => {
          const question = new Question();
          question.id = y.id;
          question.content = y.content;
          question.points = y.points;
          question.options = y.options.map((option) => {
            const options = new Options();
            options.content = option.content;
            options.id = option.id;
            return options;
          });
          return question;
        });
        return quiz;
      }),
      catchError((err) => {
        if (err.graphQLErrors) {
          err.graphQLErrors.forEach((e) => {
            console.log(e.message);
          });
        }
        if (err.networkError) {
          err.networkError.forEach((e) => {
            console.log(e.message);
          });
        }
        return of([]);
      })
    );
  }
}
