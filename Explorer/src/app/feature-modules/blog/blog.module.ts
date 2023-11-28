import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCommentFormComponent } from './blog-comment-form/blog-comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogCommentsComponent } from './blog-comments/blog-comments.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { BlogManagemetComponent } from './blog-managemet/blog-managemet.component';
import { BlogSinglePostComponent } from './blog-single-post/blog-single-post.component';
import { BlogReviewComponent } from './blog-review/blog-review.component';
import { CommentsReviewComponent } from './comments-review/comments-review.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    BlogFormComponent,
    SinglePostComponent,
    BlogManagemetComponent,
    BlogCommentFormComponent,
    BlogCommentsComponent,
    BlogSinglePostComponent,
    BlogReviewComponent,
    CommentsReviewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule
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
