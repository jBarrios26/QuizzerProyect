import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Quizzer';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.refreshToken().subscribe((x) => {
      if (x.ok) {
        this.auth.setAccessToken = x.accessToken;
        this.auth.user = x.payload.username;
        this.auth.name = x.payload.name;
        this.auth.publisher = x.payload.publisher;
      }
    });
  }
}
