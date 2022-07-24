import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OverallService } from '../service/overall.service';

@Injectable({
  providedIn: 'root'
})
export class BlockloginGuard implements CanActivate {

  constructor(private router: Router, private overall: OverallService) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.overall.login.token != '') {
        this.router.navigate(['/home']);
        return false;
      }
    return true;
  }
  
}
