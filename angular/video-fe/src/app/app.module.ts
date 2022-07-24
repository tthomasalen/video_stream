import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WatchComponent } from './Components/watch/watch.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { RegisterComponent } from './Components/register/register.component';
import { LandingComponent } from './Components/landing/landing.component';
import { LoginComponent } from './Components/login/login.component';
import { DialogComponent } from './Components/snippets/dialog/dialog.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { StatusComponent } from './Components/status/status.component';
import { HeaderComponent } from './Components/header/header.component';
import { CompatComponent } from './Components/snippets/compat/compat.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchComponent,
    HomeComponent,
    NotFoundComponent,
    RegisterComponent,
    LandingComponent,
    LoginComponent,
    DialogComponent,
    PlaylistComponent,
    StatusComponent,
    HeaderComponent,
    CompatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }