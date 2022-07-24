import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { WatchComponent } from './Components/watch/watch.component';
import { RegisterComponent } from './Components/register/register.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { LandingComponent} from './Components/landing/landing.component'
import {LoginComponent} from './Components/login/login.component'
import { WatchResolver } from './Resolvers/watch.resolver';
import { WatchGuard } from './guards/watch.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoginBlockGuard } from './guards/login-block.guard';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import {StatusComponent} from './Components/status/status.component'

const routes: Routes = [
 { path: '',   redirectTo: '/landing', pathMatch: 'full' },
 {path: 'landing', component: LandingComponent},
 { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
 { path: 'playlist', component: PlaylistComponent, canActivate: [AuthGuard]},
 { path: 'status', component: StatusComponent, canActivate: [AuthGuard]},
 { path: 'watch/:id', component: WatchComponent, canActivate: [AuthGuard]},
 {path: 'register', component: RegisterComponent, canActivate: [LoginBlockGuard]},
 {path: 'login', component: LoginComponent, canActivate: [LoginBlockGuard]},
 { path: 'notfound', component: NotFoundComponent},
 { path: '**', redirectTo: '/notfound', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
