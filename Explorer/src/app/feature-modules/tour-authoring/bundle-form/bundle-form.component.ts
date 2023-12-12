import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Bundle, BundleStatus } from '../model/bundle.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourBundle } from '../model/tour-bundle.model';

@Component({
  selector: 'xp-bundle-form',
  templateUrl: './bundle-form.component.html',
  styleUrls: ['./bundle-form.component.css']
})
export class BundleFormComponent {
  @Output() bundleUpdated = new EventEmitter<null>();
  @Input() bundle: Bundle;
  @Input() shouldEdit: boolean = false;
  shouldRender:boolean = false;

  bundleForm: FormGroup;
  private bundleId: number | null = null;
  selectedTours: any[] = [];
  availableTours: any[] = []; 
  selectedBundle: Bundle;
  currentFile: File;
  currentFileURL: string | null = null;

  constructor(private service: TourAuthoringService, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.bundleId = id ? +id : null;
      if (id) {
        this.shouldEdit = true;

        this.service.getBundleById(this.bundleId || 0).subscribe((bundle) => {
          
          
        });
      }
  });
  }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe((params) => {
      const bundleId = params.get('id');
      if (bundleId) {
          this.bundleId = +bundleId; // Konvertujte string u broj
          // Poziv servisa da dobijete podatke o blogu na osnovu ID-a
          this.service.getBundleById(this.bundleId).subscribe((bundle) => {
              // Postavite vrednosti u formi za uređivanje

              this.bundleForm.patchValue(bundle);
              
          });
      }
  });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldEdit) {
      this.initializeForm();
      if (this.bundle) {
        this.bundleForm.patchValue(this.bundle);
      }
    }
  }

  private initializeForm(): void {
    this.bundleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    tours: new FormControl([]), 
    image: new FormControl('', [Validators.required]),
    });
  }
  
  removeTourFromBundle(tour: any): void {
    const index = this.selectedTours.indexOf(tour);
    if (index !== -1) {
      this.selectedTours.splice(index, 1);
    }
  }

  async addBundle(): Promise<void> {
    if(this.bundleForm.value.name == '' ){
      console.log('name not added')
      return;
    }
    
    this.shouldRender = true;
    const userId = this.authService.user$.value.id;
    const bundle: Bundle = {
      name: this.bundleForm.value.name || '',
      price: 0,
      userId: userId,
      status: BundleStatus.Draft,
      tours: [],
      image: 'https://localhost:44333/Images/' + this.currentFile.name,
    };
    await this.authService.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    // Poziv servisa kako biste dodali novi bundle
    this.service.createBundle(bundle).subscribe({
      next: (createdBundle) => {
        this.selectedBundle = createdBundle; // Assign the created bundle with the server-assigned id
        this.bundleUpdated.emit(); // Emitovanje događaja da je bundle ažuriran
      },
      error: (error) => {
        console.error('Error while adding bundle:', error);
        // Ovde možete dodati logiku za prikaz greške korisniku ako je potrebno
      }
    });
    
  }
  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      // Create a URL for the selected file
      this.currentFileURL = window.URL.createObjectURL(this.currentFile);
    }
  }
  viewAllBundles(){
    this.router.navigate(['/bundle-management']);
  }

    
}
