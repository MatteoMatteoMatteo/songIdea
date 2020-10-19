import { ProfileComponent } from "./profile/profile.component";
import { UploadComponent } from "./upload/upload.component";
import { BrowseComponent } from "./browse/browse.component";
import { AuthGuard } from "./auth/auth.guard";
import { SongsComponent } from "./songs/songs.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { StartComponent } from "./start/start.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", component: StartComponent, data: { animation: "1" } },
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  {
    path: "mySongs",
    component: SongsComponent,
    data: { animation: "2" },
  },
  {
    path: "browse",
    component: BrowseComponent,
    data: { animation: "3" },
  },
  {
    path: "upload",
    component: UploadComponent,
    data: { animation: "2" },
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    data: { animation: "2" },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
