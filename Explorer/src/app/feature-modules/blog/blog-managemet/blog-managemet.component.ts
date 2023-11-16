import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Blog, BlogStatus, numberToBlogStatus } from '../model/blog.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';



@Component({
  selector: 'xp-blog-managemet',
  templateUrl: './blog-managemet.component.html',
  styleUrls: ['./blog-managemet.component.css']
})
export class BlogManagemetComponent {
  @Output() blogUpdated = new EventEmitter<null>();
  blogs: Blog[] = [];
  selectedBlog: Blog;
  shouldEdit: boolean = false;
  numberToBlogStatus = numberToBlogStatus;
  BlogStatus = BlogStatus;
  olderFileUrl: string | null = null;
  userId = this.authService.user$.value.id;

  constructor(private service: BlogService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getBlogsByUserId(this.userId);
  }

  /*getBlogs(): void {
    this.service.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
      },
      error: () => {
      }
    })
  }*/

  closeBlog(blog: Blog): void {
    this.updateBlogStatus(blog, BlogStatus.Closed);
  }

  publishBlog(blog: Blog): void {
    this.updateBlogStatus(blog, BlogStatus.Published);
  }

  updateBlogStatus(blog: Blog, newStatus: BlogStatus): void {
    blog.status = newStatus;
    this.service.updateBlog(blog).subscribe({
      next: () => {
        this.blogUpdated.emit();
      }
    });
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.router.navigate(['blog-form']); 
  }

  onEditClicked(blog: Blog): void {
    this.selectedBlog = blog;
    this.shouldEdit = true;
    this.olderFileUrl = blog.image;
    this.router.navigate(['blog-form', blog.id]);
  }
  
  deleteBlog(id: number): void {
    this.service.deleteBlog(id).subscribe({
      next: () => {
        this.getBlogsByUserId(this.userId);
      },
    })
  }

  async getBlogsByUserId(userId: number): Promise<void> {
    try {
      userId = this.userId;
      const result = await this.service.getBlogsByUserId(userId).toPromise();
  
      if (result && Array.isArray(result) && result.length > 0) {
  
        const firstBlog = result[0];
  
        this.blogs = result;
  
      } else {
        console.error('Invalid response format: blog data is unavailable.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

}
