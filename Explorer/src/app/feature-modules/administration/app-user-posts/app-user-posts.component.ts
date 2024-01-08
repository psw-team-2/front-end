import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Blog } from '../../blog/model/blog.model';
import { Profile } from '../model/profile.model';
import { BlogService } from '../../blog/blog.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-app-user-posts',
  templateUrl: './app-user-posts.component.html',
  styleUrls: ['./app-user-posts.component.css']
})
export class AppUserPostsComponent implements OnChanges {
  @Input() selectedProfile: Profile;
  blogPosts: Blog[] = [];
  blogRatings: number[] = [];
  
  hasPosts:Boolean = false;

  constructor(private blogService: BlogService, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGE REGISTERED");
    console.log('ngOnChanges', changes);
    if (changes['selectedProfile'] && !changes['selectedProfile'].firstChange) {
      console.log('getBlogPostsByProfile');
      this.getBlogPostsByProfile();
    }
  }
  

  ngOnInit(): void {
    if (this.selectedProfile === undefined) {
      console.log("No one is logged in.");
    }

    this.getBlogPostsByProfile();
  }

  getBlogPostsByProfile(): void {
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

  getBlogRatings(blogPosts: Blog[]): void {
    this.blogRatings = []; // Clear previous ratings
    for (let blogPost of blogPosts) {
      if (blogPost.id === undefined) {
        break;
      }
      this.blogService.getRatingCount(blogPost.id).subscribe((ratingCount) => {
        const rating = ratingCount.count;
        this.blogRatings.push(rating);

        // If you want to do something after all ratings are fetched, you can check if the array is complete.
        if (this.blogRatings.length === blogPosts.length) {
          console.log("All ratings fetched");
        }
      });
    }
  }
}
