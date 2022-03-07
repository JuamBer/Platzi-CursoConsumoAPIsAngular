import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User, CreateUserDTO } from './../models/user.model';
import { Auth } from './../models/auth.model';
import { tap } from 'rxjs/operators';
import { TokenService } from './../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = `${environment.API_URL}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string){
    return this.http.post<Auth>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.tokenService.saveToken(response.access_token)
      })
    );
  }

  profile() {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }
}
