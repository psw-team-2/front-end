import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Blog, BlogCategory, BlogStatus, BlogCategoryValues } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

import { TourExecution } from '../../tour-execution/model/tourexecution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogTourReport } from '../model/blog-tour-report';
import { Equipment } from '../../tour-authoring/model/equipment.model';
import { AdministrationService } from '../../administration/administration.service';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {

  @Output() blogUpdated = new EventEmitter<null>();
  @Input() blog: Blog;
  @Input() shouldEdit: boolean = false;

  currentFile: File;
  currentFileUrl: string | null = null;
  
  blogForm: FormGroup;
  BlogCategory = BlogCategory;
  private blogId: number | null = null;
  private blogTourId: number | null = null;
  selectedCategory: BlogCategory;
  tourExecution: TourExecution | null;
  equipment: Equipment[] | undefined = [];
  equipmentSelected: boolean[];
  equipmentTourReport: (number | undefined)[];
  checkpoints: Checkpoint[] | undefined = [];
  touristDistance: number=0;

  constructor(private service: BlogService, private authService: AuthService, private route: ActivatedRoute, 
    private tourExecutionService : TourExecutionService, private equipmentService : AdministrationService,
    private tourService: TourAuthoringService) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const tourId = params.get('tourId')
      this.blogId = id ? +id : null;
      this.blogTourId = tourId? +tourId : null;
      if (id) {
        this.shouldEdit = true;

        this.service.getBlog(this.blogId || 0).subscribe((blog) => {
          if (blog.image) {
            this.currentFileUrl = blog.image;
          }
          
        });
      }
  });
  }
 

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe((params) => {
      const blogId = params.get('id');
      if (blogId) {
          this.blogId = +blogId; // Konvertujte string u broj
          // Poziv servisa da dobijete podatke o blogu na osnovu ID-a
          this.service.getBlog(this.blogId).subscribe((blog) => {
              // Postavite vrednosti u formi za uređivanje

              this.blogForm.patchValue(blog);
              if (blog.image) {
                this.currentFileUrl =  blog.image;
              }
          });
      }
      if(this.blogTourId){
        const userId = this.authService.user$.value.id;

        this.tourExecutionService.getTourExecutionByTourAndUser(this.blogTourId, userId).subscribe({
          next: (result: PagedResults<TourExecution>) => {
              if (result && result.results.length > 0){
                //WE TAKE 'FirstOf' THE COLLECTION
                this.tourExecution = result.results[0];
                this.equipmentService.getEquipmentByTouridTourist(this.tourExecution.tourId.valueOf()).subscribe({
                  next: (result: PagedResults<Equipment>) =>{
                    this.equipment = result.results;
                    this.equipmentSelected = new Array(this.equipment.length).fill(false);                    
                  }
                })
                this.tourService.getCheckpointsByVisitedCheckpoints(this.tourExecution.visitedCheckpoints).subscribe({
                  next: (result: PagedResults<Checkpoint>) =>{
                    this.checkpoints = result.results;
                  }
                })
                if(this.tourExecution.touristDistance !== null){
                  this.touristDistance = this.tourExecution.touristDistance.valueOf();
                }
              }
            }
          })
      }
  });
}

  

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldEdit) {
      this.initializeForm();
      if (this.blog) {
        this.blogForm.patchValue(this.blog);
      }
    }
  }
  
  

  private initializeForm(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      category: new FormControl(null, [Validators.required]),
    });
  }

  toggleEquipmentSelection(index: number) {
    this.equipmentSelected[index] = !this.equipmentSelected[index];
  }

  async addBlog(): Promise<void> {
    const userId = this.authService.user$.value.id;
    const username = this.authService.user$.value.username;
    if (this.selectedCategory !== undefined) {

      if (this.tourExecution && this.equipment && this.equipmentSelected) {
        console.log(this.equipment)
        console.log(this.equipmentSelected)

        if (this.equipmentSelected.length === this.equipment.length) {

          const filteredIds: (number|undefined)[] = [];

          this.equipment.forEach((equip, index) => {
            if (this.equipmentSelected[index]) {
              filteredIds.push(equip.id);
            }
          });
      
          this.equipmentTourReport = filteredIds;
          

        } else {
          console.error('Length of equipmentSelected does not match the length of equipment.');
        }
      }
      

    if(!this.currentFile && this.tourExecution){
      const blog: Blog = {
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date(),
        username: username,
        status: BlogStatus.Published,
        userId: userId,
        image: "",	
        category:this.selectedCategory,
        tourReport: {
          tourId: this.tourExecution.tourId.valueOf(),
          startTime: this.tourExecution.StartTime,
          endTime: this.tourExecution.EndTime,
          length: this.tourExecution.touristDistance.valueOf(),
          equipment: this.equipmentTourReport,
          checkpointsVisited: this.tourExecution.visitedCheckpoints
        }
      };
      this.service.addBlog(blog).subscribe({
        next: (_) => {
          this.blogUpdated.emit();
          this.equipmentTourReport = [];
        }
      });

    }
    else if(this.tourExecution){
      const blog: Blog = {
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date(),
        username: username,
        status: BlogStatus.Published,
        userId: userId,
        image: 'https://localhost:44333/Images/' + this.currentFile.name,
        category:this.selectedCategory,
        tourReport: {
          tourId: this.tourExecution.tourId.valueOf(),
          startTime: this.tourExecution.StartTime,
          endTime: this.tourExecution.EndTime,
          length: this.tourExecution.touristDistance.valueOf(),
          equipment: [1, 2, 3],
          checkpointsVisited: this.tourExecution.visitedCheckpoints
        }
      };
      this.service.addBlog(blog).subscribe({
        next: (_) => {
          this.blogUpdated.emit();
          this.equipmentTourReport = [];
        }
      });

    }
    else if (!this.currentFile) {
      const blog: Blog = {
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date('2023-10-22T10:30:00'),
        username: username,
        status: BlogStatus.Published,
        userId: userId,
        image: "",	
        category:this.selectedCategory
      };
      this.service.addBlog(blog).subscribe({
        next: (_) => {
          this.blogUpdated.emit();
        }
      });
    } else {
      const blog: Blog = {
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date('2023-10-22T10:30:00'),
        username: username,
        status:  BlogStatus.Published,
        image: 'https://localhost:44333/Images/' + this.currentFile.name,
        userId: userId,
        category: this.selectedCategory
    };
      await this.service.upload(this.currentFile).subscribe({
        next: (value) => {
  
        },
        error: (value) => {
  
        }, complete: () => {
        },
      });
      this.service.addBlog(blog).subscribe({
        next: (_) => { this.blogUpdated.emit() }
    });}
    }
  }
  
  
  

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      this.currentFileUrl = window.URL.createObjectURL(this.currentFile);
    }
  }

async updateBlog(): Promise<void> {
  const userId = this.authService.user$.value.id;
  const username = this.authService.user$.value.username;
  if (this.blogId !== null) {
    if (!this.currentFile) {
      const blog: Blog = {
        userId : userId,
        username: username,
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date('2023-10-22T10:30:00'),
        status: BlogStatus.Published,
        id: this.blogId,
        image: this.blogForm.value.image || "",
        category: this.selectedCategory,
      };
      this.service.updateBlog(blog).subscribe({
        next: (_) => {
          this.blogUpdated.emit();
        }
      });
    } else {
      const blog: Blog = {
        userId : userId,
        username: username,
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date('2023-10-22T10:30:00'),
        status: BlogStatus.Published,
        id: this.blogId,
        image: 'https://localhost:44333/Images/' + this.currentFile.name,
        category: this.selectedCategory,
      };
      await this.service.upload(this.currentFile).subscribe({
        next: (value) => {

        },
        error: (value) => {

        }, complete: () => {
        },
      });
      this.service.updateBlog(blog).subscribe({
        next: (_) => { this.blogUpdated.emit() }
      });}
    
  }
}
  
  

}
