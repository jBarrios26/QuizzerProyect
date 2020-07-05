import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { QuizListGQL } from '../../generated/graphql';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private quizzes: QuizListGQL) {}

  getQuizzes() {
    return this.quizzes.watch().valueChanges.pipe(
      map((x) =>
        x.data.getQuizzes.map((y) => {
          const quiz = new Quiz();
          quiz.theme = y.theme;
          quiz.username = y.user.username;
          quiz.numOfQuestions = y.numberOfQuestions;
          quiz.id = y.id;
          return quiz;
        })
      )
    );
  }
}
