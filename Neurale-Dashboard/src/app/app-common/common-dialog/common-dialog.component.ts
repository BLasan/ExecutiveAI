import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

  @Output() submitClicked = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    message: String;
    message_other: String;
    
  ngOnInit(): void {
    console.log(this.data)
    this.message = this.data.message
    this.message_other = this.data.message_other
  }

}
