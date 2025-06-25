import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://dummyjson.com';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.image
          };
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
}