import { Injectable } from '@angular/core';
import { LoginGQL, RegisterUserGQL } from '../../generated/graphql';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface RefreshToken {
  ok: boolean;
  accessToken: string;
  payload: {
    username: string;
    name: string;
    publisher: boolean;
  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessTokenField = '';
  user: string;
  name: string;
  publisher: boolean;
  constructor(
    private regMutation: RegisterUserGQL,
    private loginMutation: LoginGQL,
    private http: HttpClient
  ) {}

  register(
    username: string,
    name: string,
    password: string,
    gender: string,
    publisher: boolean
  ) {
    return this.regMutation.mutate({
      user: username,
      name: name,
      gender: gender,
      password: password,
      publisher: publisher,
    });
  }

  login(username: string, password: string) {
    return this.loginMutation.mutate({ user: username, pass: password }).pipe(
      map((x) => {
        if (x.errors) {
          x.errors.forEach((e) => console.log(e.message));
          return of(false);
        }
        this.name = x.data.login.user.name;
        this.user = x.data.login.user.username;
        this.publisher = x.data.login.user.publisher;
        this.accessTokenField = x.data.login.accessToken;
        return of(true);
      })
    );
  }

  refreshToken() {
    return this.http.post<RefreshToken>(
      environment.uriRest + '/refresh_token',
      {},
      { withCredentials: true }
    );
  }

  public get getAccessToken(): string {
    return this.accessTokenField;
  }

  public set setAccessToken(v: string) {
    this.accessTokenField = v;
  }
}
