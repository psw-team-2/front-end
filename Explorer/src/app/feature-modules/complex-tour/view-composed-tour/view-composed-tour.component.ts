import { Component } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ComplexTourService } from '../complex-tour.service';
import { ComposedTour } from '../model/composed-tour.model';

@Component({
  selector: 'xp-view-composed-tour',
  templateUrl: './view-composed-tour.component.html',
  styleUrls: ['./view-composed-tour.component.css']
})
export class ViewComposedTourComponent {
  user: User | undefined;
  composedTours: ComposedTour[] = [];

  constructor(private service : ComplexTourService, private authService:  AuthService){}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);

      // Call the getAll method and filter the results
      this.service.getAll(0,0).subscribe((result: PagedResults<ComposedTour>) => {
        // Assuming ComposedTour has a property 'authorId'
        this.composedTours = result.results.filter(tour => tour.authorId === this.user?.id);
        console.log(this.composedTours);
      });
    });
  }
}
