import { Component } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../model/blog.model';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-blog-review',
  templateUrl: './blog-review.component.html',
  styleUrls: ['./blog-review.component.css']
})
export class BlogReviewComponent {
  blogs: Blog[] = [];
  blogRows: any[] = [];
  itemsPerPage = 12;
  currentPage = 1; 
  totalPages: number; 
  totalPageArray: number[] = [];

  constructor(private service: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.getBlogs();
  }


  getBlogs(): void {
    this.service.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.totalPages = Math.ceil(this.blogs.length / this.itemsPerPage); 
        this.totalPageArray = Array.from({ length: this.totalPages }, (_, index) => index + 1);
        this.updateBlogRows();
      },
      error: () => {
        
      }
    });
  }

  updateBlogRows() {
    this.blogRows = [];
    for (let i = 0; i < this.blogs.length; i += 3) {
      this.blogRows.push(this.blogs.slice(i, i + 3));
    }
  }
  

  changePage(page: number) {
    this.currentPage = page;
    this.updateBlogRows();
  }

  chunkArray(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  onReadMoreClicked(id: number){
    this.router.navigate(['blog-single-post', id]);
  }

}
