import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  collapse = false;
  constructor(private router: Router) { }

  ngOnInit(): void { }

  sider() {
    this.collapse = !this.collapse;
  }

  goto(path: string): void {
    this.router.navigateByUrl(path);
  }
}
