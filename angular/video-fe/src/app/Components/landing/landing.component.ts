import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../state/state.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnDestroy, AfterViewInit {

  album_arts = ['1656864941683.png','1656899725676.png','1656900450664.png','1656900594863.png','1656900640444.png','1656900891384.png','1656900951769.png','1656901010666.png','1656901078640.png','1656901146904.png','1656901200121.png','1656901269581.png','1656915332916.png'];
  img: string = this.album_arts[0];



  constructor(public state: StateService) { 
  
    
  }

  async looper() {
    let count = 0;
    while (true) {
      await new Promise((res,rej)=>{
        setTimeout(() => {
          res('');
        }, 2000);
      })
      
      if (count > this.album_arts.length-1) {
        count = 0;
      }
      this.img = this.album_arts[count];
      count++;
    }
  }


ngAfterViewInit(): void {
    this.state.mainHeader.nativeElement.style.display = 'none'
    this.state.header.nativeElement.style.display = 'none'
    this.looper();
}


ngOnDestroy(): void {
  this.state.mainHeader.nativeElement.style.display = ''
  this.state.header.nativeElement.style.display = ''
  
}



}
