import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../Services/authentication.service';
import { VideoService } from '../../Services/video.service';
import { StateService } from '../../state/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

envImporter = environment.baseUrl;

  searcher = new FormControl('');
  @ViewChild('header') header: ElementRef;

  constructor(private auth: AuthenticationService,
    public stater: StateService,
    public videoService: VideoService,
    private router: Router,
    private http: HttpClient) {


 

      this.searcher.valueChanges.subscribe((e) => {
        e = e==undefined? '' : e
        http.post<{songs: {id: string, title: string}[]}>(`${environment.baseUrl}search`, {...this.stater.login, search: e}).subscribe(a => {
          this.videoService.filteredSongs = a.songs;
        })
      })


     }


  ngAfterViewInit(): void {
    this.stater.header = this.header
  }


  logout() {
    this.auth.authenticationDestroy()
    this.router.navigate(['/register'])
  }


  changeVideo(id: string) {
    if(this.router.url.toString().split('/')[1] == 'watch') {
      this.http.post<{songs:{title: string, id: string, description: string, premium: boolean}[]}>(`${environment.baseUrl}songs`, {...this.stater.login, w: id}).subscribe(a =>{
        this.videoService.videos = a.songs
        this.videoService.currentPositionSetter(id)
        this.videoService.videoDesc()
        this.videoService.currentPosition = -1;
        this.videoService.source(id)
      })
    } else {
      this.router.navigate(['/watch/'+ id])
    }


    
  }



}
