import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessTokenField = '';
  constructor() {}

  public get getAccessToken(): string {
    return this.accessTokenField;
  }

  public set setAccessToken(v: string) {
    this.accessTokenField = v;
  }
}
