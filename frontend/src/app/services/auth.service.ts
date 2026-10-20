import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  loginId: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; // proxied to the Python backend (see proxy.conf.json)

  login(loginId: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { loginId, password })
      .pipe(
        tap((res) => {
          if (res.success && res.token && res.user) {
            sessionStorage.setItem(TOKEN_KEY, res.token);
            sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
          }
        })
      );
  }

  logout(): Observable<unknown> {
    const headers = this.authHeaders();
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }

  currentUser(): User | null {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${sessionStorage.getItem(TOKEN_KEY) ?? ''}` });
  }
}
