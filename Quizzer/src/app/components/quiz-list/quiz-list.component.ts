import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Quiz } from '../../models/quiz';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css'],
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizSubscription: Subscription;
  items: Quiz[];
  constructor(private dashboard: DashboardService) {}

  ngOnInit(): void {
    console.log('init');
    console.log(
      this.quizSubscription === undefined || this.quizSubscription.closed
    );
    this.quizSubscription = this.dashboard.getQuizzes().subscribe((x) => {
      console.log('fetching');
      console.log(JSON.stringify(x, null, 3));

      this.items = x;
    });
  }

  ngOnDestroy() {
    console.log('destroy');

    this.quizSubscription.unsubscribe();
    console.log(this.quizSubscription.closed);
  }
}
