import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { Blog, BlogStatus } from '../model/blog.model';
import { Observable } from 'rxjs';
import { BlogFormComponent } from '../blog-form/blog-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'xp-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.css']
})
export class BlogCommentFormComponent {

  @Output() blogCommentUpdated = new EventEmitter<BlogComment | null>();
  @Input() blogComment: BlogComment;
  @Input() shouldEdit: boolean = false;
  @Input() blogId :  number = -1;
  @Output() blogCommentAdded = new EventEmitter<BlogComment>();

  blogCommentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
  });

  constructor(private service: BlogService,private authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnChanges(): void {
    this.blogCommentForm.reset();
    if(this.shouldEdit) {
      this.blogCommentForm.patchValue(this.blogComment);
    }
  }

    addBlogComment(): void {
      let blog$: Observable<Blog> = this.service.getBlog(this.blogId); // Prilagodite ovaj poziv prema vašem servisu

      blog$.subscribe((blog: Blog) => {
        if (blog.status == BlogStatus.Closed) {
          // Blog je zatvoren, ne dozvoljavajte dodavanje komentara
          return;
        }
        else{
          const userId = this.authService.user$.value.id;
          const username = this.authService.user$.value.username;
          if (this.blogCommentForm.value.text != null && this.blogCommentForm.value.text != ""){
            const blogComment: BlogComment = {
      
              text: this.blogCommentForm.value.text || "",
              creationTime: new Date('2023-10-22T10:30:00'),
              userId: userId,
              username: username,
              blogId: this.blogId,
              lastModification: new Date('2023-10-22T10:30:00')
            };
            this.service.addBlogComment(blogComment).subscribe({
              next: () => { this.blogCommentForm.reset(); this.blogCommentUpdated.emit(blogComment); this.showNotification('Comment successfully added!'); this.blogCommentAdded.emit(blogComment);}
            });
          }
    
          
        }
      })
    }
  

  updateBlogComment(): void {
    const userId = this.authService.user$.value.id;
    const username = this.authService.user$.value.username;
    const blogComment: BlogComment = {
      
      text: this.blogCommentForm.value.text || "",
      creationTime: this.blogComment.creationTime,
      userId: userId,
      username: username,
      blogId: this.blogId,
      lastModification: new Date('2023-10-22T10:30:00')

    };
    blogComment.id = this.blogComment.id;
    this.service.updateBlogComment(blogComment).subscribe({
      next: () => { this.blogCommentUpdated.emit(); this.showNotification('Comment successfully edited!')}
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }

}
