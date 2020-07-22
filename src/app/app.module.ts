import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { SongsComponent } from "./songs/songs.component";
import { CurrentSongComponent } from "./songs/current-song/current-song.component";
import { AddSongComponent } from "./songs/add-song/add-song.component";
import { StartComponent } from "./start/start.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MainNavComponent } from "./nav/mainNav/mainNav.component";
import { SideNavComponent } from "./nav/sideNav/sideNav.component";

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    SongsComponent,
    CurrentSongComponent,
    AddSongComponent,
    StartComponent,
    MainNavComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
