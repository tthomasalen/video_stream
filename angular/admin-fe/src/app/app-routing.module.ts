import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from './login/login.component'
import { UploadComponent } from './upload/upload.component';
import { VideosComponent } from './videos/videos.component';
import {LoginGuard} from './guards/login.guard'
import { BlockloginGuard } from './guards/blocklogin.guard';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent, canActivate: [BlockloginGuard]},
  {path: 'home', component: HomeComponent, canActivate: [LoginGuard]},
  {path: 'videos', component: VideosComponent, canActivate: [LoginGuard]},
  {path: 'upload', component: UploadComponent, canActivate: [LoginGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
