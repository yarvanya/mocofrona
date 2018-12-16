import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../interfaces/user-interface';
import { constants } from '../../helper/constants';
import { Observable } from 'rxjs/index';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  modalRef: BsModalRef;
  authData: any;
  profileData: any;

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    birthDate: new FormControl('')
  });

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isUserLogged.subscribe(subscribed_data => {
      this.authData = subscribed_data.authData;
    });

    this.getUserData().subscribe(profile_data => {
      this.profileData = profile_data;
      this.profileForm.setValue({
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        country: this.profileData.country,
        city: this.profileData.city,
        address: this.profileData.address,
        birthDate: this.profileData.birthDate
      });
    });
  }

  openProfileModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  updateProfile() {
    console.log(this.profileForm.value);
  }

  getUserData(): Observable<UserInterface> {
    return this.http.get<UserInterface>(
      `${constants.backEndUrl}${constants.routes.get_profile}/${this.authData.profileId}`
    );
  }

  showToastr(data) {
    this.toastr[`${data.status}`](`${data.message}`);
  }
}
