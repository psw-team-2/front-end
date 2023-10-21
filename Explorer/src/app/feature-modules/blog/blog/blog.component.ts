import { Component, Input, OnInit  } from '@angular/core';
import { Blog } from '../model/blog.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[] = [];
  selectedBlog: Blog;
  shouldRenderBlogForm: boolean = false;
  shouldEdit: boolean = false;

  constructor(private service: BlogService) { }

  ngOnInit(): void {
    this.getBlogs();
  }

  deleteBlog(id: number): void {
    this.service.deleteBlog(id).subscribe({
      next: () => {
        this.getBlogs();
      },
    })
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

  onEditClicked(blog: Blog): void {
    this.selectedBlog = blog;
    this.shouldRenderBlogForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderBlogForm = true;
  }
}
