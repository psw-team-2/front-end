import { Component } from '@angular/core';
import { Answer, AnswerCategory } from '../model/answer.model';
import { TouristService } from '../tourist.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  selectedContainer: 'tour' | 'support' | 'payments' | 'other';
  shouldRenderPayment: boolean = false;
  answers: Answer[] = [];

  selectedQuestionId: number | null = null;
questionText: string | null = null;
  constructor(
    private service: TouristService, private router: Router
  ) {}

  handleTourClick() {
    this.selectedContainer = 'tour';
    this.getTourAnswers(AnswerCategory.Tour);
  }

  handlePaymentsClick() {
    this.selectedContainer = 'payments';
    this.getTourAnswers(AnswerCategory.Payment);
  }

  handleOtherClick() {
    this.selectedContainer = 'other';
    this.getTourAnswers(AnswerCategory.Other);
  }

  handleSupportClick() {
    this.selectedContainer = 'support';
    console.log('Sending request for category:', AnswerCategory.TechnicalSupport);
    this.getTourAnswers(AnswerCategory.TechnicalSupport);
  }
  
  getTourAnswers(category: AnswerCategory): void {
    console.log('Requesting answers for category:', category);
    this.service.getAnswersByCategory(category).subscribe((response) => {
      console.log('Received response:', response);
      this.answers = response;

   
      if (this.selectedQuestionId !== null) {
        this.service.getQuestionTextByQuestionId(this.selectedQuestionId).subscribe((questionText) => {
          console.log('Received question text:', questionText);
          this.questionText = questionText;
        });
      }
      
      
    });
  }

  getQuestionTextByQuestionId(questionId: number): Observable<string> {
    return this.service.getQuestionTextByQuestionId(questionId);
  }

  
  askUs(): void {
    this.router.navigate(['/create-question']);
  }
}
