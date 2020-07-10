import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  passwordVisible = false;
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private regService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required], []],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      gender: ['M', [Validators.required], []],
      publisher: [false],
    });
  }

  submit() {
    this.validateForm();
    if (this.registerForm.valid) {
      this.regService
        .register(
          this.registerForm.get('username').value,
          this.registerForm.get('name').value,
          this.registerForm.get('password').value,
          this.registerForm.get('gender').value,
          this.registerForm.get('publisher').value
        )
        .subscribe((x) => {
          if (x.errors) {
            console.log(x.errors.map((e) => e.message));
            return;
          }
          if (x.data.register) {
            this.router.navigateByUrl('login');
          } else {
            console.log('something wrong happen...');
          }
        });
    }
  }

  getUserError() {
    const username = this.registerForm.get('username');
    if (username.hasError('required')) {
      return 'Please enter an username';
    }
  }
  getPasswordError() {
    const password = this.registerForm.get('password');
    if (password.hasError('required')) {
      return 'Please enter a password';
    }
  }
  validateForm() {
    for (const control in this.registerForm.controls) {
      this.registerForm.controls[control].markAsDirty();
      this.registerForm.controls[control].updateValueAndValidity();
    }
  }
  print() {
    return JSON.stringify(this.registerForm.value, null, 3);
  }
}
