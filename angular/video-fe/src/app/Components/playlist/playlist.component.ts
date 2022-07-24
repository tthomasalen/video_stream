import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StateService } from '../../state/state.service';
import { take } from 'rxjs';
import { VideoService } from '../../Services/video.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

envAlias = environment.baseUrl;

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  sort: boolean = false;
  ascOrder: boolean = true;

  // listOfPlayVideos: any = []
  songLen = 0;

  constructor(private http: HttpClient, private state: StateService, public videoService: VideoService) { 

    this.videoService.listOfPlayVideos =[];
    this.getVideos(0)
  }

  ngOnInit(): void {
  }

  onScrollDown() {
    this.getVideos(this.songLen);
  }

  getVideos(len: number) {  
    // this.loader.nativeElement.style.display = ''
    this.http.post<{songs: {id: number, title: string}[]}>(`${environment.baseUrl}playlist?slen=${len}`, this.state.login).pipe(take(1)).subscribe((response) => {   
      this.videoService.listOfPlayVideos = [...this.videoService.listOfPlayVideos, ...response.songs].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);;
      this.songLen = this.videoService.listOfPlayVideos.length
      // this.loader.nativeElement.style.display = 'none'
    })  
  }
  
  sorty(sort: boolean, ascOrder: boolean) {
    if(sort || this.ascOrder) {
      if(ascOrder) {
        console.log('sssssss')
        this.videoService.listOfPlayVideos = this.videoService.listOfPlayVideos.sort((a: any,b: any ) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
      } else  {
        this.videoService.listOfPlayVideos = this.videoService.listOfPlayVideos.sort((a: any,b: any ) => a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1)
      }
      
    }

    console.log(this.videoService.listOfVideos)
  }

}
