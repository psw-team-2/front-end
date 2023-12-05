import { Component, OnInit } from '@angular/core';
import { Bundle } from '../model/bundle.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-bundle-management',
  templateUrl: './bundle-management.component.html',
  styleUrls: ['./bundle-management.component.css']
})
export class BundleManagementComponent implements OnInit {
  bundles: Bundle[] = [];
  userId = this.authService.user$.value.id;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private service: TourAuthoringService, private router: Router
  ) {}

  ngOnInit(): void {
    this.getBundlesByAuthorId(this.userId);
  }

  getBundlesByAuthorId(userId: number): void {
    this.service.getBundlesByAuthorId(userId).subscribe((response) => {
      this.bundles = response;
    });
  }

  editBundle(bundle: Bundle): void {
    this.router.navigate(['/bundle-update-form', bundle.id]);
  }

  deleteBundle(id: number | undefined): void {
    if (id !== undefined) {
      this.service.deleteBundle(id).subscribe({
        next: () => {
          this.getBundlesByAuthorId(this.userId);
        },
      });
    } else {
      // Handle the case where id is undefined (optional)
      console.error('Cannot delete bundle with undefined id');
    }
  }
  
}
