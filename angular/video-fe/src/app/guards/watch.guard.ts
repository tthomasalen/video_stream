import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoService } from '../Services/video.service';

@Injectable({
  providedIn: 'root'
})
export class WatchGuard implements CanActivate {


constructor(private videoService: VideoService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    // return this.videoService.videoCheck(route.params['id']);
    return true
  }
  
}
