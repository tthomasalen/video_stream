import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../Services/video.service';
import { environment } from '../../../environments/environment';
import { StateService } from '../../state/state.service';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit, AfterViewInit, OnDestroy {

envAlias = environment.baseUrl;


@ViewChild('videoTag') videoTag: ElementRef;
@ViewChild('watcher') watchContainer: ElementRef;
@ViewChild('blanker') blankContainer: ElementRef;

  constructor(private route: ActivatedRoute, public videoService: VideoService,
     private http: HttpClient, private activatedRoute: ActivatedRoute, public state: StateService) { 
    this.randomVideoFetch();
    activatedRoute.data.subscribe();
   }


  randomVideoFetch() {
    this.http.post<{songs:{title: string, id: string, description: string, premium: boolean}[]}>(`${environment.baseUrl}songs`, {...this.state.login, w: this.route.snapshot.params['id']}).subscribe(a =>{
    this.videoService.videos = a.songs
    this.videoService.currentPositionSetter(this.route.snapshot.params['id'])
    this.videoService.videoDesc()
    this.videoService.currentPosition = -1;
  })
  }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.videoService.video.pause();
  }
  
  ngAfterViewInit() {
    this.watchContainer.nativeElement.style.display = 'none'
    this.blankContainer.nativeElement.style.display = 'none'

    this.videoService.videoCheck(this.route.snapshot.params['id'], this.watchContainer, this.blankContainer)
    
    if(!this.videoService.isIntiliazed) {
      // this.videoService.isIntiliazed = true;
      this.videoService.initVideojs(this.videoTag.nativeElement)
      console.log('initialized');
    }
  this.videoService.source(this.route.snapshot.params['id'])
  }

  changeVideo(id: string) {
    this.videoService.currentPositionSetter(id)
    this.videoService.source(id)
    this.videoService.videoDesc();
  }


}
