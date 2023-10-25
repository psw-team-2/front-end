import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { AuthService } from '../../../infrastructure/auth/auth.service';



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

  constructor(private service: BlogService,private authService: AuthService) {
  }

  ngOnChanges(): void {
    this.blogCommentForm.reset();
    if(this.shouldEdit) {
      this.blogCommentForm.patchValue(this.blogComment);
    }
  }

    addBlogComment(): void {
      
    const userId = this.authService.user$.value.id;
    const blogComment: BlogComment = {

      
      text: this.blogCommentForm.value.text || "",
      creationTime: new Date('2023-10-22T10:30:00'),
      userId: userId,
      blogId:0,
      lastModification: new Date('2023-10-22T10:30:00')
    };

    
    
    this.service.addBlogComment(blogComment).subscribe({
      next: () => { this.blogCommentUpdated.emit() }
    });
  }

  updateBlogComment(): void {
    const userId = this.authService.user$.value.id;
    const blogComment: BlogComment = {
      
      text: this.blogCommentForm.value.text || "",
      creationTime: this.blogComment.creationTime,
      userId: userId,
      blogId:0,
      lastModification: new Date('2023-10-22T10:30:00')

    };
    blogComment.id = this.blogComment.id;
    this.service.updateBlogComment(blogComment).subscribe({
      next: () => { this.blogCommentUpdated.emit();}
    });
  }

}
