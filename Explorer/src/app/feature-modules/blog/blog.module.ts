import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCommentFormComponent } from './blog-comment-form/blog-comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogCommentsComponent } from './blog-comments/blog-comments.component';




@NgModule({
  declarations: [
    BlogCommentFormComponent,
    BlogCommentsComponent,
   
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
   BlogCommentFormComponent
  ]
})
export class BlogModule { }
