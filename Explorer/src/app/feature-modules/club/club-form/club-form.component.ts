import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Club } from '../model/club.model';
import { ClubService } from '../club.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {

  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;

  user: User | undefined;
  currentFile: File | null;
  currentFileURL: string | null = null;
  memberIds: number[] = [];

  constructor(private service: ClubService, private authService: AuthService){}

  ngOnChanges(): void {
    this.clubForm.reset();
    if(this.shouldEdit) {
      this.clubForm.patchValue(this.club);
      this.currentFile = new File([], this.club.imageUrl);
      this.currentFileURL = this.club.imageUrl;
    }

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // ngOnInit(): void {
  //   this.authService.user$.subscribe(user => {
  //     this.user = user;
  //   });
  // }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    // ownerId: new FormControl('', [Validators.required]),
    // memberIds: new FormControl('', [Validators.required]),
  });

  async addClub(): Promise<void> {

    if (this.currentFile == null) {
      return;
    }

    let memberId = this.user?.id as number;
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: 'https://localhost:44333/Images/' + this.currentFile.name || "",
      ownerId : this.user?.id || 0,
      memberIds : [ memberId ],
    };
    this.service.addClub(club).subscribe({
      next: () => { this.clubUpdated.emit() }
    });

    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {
        // Obrada uspešnog upload-a
      },
      error: (value) => {
        // Obrada greške tokom upload-a
      }, complete: () => {
        // Obrada završetka upload-a
      },
    });
  }

  async updateClub(): Promise<void> {
    let newImageUrl = 'https://localhost:44333/Images/' + this.currentFile?.name;
    if (newImageUrl === 'https://localhost:44333/Images/undefined') {
      newImageUrl = this.club.imageUrl;
    }

    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: newImageUrl,
      ownerId : this.user?.id || 0,
      memberIds : this.club.memberIds,
    }
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: () => { this.clubUpdated.emit();}
    });

    if (this.currentFile == null) {
      return;
    }

    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {
        // Obrada uspešnog upload-a
      },
      error: (value) => {
        // Obrada greške tokom upload-a
      }, complete: () => {
        // Obrada završetka upload-a
      },
    });
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      // Create a URL for the selected file
      this.currentFileURL = window.URL.createObjectURL(this.currentFile);
    }
  }

  deleteFile() {
    this.currentFile = null;
  }
}
