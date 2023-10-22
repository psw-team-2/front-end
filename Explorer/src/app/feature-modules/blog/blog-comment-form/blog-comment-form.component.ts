import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'xp-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.css']
})
export class BlogCommentFormComponent {

  @Output() blogCommentUpdated = new EventEmitter<null>();
  @Input() blogComment: BlogComment;
  @Input() shouldEdit: boolean = false;

  blogCommentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
  });

  constructor(private service: BlogService) {
  }

  ngOnChanges(): void {
    this.blogCommentForm.reset();
    if(this.shouldEdit) {
      this.blogCommentForm.patchValue(this.blogComment);
    }
  }

    addBlogComment(): void {
      
    console.log(this.blogComment.creationTime);
    const blogComment: BlogComment = {
      
      text: this.blogCommentForm.value.text || "",
      creationTime: this.blogComment.creationTime
    };
    console.log(blogComment.creationTime);
    this.service.addBlogComment(blogComment).subscribe({
      next: () => { this.blogCommentUpdated.emit() }
    });
  }

  updateBlogComment(): void {
    const blogComment: BlogComment = {
      
      text: this.blogCommentForm.value.text || "",
      creationTime: this.blogComment.creationTime

    };
    blogComment.id = this.blogComment.id;
    this.service.updateBlogComment(blogComment).subscribe({
      next: () => { this.blogCommentUpdated.emit();}
    });
  }

}
