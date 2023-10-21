import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourProblem } from '../model/tour-problem.model';
import { TourModelService } from '../tour-model.service';

@Component({
  selector: 'xp-tour-problem-form', 
  templateUrl: './tour-problem-form.component.html',
  styleUrls: ['./tour-problem-form.component.css']
})
export class TourProblemFormComponent implements OnChanges {

  @Output() tourProblemUpdated = new EventEmitter<null>();
  @Input() tourProblem: TourProblem;
  @Input() shouldEdit: boolean = false;

  constructor(private service: TourModelService) {
  }

  ngOnChanges(): void {
    this.tourProblemForm.reset();
    if (this.shouldEdit && this.tourProblem) {
      this.tourProblemForm.patchValue(this.tourProblem);
    }
  }

  tourProblemForm = new FormGroup({
    problemCategory: new FormControl('', [Validators.required]),
    problemPriority: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  addTourProblem(): void {
    const tourProblem: TourProblem = {
      problemCategory: this.tourProblemForm.value.problemCategory || "",
      problemPriority: this.tourProblemForm.value.problemPriority || "",
      description: this.tourProblemForm.value.description || "",
      timeStamp: new Date(), 
      mockTourId: 1
    };

    this.service.addTourProblem(tourProblem).subscribe({
      next: () => {
        this.tourProblemUpdated.emit();
      }
    });
  }

  updateTourProblem(): void {
    const tourProblem: TourProblem = {
      problemCategory: this.tourProblemForm.value.problemCategory || "",
      problemPriority: this.tourProblemForm.value.problemPriority || "",
      description: this.tourProblemForm.value.description || "",
      timeStamp: new Date(), 
      mockTourId: 1
    };

    if (this.tourProblem) {
      tourProblem.id = this.tourProblem.id;
      this.service.updateTourProblem(tourProblem).subscribe({
        next: () => {
          this.tourProblemUpdated.emit();
        }
      });
    }
  }
}
