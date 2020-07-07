import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { QuestionType } from '../../../generated/graphql';
import { Quiz } from 'src/app/models/quiz';
import { Question } from 'src/app/models/question';
import { Options } from '../../models/options';
import { QuizService } from '../../service/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css'],
})
export class CreateQuizComponent implements OnInit {
  quiz: FormGroup;
  newQuestions: FormGroup;
  types = QuestionType;
  numQuestions = 0;
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private quizService: QuizService,
    private router: Router
  ) {
    this.types = QuestionType;
  }

  ngOnInit(): void {
    this.quiz = this.fb.group({
      theme: ['', [Validators.required]],
      author: [{ value: 'Jorge', disabled: true }, [], []],
      numOfQuestions: [
        '',
        [Validators.required, Validators.max(15), Validators.min(1)],
      ],
      questions: new FormArray([], [Validators.required]),
    });
    this.newQuestions = this.fb.group({
      QType: [QuestionType.Opts, Validators.required],
      QPoints: [
        10,
        [Validators.required, Validators.max(100), Validators.min(1)],
      ],
      QOptions: [
        2,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });
  }

  get questionForms() {
    return this.quiz.get('questions') as FormArray;
  }

  addQuestion() {
    if (this.checkAddQuestion()) {
      const question = this.fb.group({
        content: ['', [Validators.required]],
        points: [
          0,
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
        type: [null, [Validators.required]],
        numOfOptions: [
          0,
          [Validators.required, Validators.min(1), Validators.max(5)],
        ],
        answer: [0, [Validators.required]],
        options: new FormArray([], Validators.required),
      });
      const questionForm = this.newQuestions;
      question.get('points').setValue(questionForm.get('QPoints').value);
      question.get('type').setValue(questionForm.get('QType').value);
      question.get('numOfOptions').setValue(questionForm.get('QOptions').value);
      this.questionForms.push(question);
      for (let index = 0; index < questionForm.get('QOptions').value; index++) {
        this.addOption(this.numQuestions);
      }
      this.numQuestions++;
    }
  }
  deleteQuestion(i: number) {
    this.questionForms.removeAt(i);
    this.numQuestions--;
  }

  checkDeleteOption(i: number, j: number) {
    const question = this.questionForms.at(i).get('options') as FormArray;
    if (question.length > 1) {
      return true;
    }
    return false;
  }

  getQuestionOptions(i: number) {
    return this.questionForms.at(i).get('options') as FormArray;
  }

  addOption(i: number) {
    if (this.getQuestionOptions(i).length >= 5) {
      this.message.error('5 is the max number of options', {
        nzDuration: 2000,
      });
      return;
    }
    const option = this.fb.group({
      content: ['', Validators.required],
    });
    const question = this.questionForms.at(i).get('options') as FormArray;
    question.push(option);
    this.questionForms.at(i).get('numOfOptions').setValue(question.length);
  }

  removeOption(i: number, j: number) {
    const question = this.questionForms.at(i).get('options') as FormArray;
    question.removeAt(j);
  }

  print() {
    return (
      JSON.stringify(this.newQuestions.value) + JSON.stringify(this.quiz.value)
    );
  }

  checkAddQuestion(): boolean {
    if (
      this.newQuestions.get('QPoints').errors ||
      this.newQuestions.get('QOptions').errors
    ) {
      return false;
    }
    return true;
  }

  submit() {
    if (!this.checkNumQuestions()) {
      return false;
    }
    if (!this.checkScore()) {
      return false;
    }
    this.validateForm();
    const quiz = this.createQuiz();
    this.quizService.sendQuiz(quiz).subscribe((x) => {
      if (x.errors) {
        console.log(x.errors);
        this.message.error('Something went wrong...');
      }
      if (x.data.createQuiz) {
        this.router.navigateByUrl('home');
        this.message.success('Quiz created successfully');
      } else {
        this.message.error('Something went wrong...');
      }
    });
  }

  checkScore(): boolean {
    const questions = this.questionForms.value;
    const totalScore = questions
      .map((x) => x.points)
      .reduce((acc: number, x: number) => acc + x, 0);
    if (totalScore !== 100) {
      this.message.error('The score should be 100');
      return false;
    }
    return true;
  }

  checkNumQuestions(): boolean {
    const questions: Array<any> = this.questionForms.value;
    console.log(questions.length);

    if (questions.length !== this.quiz.get('numOfQuestions').value) {
      this.message.error("The questions and number of questions don't match");
      return false;
    }
    return true;
  }

  validateForm() {
    const theme = this.quiz.get('theme');
    theme.markAsDirty();
    theme.updateValueAndValidity();
    const numOfQuestions = this.quiz.get('numOfQuestions');
    numOfQuestions.markAsDirty();
    numOfQuestions.updateValueAndValidity();

    for (const questions of this.questionForms.controls) {
      const content = questions.get('content');
      content.markAsDirty();
      content.updateValueAndValidity();
      const score = questions.get('points');
      score.markAsDirty();
      score.updateValueAndValidity();
      const options = questions.get('options') as FormArray;
      for (const option of options.controls) {
        const contentOption = option.get('content');
        contentOption.markAsDirty();
        contentOption.updateValueAndValidity();
      }
    }
  }

  createQuiz() {
    const quiz = new Quiz();
    quiz.theme = this.quiz.get('theme').value;
    quiz.numOfQuestions = this.quiz.get('numOfQuestions').value;
    quiz.username = this.quiz.get('author').value;
    const questions: Array<any> = this.questionForms.controls;
    quiz.questions = questions.map((x: FormGroup) => {
      const question = new Question();
      question.content = x.get('content').value;
      question.answer = new Array<number>();
      question.answer.push(x.get('answer').value);
      console.log(x.get('answer').value);
      console.log(JSON.stringify(question.answer, null, 3));
      question.relativeId = 1;
      question.points = x.get('points').value;
      question.type = x.get('type').value;
      question.numOfOptions = x.get('numOfOptions').value;
      const options = (x.get('options') as FormArray).controls;
      question.options = options.map((y: FormGroup) => {
        const option = new Options();
        option.content = y.get('content').value;
        return option;
      });
      return question;
    });
    return quiz;
  }
}
