import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateQuizComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
