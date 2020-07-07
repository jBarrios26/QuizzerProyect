import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Quiz } from '../../models/quiz';
import { DashboardService } from '../../service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css'],
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizSubscription: Subscription;
  items: Quiz[];
  constructor(private dashboard: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.quizSubscription = this.dashboard.getQuizzes().subscribe((x) => {
      this.items = x;
    });
  }

  takeQuiz(id: number) {
    this.router.navigate(['/quiz', id]);
  }

  ngOnDestroy() {
    this.quizSubscription.unsubscribe();
    console.log(this.quizSubscription.closed);
  }
}
