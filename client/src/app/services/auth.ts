
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5194/api/Account';

  readonly isLoggedIn = signal(
    typeof localStorage !== 'undefined' &&
    !!localStorage.getItem('betaware_token')
  );

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('betaware_token', response.token);
          this.isLoggedIn.set(true);
        })
      );
  }

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem('betaware_token');
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('betaware_token');
  }
}
