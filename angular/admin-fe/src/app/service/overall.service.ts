import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OverallService {

login: {
  login: boolean,
   token: string,
     expiry: number,
} = {
login: false,
token: '',
expiry:0
}


  startLogin(reg: {Password: string, Email: string}) {
    lastValueFrom(this.http.post<{token: string}>(`${environment.loginUrl}login`, reg))
    .then(a => {
  this.successAuthentication({token: a.token, login: true})
   
   }).catch((err) => {
    //  this.openDialog('Error', 'Provided invalid details!');
    this.failedAuthentication({token: '', login: false})
   })
   }
  
  
  
  successAuthentication(res: {login: boolean, token: string,}) {
  this.login = {...res, expiry: 3600 + new Date().getTime() / 1000};
  localStorage.setItem('login', JSON.stringify(this.login));
  this.authenticationRedirect('/home');
  this.autoLogout();
  }

  autoLogout() {
    let remove = setInterval(() => {
      if (this.login.expiry < new Date().getTime() / 1000) {
        clearInterval(remove);
        this.authenticationDestroy();
        this.authenticationRedirect('/login');
      }
    }, 2000);
  }


  authenticationRedirect(redirect: string) {
    this.router.navigate([`/${redirect}`]);
  }


  authenticationDestroy() {
    this.login = {
      token: '',
      expiry:0,
      login: false

    }
    localStorage.removeItem('login');
    this.router.navigate(['/login'])
  }
  

  autoLogin() {
    let _login = JSON.parse(localStorage.getItem('login'))
    if (_login && _login.expiry > new Date().getTime() / 1000) {
      this.login = _login;
      this.autoLogout();
    } else {
      this.authenticationDestroy();
  
    }
  }


  failedAuthentication(err: any) {
  
  }
  

  upload(file: File, fi: {title: string, description: string, acceptTerms: any}): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    if(!fi.acceptTerms) {
    fi.acceptTerms = false;
    }

    formData.append('file', file);
    formData.append('title', fi.title);
    formData.append('description', fi.description);
    formData.append('premium', fi.acceptTerms);

    const req = new HttpRequest('POST', `${environment.baseUrl}upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({ token: this.login.token})
    });

    return this.http.request(req);
  }

  constructor(private http: HttpClient, private router: Router) { }
}
