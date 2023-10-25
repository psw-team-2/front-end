import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { SinglePostComponent } from 'src/app/feature-modules/blog/single-post/single-post.component';
import { BlogManagemetComponent } from 'src/app/feature-modules/blog/blog-managemet/blog-managemet.component';

import { BlogCommentsComponent } from 'src/app/feature-modules/blog/blog-comments/blog-comments.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'blog-comments', component: BlogCommentsComponent, canActivate: [AuthGuard],},
  {path: 'post', component: SinglePostComponent},
  {path: 'blog-management', component: BlogManagemetComponent, canActivate: [AuthGuard],},
  { path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard],},
  { path: 'blog-form/:id', component: BlogFormComponent, canActivate: [AuthGuard], }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
