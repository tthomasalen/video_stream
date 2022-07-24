import { Injectable } from '@angular/core';
import {HttpClient, } from '@angular/common/http'
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import {StateService} from '../state/state.service'
import { JwtHelperService } from "@auth0/angular-jwt";
import {Router} from '@angular/router'
import {DialogComponent} from '../Components/snippets/dialog/dialog.component'
import { MatDialog } from '@angular/material/dialog';
import {environment} from '../../environments/environment'
import { CompatComponent } from '../Components/snippets/compat/compat.component';


declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
   helper = new JwtHelperService();
   sock: any;
  constructor(private http: HttpClient,
     private state: StateService,
      private route: Router,
      public dialog: MatDialog) { 
        

        this.sock = io(`http://localhost:5000`)


        this.sock.on('blocked', (e:string) => {
          console.log(e)
          if(JSON.parse(e).email == state.login.email)
          this.blocker();
        })


        this.sock.on('premium', (e:string) => {
          console.log(e)
          if(JSON.parse(e).email == state.login.email)
          this.premiumChanger(JSON.parse(e).premium)
        })



      }


      compatCheck() {
    let t = performance.now()
    for(let i=0; i<1000000; i++) {
    }
    t = performance.now() - t;
        this.dialog.open(CompatComponent, {
          disableClose: true,
          data: {
            score: +t.toFixed(2)
          },
        });
      }




      openDialog(title: string, error: string) {
        this.dialog.open(DialogComponent, {
          data: {
            error,
            title
          },
        });
      }




premiumChanger(premium: boolean) {
  let _login = JSON.parse(localStorage.getItem('login'))
  _login = {..._login, premium}
  localStorage.setItem('login', JSON.stringify(_login));
  this.state.login = _login;
  this.route.navigate(['/status']);
  setTimeout(() =>   this.route.navigate(['/home']), 1000 )
}


blocker() {
    this.authenticationDestroy();
    this.openDialog('Warning!', 'You are blocked!');
}


startRegisteration(reg: {name: string, password: string, email: string}) {
 lastValueFrom(this.http.post<{error: boolean, token: string, premium: boolean}>(`${environment.baseUrl}register`, reg))
 .then(a => {
this.tokenTo(a);
}).catch((err) => {
  this.openDialog('Error', 'Something Went Wrong!');
})
}


startLogin(reg: {password: string, email: string}) {
  lastValueFrom(this.http.post<{error: boolean, token: string, premium: boolean}>(`${environment.baseUrl}login`, reg))
  .then(a => {
 this.tokenTo(a);
 
 }).catch((err) => {
   this.openDialog('Error', 'Provided invalid details!');
 })
 }

tokenTo(a: any) {

  let decodedToken = this.helper.decodeToken(a.token);

  decodedToken = {name: decodedToken.data.name, expiry: decodedToken.exp, error: false, premium: a.premium, token: a.token, email: decodedToken.data.email}
  console.log(decodedToken);
  this.successAuthentication(decodedToken)
}


successAuthentication(res: {error: boolean, token: string, name: string, expiry: number, premium: boolean, email: string}) {
this.state.login = res;
localStorage.setItem('login', JSON.stringify(res));
this.compatCheck()
this.authenticationRedirect('/home');
this.autoLogout();
}

failedAuthentication(err: any) {

}


authenticationDestroy() {
  this.state.login = {
    name: '',
    token: '',
    expiry:0,
    premium: false,
    error: false,
    email: ''
  }
  localStorage.removeItem('login');
}


autoLogout() {
  let remove = setInterval(() => {
    if (this.state.login.expiry < new Date().getTime() / 1000) {
      clearInterval(remove);
      this.authenticationDestroy();
      this.authenticationRedirect('/register');
    }
  }, 2000);
}


authenticationRedirect(redirect: string) {
  this.route.navigate([`/${redirect}`]);
}


autoLogin() {
  let _login = JSON.parse(localStorage.getItem('login'))
  if (_login && _login.expiry > new Date().getTime() / 1000) {
    this.state.login = _login;
    this.autoLogout();
  } else {
    this.authenticationDestroy();

  }
}

}
