import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { Blog } from '../model/blog.model';
import { ActivatedRoute } from '@angular/router';
import { BlogComment } from '../model/blog-comment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-blog-single-post',
  templateUrl: './blog-single-post.component.html',
  styleUrls: ['./blog-single-post.component.css']
})



export class BlogSinglePostComponent implements OnInit {
  blogPost: Blog;
  blogSinglePost: BlogSinglePostComponent;
  blogId: number;
  comments: BlogComment[] = [];



constructor(private blogService: BlogService, private route: ActivatedRoute) { }


ngOnInit(): void {

  this.route.paramMap.subscribe((params) => {
    const blogId = params.get('id');
    if (blogId) {
      this.blogId = +blogId;
      this.blogService.getBlog(this.blogId).subscribe((data: Blog) => {
        this.blogPost = data;
       // this.getCommentsByBlogId(this.blogId);
       if (blogId) {
        this.getCommentsByBlogId(this.blogId);
      } else {
        // Handle the case when there is no valid tour ID in the URL.
      }
      });
    }
  });
  }
  async getCommentsByBlogId(blogId: number): Promise<void> {
    try {
      const result = await this.blogService.getCommentsByBlogId(blogId).toPromise();
  
      if (result && Array.isArray(result) && result.length > 0) {
  
        
        const firstReview = result[0];
  
        
        this.comments = result;
  
        
      } else {
        console.error('Invalid response format: Tour review data is unavailable.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
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

  /*getCommentsByBlogId(blogId: number): void {
    if (blogId) {
      this.blogService.getCommentsByBlogId(blogId).subscribe({
        next: (result: PagedResults<BlogComment>) => {
          this.comments = result.results;
        },
        error: () => {
          // Obrada greške
        }
      });
    } else {
      // Obrada slučaja kada blogId nije postavljen
    }
  }*/
}



    