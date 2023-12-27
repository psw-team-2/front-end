import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bundle, BundleStatus } from '../model/bundle.model';
import { Tour } from '../model/tour.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';
import { AccountStatus, TourBundle } from '../model/tour-bundle.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'xp-bundle-update-form',
  templateUrl: './bundle-update-form.component.html',
  styleUrls: ['./bundle-update-form.component.css']
})
export class BundleUpdateFormComponent implements OnInit {
  bundleDataForm: FormGroup;
  selectedBundle: Bundle;
  tours: TourBundle[] = [];
  userId = this.authService.user$.value.id;
  bundledTour: TourBundle;
  tours2: TourBundle[] = [];
  price: number;
  showTours = false;
  currentFile: File | null = null;
  currentFileURL: string | ArrayBuffer | null = null;
  constructor(
    private formBuilder: FormBuilder,private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private service: TourAuthoringService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bundleDataForm = this.formBuilder.group({
      name: [''],
      price: ['']
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const bundleId = params['id'];
      this.service.getBundleById(bundleId).subscribe((bundle: Bundle) => {
        this.selectedBundle = bundle;
  
        // Dohvati sve ture
         this.getToursByAuthorId(this.userId);
       
        
      });
    });
  }
  

  
  getToursByAuthorId(userId: number): void {
    this.service.getToursByAuthorId(userId)
      .subscribe((response: TourBundle[]) => {
        this.tours = response;
        this.markAddedTours();
      });
  }

  markAddedTours(): void {
    if (this.selectedBundle && this.selectedBundle.tours) {
      for (const bundledTourId of this.selectedBundle.tours) {
        const tourIndex = this.tours.findIndex(tour => tour.id === bundledTourId); // Pretpostavljamo da je svaka tura imala svojstvo 'id'
        if (tourIndex !== -1) {
          this.tours[tourIndex].isAdded = true;
        }
      }
    }
  }
  
  toggleTour(tour: TourBundle): void {
    const index = this.selectedBundle.tours.findIndex(bundledTourId => bundledTourId === tour.id);
    
    if (index !== -1 && tour.isAdded) {
      // Tour exists in bundle and is added, remove it
      this.selectedBundle.tours.splice(index, 1);
      tour.isAdded = false; // Update 'isAdded' flag for UI
    } else {
      // Tour doesn't exist in bundle or is not added, add it
      this.selectedBundle.tours.push(tour.id); // Dodajemo ID ture u niz tura bundla
    
      // Update 'isAdded' flag for UI
      tour.isAdded = true;
    }
  }



  loadBundleData(bundleId: number): void {
    this.service.getBundleById(bundleId).subscribe((bundle: Bundle) => {
      this.selectedBundle = bundle;
      this.bundleDataForm.patchValue({
        name: bundle.name,
        price: bundle.price
      });
    });
  }


  


  updateBundle(): void {
    const formName = this.bundleDataForm.value.name;
    const formPrice = this.bundleDataForm.value.price;
  
    // Provera i postavljanje naziva
    if (formName !== null && formName !== undefined && formName.trim() !== '') {
      this.selectedBundle.name = formName;
    }
  
    // Provera i postavljanje cene
    if (formPrice !== null && formPrice !== undefined && formPrice.trim() !== '') {
      this.selectedBundle.price = formPrice;
    }
  
    const tourIds = this.tours.filter(tour => tour.isAdded).map(tour => tour.id);
    this.selectedBundle.tours = tourIds;
  
    this.service.updateBundle(this.selectedBundle).subscribe((updatedBundle) => {
      // Update successful, now call publishBundle method
       // Consider passing the updated price here or use any desired price value
      this.service.publishBundle
      (updatedBundle).subscribe((publishedBundle) => {
        // Optional: Redirect to another page or perform other actions after successful publishing
        
        this.showSuccessNotification('Bundle successfully updated!');
        console.log('Bundle published:', publishedBundle);

        // Add your redirect logic or additional actions here
        this.router.navigate(['/bundle-management']);
      }, (error) => {
        // Handle error while publishing bundle
        console.error('Error publishing bundle:', error);
        

      });
    }, (error) => {
      // Handle error while updating bundle
      console.error('Error updating bundle:', error);
      // Add error handling logic here
    });
  }

  showSuccessNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3500, // Set the duration for which the notification should be visible (in milliseconds)
    });
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.currentFile = file;
      this.previewImage(file);
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.currentFileURL = reader.result;
    };
  }

/*updateBundle(): void {
  this.selectedBundle.name = this.bundleDataForm.value.name;

  // Extract the price value and ensure it's properly defined or provide a default value
  const price: number = this.bundleDataForm.value.price ; // Assuming 0 as a default price if undefined

  const tourIds = this.tours.filter(tour => tour.isAdded).map(tour => tour.id);
  this.selectedBundle.tours = tourIds;

  this.service.updateBundle(this.selectedBundle).subscribe(() => {
    // Opciono, preusmerite se na drugu stranicu ili izvršite druge radnje nakon uspešnog ažuriranja
    this.service.publishBundle(this.selectedBundle, this.selectedBundle.price).subscribe((updatedBundle) => {
      // Update the selectedBundle with the updated data
      this.selectedBundle = updatedBundle;
  
     
    });
  });
  // Assuming 'service' is an instance of your service containing the 'publishBundle' function
  
}*/

}




