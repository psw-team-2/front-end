import { Component, Input, OnInit } from '@angular/core';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog-comments',
  templateUrl: './blog-comments.component.html',
  styleUrls: ['./blog-comments.component.css']
})
export class BlogCommentsComponent implements OnInit {

  blogComments: BlogComment[] = [];
  selectedBlogComment: BlogComment;
  shouldRenderBlogCommentForm: boolean = false;
  shouldEdit: boolean = false;
  userNames: { [key: number]: string } = {};
  @Input() blogId: number | null;
  
  constructor(private service: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getBlogComment();
  }
  
  deleteBlogComment(id: number): void {
    this.service.deleteBlogComment(id).subscribe({
      next: () => {
        this.getBlogComment();
      },
    })
  }

  getBlogComment(): void {
    this.service.getBlogComment().subscribe({
      next: (result: PagedResults<BlogComment>) => {
        this.blogComments = result.results;
        this.loadUserNames(); 
      },
      error: () => {
      }
    })
  }

  loadUserNames(): void {
    this.blogComments.forEach((blogComment) => {
      this.authService.getUserById(blogComment.userId).subscribe((user: User) => {
        this.userNames[blogComment.userId] = user.username;
      });
    });
  }

  onEditClicked(blogComment: BlogComment): void {
    this.selectedBlogComment = blogComment;
    this.shouldRenderBlogCommentForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderBlogCommentForm = true;
    
  }

  getUserName(userId: number): string {
    if (this.userNames[userId]) {
      return this.userNames[userId];
    }
    return 'Nepoznato';
  }


}
