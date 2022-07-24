import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VideoService } from '../../Services/video.service';
import { StateService } from '../../state/state.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  envAlias = environment.baseUrl;


  @ViewChild('loader') loader: ElementRef;

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  // listOfVideos: any = []
  songLen = 0;

  sort: boolean = false;
  ascOrder: boolean = true;

  constructor(public videoService: VideoService, private http: HttpClient, public state: StateService) { 

  //   this.http.get<{songs:{title: string, id: string}[]}>('http://localhost:5000/songs').subscribe(a =>{
  //   videoService.videos = a.songs
  
  // })
  this.videoService.listOfVideos = [];
this.getVideos(0);
  }


ngAfterViewInit(): void {

  // this.loader.nativeElement.style.display = 'none'
}


  onScrollDown() {
    this.getVideos(this.songLen);
  }

  onUp() {
  }


  sorty(sort: boolean, ascOrder: boolean) {
    if(sort || this.ascOrder) {
      if(ascOrder) {
        console.log('sssssss')
        this.videoService.listOfVideos = this.videoService.listOfVideos.sort((a: any,b: any ) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
      } else  {
        this.videoService.listOfVideos = this.videoService.listOfVideos.sort((a: any,b: any ) => a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1)
      }
      
    }

    console.log(this.videoService.listOfVideos)
  }


  getVideos(len: number) {  
    // this.loader.nativeElement.style.display = ''
    this.http.post<{songs: {id: number, title: string}[]}>(`${environment.baseUrl}songrand?slen=${len}`, this.state.login).pipe(take(1)).subscribe((response) => {   
      this.videoService.listOfVideos = [...this.videoService.listOfVideos, ...response.songs].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
      this.songLen = this.videoService.listOfVideos.length
      // this.loader.nativeElement.style.display = 'none'
    })  
  } 


}
