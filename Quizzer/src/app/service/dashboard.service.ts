import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { QuizListGQL } from '../../generated/graphql';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private quizzes: QuizListGQL) { }

  getQuizzes() {
    return this.quizzes.watch().valueChanges.pipe(
      map(x => x.data.getQuizzes.map(x => {
        const quiz = new Quiz();
        quiz.theme = x.theme;
        quiz.username = x.user.username;
        quiz.numOfQuestions = x.numberOfQuestions;
        quiz.id = x.id;
        return quiz;
      }))
    );
  }
}
