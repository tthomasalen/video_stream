import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { OverallService } from '../service/overall.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  user: {Email: string, Premium: boolean} [] = []


  constructor(private http: HttpClient, private overall: OverallService) { 
this.init();
  }


  init() {
    this.http.get<{users: {Email: string, Premium: boolean}[]}>(`${environment.baseUrl}ulist`, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.user = a.users;
      })
  }


  blockCheck(email: string) {
    if(email.split('-')[ email.split('-').length - 1] == 'BLOCKED') {
      return true
    } else {
      return false;
    }

  }


  block(email: string) {
    this.http.post<{users: string[]}>(`${environment.baseUrl}block`, {email}, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.init()
      })
  }


  unblock(email: string) {
    this.http.post<{users: string[]}>(`${environment.baseUrl}unblock`, {email}, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.init()
      })
  }


  remove(email: string) {
    this.http.post<{users: string[]}>(`${environment.baseUrl}udelete`, {email}, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.init()
      })
  }


premium(email: string) {
    this.http.post<{users: string[]}>(`${environment.baseUrl}ptoggle`, {email}, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.init()
      })
}


  ngOnInit(): void {
  }

}
