import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ucp.mh-ebs.de/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.success && res.token) {
          this.token = res.token;
          // Token lokal im Gerät speichern
          localStorage.setItem('auth_token', res.token);
        }
      })
    );
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}