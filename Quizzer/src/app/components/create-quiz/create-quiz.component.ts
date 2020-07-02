import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { QuestionType } from '../../../generated/graphql';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent implements OnInit {
  quiz: FormGroup;
  newQuestions: FormGroup;
  types = QuestionType;
  private numQuestions = 0;
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.types = QuestionType;
  }

  ngOnInit(): void {
    this.quiz = this.fb.group({
      theme: [''],
      author: [{ value: 'Jorge', disabled: true }, [], []],
      numOfQuestions: [''],
      questions: new FormArray([])
    });
    this.newQuestions = this.fb.group({
      QType: [QuestionType.TrueFalse, Validators.required],
      QPoints: [10, [Validators.required, Validators.max(100), Validators.min(1)]],
      QOptions: [2, [Validators.required, Validators.min(2), Validators.max(5)]]
    });
  }

  get questionForms() {
    return this.quiz.get('questions') as FormArray;
  }

  addQuestion() {
    if (this.checkAddQuestion()) {
      const question = this.fb.group({
        content: [''],
        points: [],
        type: [],
        numOfOptions: [],
        answer: [],
        options: new FormArray([])
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

  getQuestionOptions(i) {
    return this.questionForms.at(i).get('options') as FormArray;
  }

  addOption(i) {
    if (this.getQuestionOptions(i).length >= 5) {
      this.message.error('5 is the max number of options', { nzDuration: 2000 });
      return;
    }
    const option = this.fb.group({
      content: ['']
    });
    const question = this.questionForms.at(i).get('options') as FormArray;
    question.push(option);
  }

  print() {
    return JSON.stringify(this.newQuestions.value) + JSON.stringify(this.quiz.value);
  }

  checkAddQuestion(): boolean {
    if (this.newQuestions.get('QPoints').errors || this.newQuestions.get('QOptions').errors) {
      return false;
    }
    const verifyType = this.newQuestions.get('QType').value as QuestionType;
    const verifyOptions = this.newQuestions.get('QOptions').value;
    if (verifyType === QuestionType.TrueFalse && verifyOptions !== 2) {
      this.message.error('True or False Question must have only two options', { nzDuration: 2000 });
      return false;
    }
    return true;
  }
}
