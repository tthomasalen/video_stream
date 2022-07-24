import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-compat',
  templateUrl: './compat.component.html',
  styleUrls: ['./compat.component.css']
})
export class CompatComponent {

others = {
  hard: navigator.hardwareConcurrency,
  stat: this.data.score < 25 || navigator.hardwareConcurrency >= 4 ? 'You are so good at this moment.' : 'Try to close background processes.'
}


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }



}
