import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { NgModule, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LoginComponent } from './components/login/login.component';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { AuthService, RefreshToken } from './service/auth.service';
import { QuizComponent } from './components/quiz/quiz.component';
import { RegisterComponent } from './components/register/register.component';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    QuizListComponent,
    LeaderboardComponent,
    CreateQuizComponent,
    QuizComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    FlexLayoutModule,
    NzIconModule,
    NzTypographyModule,
    ApolloModule,
    HttpLinkModule,
    NzGridModule,
    NzCardModule,
    NzButtonModule,
    NzSpaceModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzSelectModule,
    NzMessageModule,
    NzRadioModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    auth: AuthService,
    httpClient: HttpClient
  ) {
    const http = httpLink.create({
      uri: environment.uriGraphql,
      withCredentials: true,
      method: 'POST',
    });

    const requestLink = new ApolloLink(
      (operation, forward) =>
        new Observable((observer) => {
          let handle;
          Promise.resolve(operation)
            .then((operation) => {
              operation.setContext({
                headers: new HttpHeaders().set(
                  'Authorization',
                  'bearer ' + auth.getAccessToken
                ),
              });
              return forward(operation);
            })
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));

          return () => {
            if (handle) handle.unsubscribe();
          };
        })
    );
    const caches = new InMemoryCache();

    apollo.create({
      link: ApolloLink.from([
        new TokenRefreshLink({
          accessTokenField: 'accessToken',
          isTokenValidOrUndefined: () => {
            const token = auth.getAccessToken;

            if (!token) {
              return true;
            }

            try {
              const { exp } = jwtDecode(token);
              if (Date.now() >= exp * 1000) {
                return false;
              } else {
                return true;
              }
            } catch {
              return false;
            }
          },
          fetchAccessToken: () => {
            return fetch('http://localhost:4000/refresh_token', {
              method: 'POST',
              credentials: 'include',
            });
          },
          handleFetch: (accessToken) => {
            auth.setAccessToken = accessToken;
          },
          handleError: (err) => {
            console.warn('Your refresh token is invalid. Try to relogin');
            console.error(err);
          },
        }),
        requestLink,
        http,
      ]),
      cache: caches,
    });
    console.log('sucessful1');
  }
  ngOnInit() {}
}
