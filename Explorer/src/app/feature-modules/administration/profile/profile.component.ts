import { Component } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { Profile } from '../model/profile.model';

@Component({
  selector: 'xp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profiles: Profile[] = [{id: 0, firstName: "Danilo", lastName: "Radivojevic", profilePicture: "url_danilo", biography: "bio_danilo", motto: "motto_danilo"}]
}
