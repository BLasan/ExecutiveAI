import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/app-common/common-dialog/common-dialog.component';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss']
})
export class ProfileHomeComponent implements OnInit {

  profileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private profileService: ProfileService, public dialog: MatDialog) { }

  data: any;
  enableUpdateButton: boolean = true;

  ngOnInit() {
    this.profileService.getUserData().subscribe( data => {
      this.data = data
    })
    this.profileForm = this.formBuilder.group({
      userid: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  detectChange() {
    this.enableUpdateButton = false;
  }

  submit() {
    let data = {
      email: this.profileForm.controls['email'].value,
      phone_number: this.profileForm.controls['phone'].value,
    }
    console.log(data)

    this.profileService.updateUserData(data).subscribe( res => {
      if (res['message'] === 'success') {
        // Success popup
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: '330px',
          height: '100px',
          data: {
            message: 'Update Successful',
            message_other: ''
          }});
          this.enableUpdateButton = true;
      } else {
        // Faliure popup
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: '330px',
          height: '100px',
          data: {
            message: 'Signup Faliure',
            message_other: ''
          }});
      }
    })
  }

}
