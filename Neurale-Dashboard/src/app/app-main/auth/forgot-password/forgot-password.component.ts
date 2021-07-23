import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(
    private formBuild: FormBuilder, 
    private _authService: AuthService,
    public dialog: MatDialog,
    private router: Router
    ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    let data = {
      email: this.forgotPasswordForm.controls['email'].value
    }
    this._authService.forgotPassword(data).subscribe( data => {
      this.router.navigate(['/auth/confirm-forgot-password']);
    })
  }

}
