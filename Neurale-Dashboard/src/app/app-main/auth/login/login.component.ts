import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/app-common/common-dialog/common-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    console.log(this.loginForm.value);
    this.submitted = true;

    if (!this.loginForm.invalid) {
      this._authService.login(this.loginForm.value).subscribe((res) => {
        console.log(res);
        if (res['status'] === 'success') {
          localStorage.setItem(
            'AccessToken',
            res.response.AuthenticationResult.AccessToken
          );
          localStorage.setItem(
            'IdToken',
            res.response.AuthenticationResult.IdToken
          );
          // TODO : Set Encryption for refresh token
          localStorage.setItem(
            'RefreshToken',
            res.response.AuthenticationResult.RefreshToken
          );
          localStorage.setItem('loggedIn', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          // Success popup
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: '330px',
            height: '100px',
            data: {
              message: res.response.split(':')[1],
              message_other: ''
            }});
        }
      });
    }
  }

  // Navigate to Signup
  toSignup() {
    this.router.navigate(['/auth/signup']);
    this.loginForm.reset();
  }
}
