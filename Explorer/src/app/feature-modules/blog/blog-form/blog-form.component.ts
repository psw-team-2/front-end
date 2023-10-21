import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Blog, BlogStatus } from '../model/blog.model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {

  @Output() blogUpdated = new EventEmitter<null>();
  @Input() blog: Blog;
  @Input() shouldEdit: boolean = false;

  constructor(private service: BlogService) {
  }

  ngOnChanges(): void {
    this.blogForm.reset();
    if(this.shouldEdit) {
      this.blogForm.patchValue(this.blog);
    }
  }

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  addBlog(): void {
    const blog: Blog = {
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      image: this.blogForm.value.image || "",
    };
    this.service.addBlog(blog).subscribe({
      next: () => { this.blogUpdated.emit() }
    });
  }

  updateBlog(): void {
    const blog: Blog = {
      id: this.blog.id,
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      image: this.blogForm.value.image || "",
    };
    blog.id = this.blog.id;
    this.service.updateBlog(blog).subscribe({
      next: () => { this.blogUpdated.emit();}
    });
  }
}
