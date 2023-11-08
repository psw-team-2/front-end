import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Blog, BlogStatus } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

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
  private blogId: number | null = null;

  constructor(private service: BlogService, private authService: AuthService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.blogId = id ? +id : null;
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
  /*
  ngOnChanges(): void {
    this.blogForm.reset();
    if(this.shouldEdit) {
      this.blogForm.patchValue(this.blog);
    }
  }*/

  private initializeForm(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(''),
    });
  }

  /*
  async addBlog(): Promise<void> {
    const userId = this.authService.user$.value.id;
    
    const blog: Blog = {
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      creationTime: new Date('2023-10-22T10:30:00'),
      status:  BlogStatus.Published,
      image: 'https://localhost:44333/Images/' + this.currentFile.name,
      userId: userId,
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
    });
  }*/

  async addBlog(): Promise<void> {
    const userId = this.authService.user$.value.id;
    const username = this.authService.user$.value.username;
    if (!this.currentFile) {
      const blog: Blog = {
        title: this.blogForm.value.title || "",
        description: this.blogForm.value.description || "",
        creationTime: new Date('2023-10-22T10:30:00'),
        username: username,
        status: BlogStatus.Published,
        userId: userId,
        username: username,
        image: "",	
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
        username: username,
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
      });
    }
  }
  
  
  

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      this.currentFileUrl = window.URL.createObjectURL(this.currentFile);
    }
  }
/*
  async updateBlog(): Promise<void> {
  const userId = this.authService.user$.value.id;
  if (this.blogId !== null) {
    const blog: Blog = {
      userId : userId,
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      creationTime: new Date('2023-10-22T10:30:00'),
      status: BlogStatus.Published,
      id: this.blogId,
      image: 'https://localhost:44333/Images/' + this.currentFile.name,
    };
    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    this.service.updateBlog(blog).subscribe({
      next: () => { this.blogUpdated.emit(); }
    });
  }
 
}*/
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
        username: username,
        creationTime: new Date('2023-10-22T10:30:00'),
        status: BlogStatus.Published,
        id: this.blogId,
        image: 'https://localhost:44333/Images/' + this.currentFile.name,
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
      });
    }
  }
}
  
  

}
