import { GestionDocumentosComponent } from './../components/gestion-documentos/gestion-documentos.component';

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "../components/login/login.component";






const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },



  { path: "documentitos", component: GestionDocumentosComponent },

  { path: "login", component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
