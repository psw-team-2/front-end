import { Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogComment } from '../model/blog-comment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-comments-review',
  templateUrl: './comments-review.component.html',
  styleUrls: ['./comments-review.component.css']
})
export class CommentsReviewComponent implements OnInit {
  @Input() comments: BlogComment[] = [];
  blogId : number;

  

  constructor(private blogService: BlogService, private route: ActivatedRoute) { // Prilagodite servis

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
}

