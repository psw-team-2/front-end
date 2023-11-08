import { Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogComment } from '../model/blog-comment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';


@Component({
  selector: 'xp-comments-review',
  templateUrl: './comments-review.component.html',
  styleUrls: ['./comments-review.component.css']
})
export class CommentsReviewComponent implements OnInit {
  @Input() comments: BlogComment[] = [];
  blogId : number;
  selectedBlogComment: BlogComment | null;
  shouldRenderBlogCommentForm: boolean = false;
  shouldEdit: boolean = false;
  userNames: { [key: number]: string } = {};
  

  constructor(private blogService: BlogService, private route: ActivatedRoute, private authService: AuthService) { 

  }

  editedCommentText: string = '';

  onEditClicked(comment: BlogComment): void {
    this.selectedBlogComment = comment;
    this.editedCommentText = comment.text;
  }

  

  onSaveCommentEdit(comment: BlogComment): void {
    if (this.selectedBlogComment) {
      
      const updatedComment = { ...this.selectedBlogComment, text: this.editedCommentText };
      
      // Pozovite odgovarajući servis da sačuva izmene na serveru
      this.blogService.updateBlogComment(updatedComment).subscribe((result) => {
        if (result) {
          // Osvežite listu komentara nakon uređivanja
          this.comments = this.comments.map((comment) => {
            return comment.id === updatedComment.id ? updatedComment : comment;
          });

          // Obrišite selektovani komentar nakon uređivanja
          this.selectedBlogComment = null;
          this.editedCommentText = '';
        }
      });
    }

    
  }

  onCancelEdit(): void {
    this.selectedBlogComment = null;
    this.editedCommentText = '';
  }

  ngOnInit(): void {
   
    this.route.params.subscribe(params => {
      const blogId = +params['id']; // Ovo 'blogId' mora da se poklapa sa imenom parametra iz URL-a
      if (blogId) {
        this.getCommentsByBlogId(blogId);
      } else {
        // Handle the case when there is no valid blog ID in the URL.
      }
    });
  }
  getTourReviewByTourId(tourId: number) {
    throw new Error('Method not implemented.');
  }
 

  getCommentsByBlogId(blogId: number): void {
    this.blogService.getCommentsByBlogId(blogId).subscribe({
      next: (result: PagedResults<BlogComment>) => {
        this.comments = result.results;
        
      },
      error: () => {
        
      }

    });
  }

  deleteBlogComment(id: number): void {
    this.blogService.deleteBlogComment(id).subscribe({
      next: () => {
        this.getBlogComment();
      },
    })
  }

  getBlogComment(): void {
    this.blogService.getBlogComment().subscribe({
      next: (result: PagedResults<BlogComment>) => {
        this.comments = result.results;
       
      },
      error: () => {
      }
    })
  }

 


}

