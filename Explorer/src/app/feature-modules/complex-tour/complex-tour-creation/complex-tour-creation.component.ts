import { Component } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ComplexTourService } from '../complex-tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-complex-tour-creation',
  templateUrl: './complex-tour-creation.component.html',
  styleUrls: ['./complex-tour-creation.component.css']
})
export class ComplexTourCreationComponent {
AddToComplexTour(_t6: Tour) {
throw new Error('Method not implemented.');
}
  user: User | undefined;
  boughtTours: Tour[] = [];

  constructor(private service: ComplexTourService,private authService: AuthService,private router: Router){}
  
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user=user;
      if (user) {
        const id = user.id;
        this.service.retrivesAllUserTours(id).subscribe({
          next: (result: PagedResults<Tour>) => {
            console.log('Response:', result);
            if (result && result.results) {
              this.boughtTours = result.results;
              console.log('Results:', this.boughtTours);
            } else {
              console.log('Invalid response structure');
            }
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }
}
