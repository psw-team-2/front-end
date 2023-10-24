import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SinglePostComponent } from './single-post/single-post.component';
import { BlogManagemetComponent } from './blog-managemet/blog-managemet.component';

@NgModule({
  declarations: [
    BlogFormComponent,
    SinglePostComponent,
    BlogManagemetComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    BlogFormComponent,
    SinglePostComponent,
    BlogManagemetComponent
  ]
})
export class BlogModule { }
