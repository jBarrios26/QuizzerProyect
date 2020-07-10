import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.validateForm();
    if (this.loginForm.valid) {
      this.auth
        .login(this.getUsername.value, this.getPassword.value)
        .subscribe((x) => {
          if (x) {
            this.router.navigateByUrl('home');
            return;
          }
          this.message.error('Error while login...');
        });
    }
  }

  get getUsername() {
    return this.loginForm.get('username');
  }

  get getPassword() {
    return this.loginForm.get('password');
  }

  validateForm() {
    const user = this.loginForm.get('username');
    user.markAsDirty();
    user.updateValueAndValidity();

    const password = this.loginForm.get('password');
    password.markAsDirty();
    password.updateValueAndValidity();
  }
}
