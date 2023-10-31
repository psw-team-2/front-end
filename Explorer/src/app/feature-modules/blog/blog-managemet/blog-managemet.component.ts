import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Blog, BlogStatus, numberToBlogStatus } from '../model/blog.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';



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

  constructor(private service: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(): void {
    this.service.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
      },
      error: () => {
      }
    })
  }

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
        this.getBlogs();
      },
    })
  }

  onSeeMoreClicked(id: number){
    this.router.navigate(['blog-single-post', id]);
  }

}
