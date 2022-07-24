import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from './Services/authentication.service';
import { StateService } from './state/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('mainHeader', {static: true}) mainHeader: ElementRef;

  title = 'Andromeda';


  constructor(private auth: AuthenticationService, private stater: StateService,) {

    this.auth.autoLogin();
  }

  ngAfterViewInit(): void {
    this.stater.mainHeader = this.mainHeader;
  }

}
