import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/app-common/common-dialog/common-dialog.component';

@Component({
  selector: 'app-signup-verification',
  templateUrl: './signup-verification.component.html',
  styleUrls: ['./signup-verification.component.scss'],
})
export class SignupVerificationComponent implements OnInit {
  emailVerificationForm: FormGroup;
  submitted = false;

  hasError: any = null;
  isVisible: boolean = false;

  constructor(
    private formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.emailVerificationForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
    });
  }

  get f() {
    return this.emailVerificationForm.controls;
  }

  submit() {
    console.log(this.emailVerificationForm.value);
    this.submitted = true;

    if (!this.emailVerificationForm.invalid) {
      this._authService
        .emailVerification(this.emailVerificationForm.value)
        .subscribe((res) => {
          if (res['status'] === 'success') {
            this.router.navigate(['/auth/login']);
            this.emailVerificationForm.reset();
          } else {
            // Success popup
            const dialogRef = this.dialog.open(CommonDialogComponent, {
              width: '330px',
              height: '100px',
              data: {
                message: 'Verification Faliure',
                message_other: ''
              }});
          }
          
        });
    }
  }

  // Navigate to Signup
  toSignup() {
    this.router.navigate(['/auth/signup']);
    this.emailVerificationForm.reset();
  }
}
