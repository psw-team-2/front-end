import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { GiftCard } from '../model/gift-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../../administration/administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Profile } from '../../administration/model/profile.model';

@Component({
  selector: 'xp-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.css']
})
export class GiftCardComponent {
  @Input() tour: Tour;
  @Input() shouldRender: boolean;
  @Output() shouldRenderUpdated = new EventEmitter<false>();
  userId = this.authService.user$.value.id;
  username = this.authService.user$.value.username;
  tourProblem: GiftCard;
  user: User;
  tourId: number;
  loggedInProfile: Profile;
  followers: Profile[] = [];
  profiles: Profile[];

  constructor( private tourAuthoringService :TourAuthoringService, 
    private authService: AuthService, private administrationService: AdministrationService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tourId = params['id'];
      console.log('Retrieved ID:', this.tourId);
    });
  
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  
    this.administrationService.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;
  
        // Get all profiles
      
        this.getFollowersForLoggedInProfile();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  
    this.tourAuthoringService.getTour(this.tourId).subscribe({
      next: (tourData: Tour) => {
        this.tour = tourData;
      },
      error: (err: any) => {
        console.log('Error while fetching tour by ID:', err);
      }
    });
  
   
  }
  
  

  giftCardForm = new FormGroup({
    amountToSend: new FormControl('', [Validators.required]),
    recipient: new FormControl('', [Validators.required]),
    selectedTour: new FormControl(0, [Validators.required]),
    note: new FormControl('', [Validators.required]) 
  });

  sendGiftCard():void{
    if(this.giftCardForm.value.selectedTour == null){
      this.giftCardForm.value.selectedTour = 0
    }

    if(this.tourId == undefined){
      error: () => {
      }     
      return
    }


    const selectedRecipientId = this.giftCardForm.value.recipient;
    const parsedRecipientId = selectedRecipientId ? parseInt(selectedRecipientId, 10) : undefined;
    const giftCard: GiftCard = {
      
      ac:  Number(this.giftCardForm.value.amountToSend) || 0,
      note: this.giftCardForm.value.note || "", 
      recommendedTour: this.tourId,
      receiver: +this.giftCardForm.value.recipient!,
      senderId: this.user.id,
      sender: this.user.username,
    };

    this.tourAuthoringService.sendGift(giftCard).subscribe({
      next: () => {
        this.showNotification('Gift card successfully sent!');
        this.shouldRenderUpdated.emit();
      },
      error: () => {
        this.showNotification('You don\'t have enough money to send a gift card!');
      }
    });
    
  }

  showNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }


  getFollowersForLoggedInProfile(): void {
    if (this.loggedInProfile) {
      this.administrationService.getAllFollowers(this.loggedInProfile).subscribe({
        next: (result: PagedResults<Profile>) => {
          this.followers = result.results;
        },
        error: (err: any) => {
          console.error('Error while getting followers:', err);
        }
      });
    }
  }

}
