import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Quiz } from '../../models/quiz';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizSubscription: Subscription;
  items: Quiz[];
  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.quizSubscription = this.dashboard.getQuizzes().subscribe(x => {
      this.items = x;
    }
    );
  }

  ngOnDestroy() {
    this.quizSubscription.unsubscribe();
  }

}
