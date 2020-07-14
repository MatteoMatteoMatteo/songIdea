import { CurrentSongComponent } from "./songs/current-song/current-song.component";
import { AddSongComponent } from "./songs/add-song/add-song.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { StartComponent } from "./start/start.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", component: StartComponent },
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "add-song", component: AddSongComponent },
  { path: "current-song", component: CurrentSongComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
