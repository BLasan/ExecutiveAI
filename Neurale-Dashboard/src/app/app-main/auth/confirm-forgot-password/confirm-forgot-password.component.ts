import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonDialogComponent } from 'src/app/app-common/common-dialog/common-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-forgot-password',
  templateUrl: './confirm-forgot-password.component.html',
  styleUrls: ['./confirm-forgot-password.component.scss']
})
export class ConfirmForgotPasswordComponent implements OnInit {

  confirmForgotPasswordForm: FormGroup;

  constructor(private formBuild: FormBuilder, 
    private _authService: AuthService,
    public dialog: MatDialog,
    private router: Router) { }

  regex_password =
    '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$';

  ngOnInit(): void {
    this.confirmForgotPasswordForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.pattern(this.regex_password)],
      ],
      cpassword: ['', Validators.required],
    });
  }

  submit() {
    if (
        this.confirmForgotPasswordForm.controls['password'].value ===
        this.confirmForgotPasswordForm.controls['cpassword'].value
      ) {
        let data = {
          email: this.confirmForgotPasswordForm.controls['email'].value,
          code: this.confirmForgotPasswordForm.controls['code'].value,
          password: this.confirmForgotPasswordForm.controls['password'].value
        }
        this._authService.confirmForgotPassword(data).subscribe(res => {
          if (res['message'] === 'success') {
            // Success popup
            const dialogRef = this.dialog.open(CommonDialogComponent, {
              width: '330px',
              height: '100px',
              data: {
                message: 'Password Reset Success',
                message_other: ''
              }});
            this.confirmForgotPasswordForm.reset();
          } else {
            // Faliure popup
            const dialogRef = this.dialog.open(CommonDialogComponent, {
              width: '330px',
              height: '100px',
              data: {
                message: 'Password Reset Faliure',
                message_other: ''
              }});
          }
        })
        }
  }

}
