import { UiHelperService } from "./uiHelper/uiHelper.service";
import { CancelComponent } from "./uiHelper/cancel/cancel.component";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SongService } from "./songs/song.service";
import { AuthService } from "./auth/auth-service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { SongsComponent } from "./songs/songs.component";
import { AddSongComponent } from "./songs/add-song/add-song.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
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
import { MatTabsModule } from "@angular/material/tabs";
import { MySongsComponent } from "./songs/my-songs/my-songs.component";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { CurrentSongComponent } from "./songs/current-song/current-song.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowseComponent } from "./browse/browse.component";
import { SongCardComponent } from './browse/song-card/song-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    SongsComponent,
    AddSongComponent,
    StartComponent,
    MainNavComponent,
    SideNavComponent,
    MySongsComponent,
    CurrentSongComponent,
    CancelComponent,
    BrowseComponent,
    SongCardComponent,
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
    MatTabsModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [AuthService, SongService, UiHelperService],
  bootstrap: [AppComponent],
  entryComponents: [CancelComponent],
})
export class AppModule {}
