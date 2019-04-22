import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfileInterface } from '../../interfaces/profile-interface';
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
  defaultFieldValue: string = 'Fill this field in';

  fileToUpload: File = null;

  @ViewChild("fileInput") fileInput;

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    avatar: new FormControl(''),
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
    this.initComponent();
  }

  initComponent() {
    this.auth.isUserLogged.subscribe(subscribed_data => {
      this.authData = subscribed_data.authData;
    });

    this.getProfilerData().subscribe(profile_data => {
      this.profileData = profile_data;
      this.profileForm.setValue({
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        avatar: this.profileData.avatar,
        country: this.profileData.country,
        city: this.profileData.city,
        address: this.profileData.address,
        birthDate: this.profileData.birthDate
      });
    }, catchedError => {
      this.showToastr(catchedError.error);
    });
  }

  openProfileModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  updateProfile() {
    this.updateProfileData().subscribe(profile_data => {
      this.profileData = profile_data.profile;
      this.showToastr(profile_data);
      this.modalRef && this.modalRef.hide();
    }, catchedError => {
      this.showToastr(catchedError.error);
      this.modalRef && this.modalRef.hide();
    });
  }

  getProfilerData(): Observable<ProfileInterface> {
    return this.http.get<ProfileInterface>(
      `${constants.backEndUrl}${constants.routes.get_profile}/${this.authData.profileId}`
    );
  }

  updateProfileData(): Observable<ProfileInterface> {
    return this.http.put<ProfileInterface>(
      `${constants.backEndUrl}${constants.routes.get_profile}/${this.authData.profileId}`,
      this.profileForm.value
    );
  }

  fileChange(file: FileList) {
    this.fileToUpload = file.item(0);

    const reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = (event: any) => {
      this.profileForm.controls['avatar'].setValue(event.target.result);
      this.profileForm.controls['avatar'].value && this.updateProfile();
    }
  }

  getImageSrc() {
    return this.profileForm.controls['avatar'].value;
  }

  showToastr(data) {
    if (data && data.status && data.message) {
      this.toastr[`${data.status}`](`${data.message}`);
    } else {
      this.toastr.error(
        'Our system is facing with some problems. We kindly ask you to try again later.'
      );
    }
  }
}
