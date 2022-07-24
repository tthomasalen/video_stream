import { ElementRef, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';
import { StateService } from '../state/state.service';
import {AuthenticationService} from '../Services/authentication.service'

declare var videojs: any;


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  video: any;
  isIntiliazed: boolean = false;
  videos: { title: string, id: string, description: string, premium: boolean }[] = [];
  currentPosition: number = 0;
  videoContainer: ElementRef;

  listOfVideos: any = [];
  listOfPlayVideos: any = []
  filteredSongs: {id: string, title: string}[] = [];


  constructor(private location: Location, private route: ActivatedRoute, private http: HttpClient, private state: StateService, private auth: AuthenticationService) {

    auth.sock.on('remove', (e: string) => {
      let ider = JSON.parse(e).id;
      this.videos = this.videos.filter((a: any) => a.id != ider);
      this.listOfPlayVideos = this.listOfPlayVideos.filter((a: any) => a.id != ider);
      this.listOfVideos = this.listOfVideos.filter((a: any) => a.id != ider);
      this.filteredSongs = this.filteredSongs.filter((a: any) => a.id != ider);
    })


   }


  initVideojs(videoTag: any) {
    this.video = videojs(videoTag, {
      playbackRates: [0.5, 1, 1.5, 2]
    })
    this.video.volume(0.5)
    this.createVjsBtn('nextButton', 'vjs-icon-next-item vjs-control vjs-button')
    // this.video.fill(true);
    // this.video.fluid(true);
    // this.video.aspectRatio('16:9')
    // this.video.responsive(true)

    this.video.on('ended', () => {
   this.next()
    })

  }


  currentPositionSetter(pos: string) {
    this.currentPosition = this.videos.indexOf(this.videos.filter(a => a['id'] == pos)[0])
  }


  next() {
    this.currentPosition = this.videos.indexOf(this.videos[this.currentPosition])
    this.currentPosition = (this.currentPosition + 1) % this.videos.length
    this.source(this.posToId(this.currentPosition));
    // this.video.play()
  }


  async videoCheck(id: string, watcher: ElementRef, blanker: ElementRef) {
    let subs: any = this.http.post<{ error: boolean }>(`${environment.baseUrl}check?w=${id}`, this.state.login).pipe(map(a => a.error))

    subs = await lastValueFrom(subs).catch(a => a.error);
    if (subs) {
      blanker.nativeElement.style.display = 'flex';
    } else {
      watcher.nativeElement.style.display = 'flex'
    }
  }


  videoDesc() {
    this.state.reel = {title: this.videos[this.currentPosition]['title'],
     description: this.videos[this.currentPosition]['description'],
      id: this.videos[this.currentPosition]['id']}
      this.playlistCheck(this.state.reel.id);
  }


  posToId(pos: number) {
    this.videoDesc();
    return this.videos[this.currentPosition]['id']
  }


  source(id: string) {
    // this.videoCheck(id)
     this.video.poster(`${environment.baseUrl}image/${id}.png`)
    this.video.src({ src: `${environment.baseUrl}stream?w=${id}&token=${this.state.login.token}`, type: 'video/mp4' })
    this.location.replaceState(`/watch/${id}`)
  }


  createVjsBtn(name: string, classer: string) {
    const Button = videojs.getComponent('Button');
    const nextBtn = videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments);
      },
      handleClick: () => {
        this.next();
      },
      buildCSSClass: function () {
        return classer;
      }
    });
    videojs.registerComponent(name, nextBtn);
    this.video.getChild('controlBar').addChild(name, {}, 1);
  }


  playlist(id: string) {
    this.http.post<{stat: boolean}>(`${environment.baseUrl}playlistadd`, {id, token: this.state.login.token}).subscribe(a => this.state.like = a.stat);
  }

  playlistCheck(id: string) {
    this.http.post<{stat: boolean}>(`${environment.baseUrl}playlistcheck`, {id, token: this.state.login.token}).subscribe(a => this.state.like = a.stat);
  }


}
