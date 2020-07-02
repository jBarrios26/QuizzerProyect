import { Component, OnInit } from '@angular/core';

import { QuizListGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  saludo: string;
  constructor(private quiz: QuizListGQL) {}

  ngOnInit(): void {
    this.quiz.watch().valueChanges.subscribe((result) => {
      this.saludo = JSON.stringify(result.data.getQuizzes, null, 2);
    });
  }
}
