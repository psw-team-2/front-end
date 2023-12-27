import { Component, OnInit } from '@angular/core';
import { AuthorReviewService } from '../author-review.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-author-review',
  templateUrl: './author-review.component.html',
  styleUrls: ['./author-review.component.css']
})

export class AuthorReviewComponent implements OnInit {
  authors: User[] = [];
  currentUser: User;
  shouldRenderAddForm = false;
  shouldAdd = false;
  addForm: FormGroup;

  constructor(private authorReviewService: AuthorReviewService, private authService: AuthService, private formBuilder: FormBuilder) { 
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.addForm = this.formBuilder.group({
      grade: ['', Validators.required],
      comment: ['', Validators.required],
      authorId: ['', Validators.required]
    });
  }
   
  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors(): void {
    this.authService.getAuthors().subscribe({
      next: (result: PagedResults<User>) => {
        this.authors = result.results;
      },
      error: () => {
      }
    });
  }
  
  onAddRating() {
    this.shouldAdd = true;
    this.shouldRenderAddForm = true;  
  }

  addReview() {
    if (this.addForm.valid) {
      const currentDate = new Date();
      const touristId = this.currentUser.id;
  
      const authorReview = {
        ...this.addForm.value,
        reviewDate: currentDate,
        touristId: touristId
      };
      this.authorReviewService.addReview(authorReview, touristId).subscribe(
        () => {
          console.log('Author review added successfully');
        },
        error => {
          console.error('Error adding author review:', error);
        }
      );
    }
  }
  
  cancel() {
    this.shouldAdd = false;
    this.shouldRenderAddForm = false;
  }

}
