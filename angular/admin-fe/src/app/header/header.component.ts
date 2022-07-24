import { Component, OnInit } from '@angular/core';
import {OverallService} from '../service/overall.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public overall: OverallService) { }

  ngOnInit(): void {
  }

}
