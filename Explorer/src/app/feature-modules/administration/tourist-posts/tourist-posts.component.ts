import { Component, Input, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { BlogService } from '../../blog/blog.service';
import { Blog, BlogCategory, BlogStatus, BlogCategoryValues } from '../../blog/model/blog.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Rating } from '../../blog/model/blog-rating.model';

@Component({
  selector: 'xp-tourist-posts',
  templateUrl: './tourist-posts.component.html',
  styleUrls: ['./tourist-posts.component.css']
})
export class TouristPostsComponent implements OnInit{
  @Input() selectedProfile: Profile;
  blogPosts : Blog[] = [];
  blogRatings : number[] = [];
  hasPosts:Boolean = false;

  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.selectedProfile === undefined){
      console.log("No one is logged in.")
    }
    
    this.getBlogPostsByProfile();
    

  }

  getBlogPostsByProfile() : void {
    this.blogService.getBlogs().subscribe({
      next: (result) => {
        this.blogPosts = result.results;

        const userId = this.selectedProfile?.userId;
        if (userId === undefined) {
          return;
        }

        this.blogPosts = this.blogPosts.filter(x => x.userId === userId && x.creationTime !== null);

        console.log("BLOG POSTS");
        console.log(this.blogPosts);
        
        if(this.blogPosts.length==0){
          this.hasPosts=true;
        }

        this.getBlogRatings(this.blogPosts);
      }
    });
  }

  getBlogRatings(blogPosts: Blog[]) : void {
    for(let blogPost of blogPosts){
      if (blogPost.id === undefined){
        break;
      }
      this.blogService.getRatingCount(blogPost.id).subscribe((ratingCount) => {
        const rating = ratingCount.count;
        this.blogRatings.push(rating);
      });
    }
  }
  
}


