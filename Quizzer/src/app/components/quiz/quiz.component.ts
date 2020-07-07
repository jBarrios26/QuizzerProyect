import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QuizService } from '../../service/quiz.service';
import { Quiz } from '../../models/quiz';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  answer: FormGroup;
  loading = true;
  quiz: Quiz;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private quizService: QuizService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.quizService.fetchQuiz(this.id).subscribe((x) => {
        if (x instanceof Array) {
          this.router
            .navigateByUrl('home')
            .then(() => this.message.error('This quiz doesnt exists'));
        }
        if (x instanceof Quiz) {
          this.quiz = x;
          this.answer = this.fb.group({
            id: [this.quiz.id, [], []],
            questions: new FormArray([]),
          });
          this.buildQuestions();
          this.loading = false;
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  get questionArray() {
    return this.answer.get('questions') as FormArray;
  }

  getQuestions() {
    return this.quiz ? this.quiz.questions : [];
  }

  buildQuestions() {
    for (let question of this.quiz.questions) {
      const questionControl = this.fb.group({
        id: [question.id],
        answer: [-1],
      });
      this.questionArray.push(questionControl);
    }
  }

  submit() {
    console.log(JSON.stringify(this.answer.value, null, 2));
  }
}
