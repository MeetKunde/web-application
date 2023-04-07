import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  // http options used for making API calls
  private httpOptions: any;

  /** Actual JWT access token. */
  public accessToken: string | null;

  /** Actual JWT refresh token. */
  public refreshToken: string | null;

  // the token expiration date
  public token_expires: Date | null;

  // the username of the logged in user
  public username: string | null;

  // error messages received from the login attempt
  public error: any;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.accessToken = null;
    this.refreshToken = null;
    this.token_expires = null;
    this.username = null;
    this.error = null;
  }

  public login(user: any) {
    this.http.post('/api-token-auth/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        if (data instanceof ArrayBuffer) { return }
        const token1 = data['access'];
        const token2 = data['refresh'];
        this.updateData(token1, token2);
        this.username = user['username'];
      },
      err => {
        this.error = err['error']['detail'];
      }
    );
  }

  public refresh() {
    this.http.post('/api-token-refresh/', JSON.stringify({ refresh: this.refreshToken }), this.httpOptions).subscribe(
      data => {
        if (data instanceof ArrayBuffer) { return }
        const token = data['access'];
        this.updateData(token, this.refreshToken!);

      },
      err => {
        this.error = err['error']['detail'];
      }
    );
  }

  public logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.token_expires = null;
    this.username = null;
  }

  private updateData(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.error = null;

    // decode the token to read the username and expiration timestamp
    const token_parts = this.accessToken.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
  }

}