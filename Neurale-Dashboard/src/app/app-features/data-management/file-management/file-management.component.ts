import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploadingService } from 'src/app/services/file-uploading.service';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {

  constructor(private datePipe: DatePipe,
              private fileService: FileUploadingService) { }

  ngOnInit(): void {
  }

}
