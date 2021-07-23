import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonDialogComponent } from 'src/app/app-common/common-dialog/common-dialog.component';

import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;

  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  isVisible: boolean = false;
  isVisibleRePassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {}

  regex_contact =
    '^(\\+\\d{1,2}\\s?)?1?\\-?\\.?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$';
  regex_password =
    '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$';

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contact: [
        '',
        [Validators.required, Validators.pattern(this.regex_contact)],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(this.regex_password)],
      ],
      rePassword: ['', Validators.required],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  submit() {
    console.log(this.signupForm.value);
    this.submitted = true;

    if (!this.signupForm.invalid) {
      this._authService
        .emailValidator(this.signupForm.controls['email'].value)
        .subscribe((data) => {
          if (data.disposable === true) {
            window.alert('Disposable email!');
          } else {
            if (
              this.signupForm.controls['password'].value ===
              this.signupForm.controls['rePassword'].value
            ) {
              this._authService
                .signup(this.signupForm.value)
                .subscribe((res) => {
                  if (res['status'] === 'success') {
                    // Success popup
                    const dialogRef = this.dialog.open(CommonDialogComponent, {
                      width: '330px',
                      height: '100px',
                      data: {
                        message: 'Signup Successful',
                        message_other: 'Please check your Email'
                      }});
                    this.signupForm.reset();
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
                });
            } else {
              // Please confirm the password popup
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: '330px',
                height: '100px',
                data: {
                  message: 'Please confirm the password',
                  message_other: ''
                }});
            }
          }
        });
    }
  }

  // Navigate to Login
  toLogin() {
    this.router.navigate(['/auth/login']);
    this.signupForm.reset();
  }

}
