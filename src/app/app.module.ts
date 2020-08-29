import { CommentService } from "./comments/comment.service";
import { UiHelperService } from "./uiHelper/uiHelper.service";
import { CancelComponent } from "./uiHelper/cancel/cancel.component";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SongService } from "./songs/song.service";
import { AuthService } from "./auth/auth-service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { StoreModule } from "@ngrx/store";
import { MatSliderModule } from "@angular/material/slider";
import { reducers } from "./app.reducer";

import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ScrollingModule } from "@angular/cdk/scrolling";

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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowseComponent } from "./browse/browse.component";
import { SongCardComponent } from "./browse/song-card/song-card.component";
import { RandomSongComponent } from "./browse/random-song/random-song.component";
import { CommentsComponent } from "./comments/comments.component";
import { ScrollComponent } from "./infiniteScroll/scroll/scroll.component";
import { DropButtonComponent } from "./drop-button/drop-button.component";
import { AudioPlayerComponent } from "./audio-player/audio-player.component";

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
    CancelComponent,
    BrowseComponent,
    SongCardComponent,
    RandomSongComponent,
    CommentsComponent,
    ScrollComponent,
    DropButtonComponent,
    AudioPlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,
    MatSliderModule,
    FlexLayoutModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    DragDropModule,
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
    StoreModule.forRoot(reducers),
  ],
  providers: [AuthService, SongService, UiHelperService, CommentService],
  bootstrap: [AppComponent],
  entryComponents: [CancelComponent],
})
export class AppModule {}
