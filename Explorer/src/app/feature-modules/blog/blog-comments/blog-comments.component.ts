import { Component, OnInit } from '@angular/core';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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
  
  constructor(private service: BlogService) { }

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
      },
      error: () => {
      }
    })
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

}
