import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <main class="page">
      <section class="card">
        <div class="avatar">{{ initial }}</div>
        <h1>Hello, {{ user?.name }}!</h1>
        <p>You are signed in as <strong>{{ user?.loginId }}</strong>.</p>
        <button (click)="logout()">Sign out</button>
      </section>
    </main>
  `,
  styles: `
    .page { min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; }
    .card { width: 100%; max-width: 400px; background: #fff; border-radius: 16px; padding: 40px 32px;
            text-align: center; box-shadow: 0 20px 50px rgba(17, 24, 39, 0.25); }
    .avatar { width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 50%; display: grid;
              place-items: center; font-size: 30px; font-weight: 700; color: #fff;
              background: linear-gradient(135deg, #4f46e5, #7c3aed); }
    h1 { margin: 0 0 8px; font-size: 24px; color: #111827; }
    p { margin: 0 0 28px; color: #6b7280; }
    button { width: 100%; height: 46px; font: inherit; font-weight: 600; color: #4f46e5; cursor: pointer;
             background: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 10px; }
    button:hover { background: #e0e7ff; }
  `,
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser();
  initial = (this.user?.name ?? '?').charAt(0).toUpperCase();

  logout(): void {
    this.auth.logout().subscribe({ complete: () => this.router.navigate(['/login']), error: () => this.router.navigate(['/login']) });
  }
}
