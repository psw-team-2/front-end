import { Component, Input } from '@angular/core';
import { Blog } from '../../blog/model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Profile } from '../model/profile.model';
import { BlogService } from '../../blog/blog.service';

@Component({
  selector: 'xp-tourist-posts2',
  templateUrl: './tourist-posts2.component.html',
  styleUrls: ['./tourist-posts2.component.css']
})
export class TouristPosts2Component {
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
