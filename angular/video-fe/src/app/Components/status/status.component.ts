import { Component, OnInit } from '@angular/core';
import { StateService } from '../../state/state.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  longText = `${new Date(this.state.login.expiry*1000).toLocaleDateString()} ${new Date(this.state.login.expiry*1000).toTimeString()}`
  constructor(public state: StateService) { }

  ngOnInit(): void {
  }



}
