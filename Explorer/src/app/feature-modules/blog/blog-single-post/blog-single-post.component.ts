import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { Blog } from '../model/blog.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-blog-single-post',
  templateUrl: './blog-single-post.component.html',
  styleUrls: ['./blog-single-post.component.css']
})



export class BlogSinglePostComponent implements OnInit {
  blogPost: Blog;
  blogSinglePost: BlogSinglePostComponent;
  private blogId: number | null = null;


constructor(private service: BlogService, private route: ActivatedRoute) { }


ngOnInit(): void {

  this.route.paramMap.subscribe((params) => {
    const blogId = params.get('id');
    if (blogId) {
      this.blogId = +blogId;
      this.service.getBlog(this.blogId).subscribe((data: Blog) => {
        this.blogPost = data;
      });
    }
  });
  }
}



    