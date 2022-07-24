import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OverallService } from '../service/overall.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: any = []

  constructor(private http: HttpClient, private overall: OverallService) {

    this.initVid()


   }

  ngOnInit(): void {
  }

  removeVid(id: string) {
    this.http.post<{users: string[]}>(`${environment.baseUrl}vdelete`, {id}, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.initVid()
      })
  }


  initVid() {
    this.http.get<{videos: {}[]}>(`${environment.baseUrl}vlist`, {
      headers: new HttpHeaders({'Content-Type':  'application/json', token: this.overall.login.token})}).subscribe((a) => {
        this.videos = a.videos;
      })
  }

}
