import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { VideoService } from '../Services/video.service';

@Injectable({
  providedIn: 'root'
})
export class WatchResolver implements Resolve<boolean> {


constructor(private videoService: VideoService) {}


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return of(true);
  }
}
