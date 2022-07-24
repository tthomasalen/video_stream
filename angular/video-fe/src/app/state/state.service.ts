import { ElementRef, Injectable } from '@angular/core';
import { Login, Reel } from '../structure/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  login: Login = {
    name: '',
    token: '',
    expiry:0,
    premium: false,
    error: false,
    email: ''
  }


  blocked: boolean = false;


  reel: Reel = {
    title: '',
    description: '',
    id: ''
  }

  like: boolean = false;

  header: ElementRef;
  mainHeader: ElementRef;

  constructor() { }
}
