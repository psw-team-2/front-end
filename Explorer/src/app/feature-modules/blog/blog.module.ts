import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCommentFormComponent } from './blog-comment-form/blog-comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogCommentsComponent } from './blog-comments/blog-comments.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { BlogManagemetComponent } from './blog-managemet/blog-managemet.component';
import { BlogReviewComponent } from './blog-review/blog-review.component';

@NgModule({
  declarations: [
    BlogFormComponent,
    SinglePostComponent,
    BlogManagemetComponent,
    BlogCommentFormComponent,
    BlogCommentsComponent,
    BlogReviewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    BlogCommentFormComponent,
    BlogFormComponent,
    SinglePostComponent,
    BlogManagemetComponent,
    BlogCommentsComponent,
    BlogReviewComponent,
  ]
})
export class BlogModule { }
