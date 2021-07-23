import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploadingService } from 'src/app/services/file-uploading.service';

@Component({
  selector: 'app-directory-management',
  templateUrl: './directory-management.component.html',
  styleUrls: ['./directory-management.component.scss'],
})
export class DirectoryManagementComponent implements OnInit {

  folderArray: any[];
  fileArray: any[] = [];
  file: File = null;
  dirId: any = -1;
  dir: string;
  bucketName: string;
  menuTopLeftPosition =  {x: '0', y: '0'}
  deleteFolder: any;
  deletedFile: any;

  constructor(private route: ActivatedRoute, private fileService: FileUploadingService, private datePipe: DatePipe) {
    this.route.data.subscribe((data: { directories: any }) => {
      this.bucketName = data.directories.bucket_name;
      this.folderArray = data.directories.folders;
      console.log(this.folderArray);
    });
  }

  ngOnInit(): void {}

  createNewFolder() {
    console.log(this.newFolderName);
    const alertMessage = 'Duplicate Folder with name ' + this.newFolderName.toLowerCase() + '. Please create a non-duplicate folder.';
    if (this.folderArray.some((e: any) => e.M.name.S.toLowerCase() === this.newFolderName.toLowerCase())) {
      alert(alertMessage);
    } else {
      console.log(this.newFolderName + '-' + new Date());
      const dateCreated = this.datePipe.transform(new Date(), 'dd MM yyyy');
      console.log(typeof dateCreated);
      this.folderArray.push({
        M: {
          name: { S: this.newFolderName },
          date: { S: dateCreated },
          files: { L: new Array() },
        },
      });
      this.fileService.createNewDirectory({ folders: this.folderArray }).subscribe((response: any) => {
        console.log(response);
        this.folderArray = response.folders;
      });
    }
  }

  showFiles(folderName, date) {
    console.log(this.folderArray);
    const folder_index = this.folderArray.findIndex((x: any) => x.M.name.S == folderName);
    this.dirId = folder_index;
    console.log(folder_index);
    const files = this.folderArray.filter((x: any) => x.M.name.S === folderName)[0].M.files;
    console.log(files);
    this.fileArray = files.L;
    this.dir = folderName;
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    var fileName = this.file.name.replace(" ", "_").replace("(", "").replace(")", "");
    console.log(this.fileArray);
    const alertMessage = 'Duplicate File with name ' + fileName.toLowerCase() + '. Please upload a new file';
    if (this.fileArray.some((e: any) => e.M.name.S.toLowerCase() === fileName.toLowerCase())) {
      alert(alertMessage);
    } else {
      console.log(this.file);
      const fileReader = new FileReader();
      const binary = fileReader.readAsBinaryString(this.file);
      console.log(this.datePipe.transform(this.file.lastModified, 'MMMM d, y'));
      const key = this.dir + '/' + fileName;
      //this.bucketName = 'executiveai'
      this.fileService
        .getS3PresignedUrl(this.bucketName, key, this.file.type, this.file.size, this.datePipe.transform(this.file.lastModified, 'MMMM d, y'), this.dirId)
        .subscribe((response: any) => {
          // const url = JSON.parse(response.body)
          const url = response;
          console.log(url);
          console.log(url.dynamodb);
          this.fileService.uploadToS3(url.s3.url, this.file, url.s3.fields).subscribe((response: any) => {
            var data = {
              'bucket_name': this.bucketName,
              'key': url.s3.fields.key,
              'size': this.file.size
            }
            console.log(data)
            this.fileService.fileUploadTrigger(data).subscribe((response1: any) => {
              console.log(response);
              console.log(response1);
              console.log(url.dynamodb.Attributes.folders.L[0].M.files);
              this.fileArray = url.dynamodb.Attributes.folders.L[0].M.files.L;
              console.log(this.fileArray);
            })
          });
        });
    }
    //this.fileArray.push(this.file);
  }

  addFile() {
    document.getElementById('xlFile').click();
  }

  newFolderName: string;
  getFolderName(event) {
    this.newFolderName = event.target.value;
  }

  onRightClick(event, folderName) {
    event.preventDefault();
    console.log("Hi")
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    console.log(this.menuTopLeftPosition)
    this.deleteFolder = folderName
    document.getElementById('menuButton').click();
  }

  delete() {
    
    this.folderArray = this.folderArray.filter((x: any) => x.M.name.S !== this.deleteFolder);
    console.log(this.folderArray)
    this.fileService.deleteDirectory(this.folderArray, this.deleteFolder).subscribe((response: any) => {
      console.log(response);
    })
  }

  edit() {
    console.log("Hi")
  }

  onRightClickFile(event, fileName) {
    event.preventDefault();
    console.log("File")
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    console.log(this.menuTopLeftPosition)
    this.deletedFile = fileName; 
    document.getElementById('fileMenuButton').click();
  }

  deleteFile() {
    this.fileArray = this.fileArray.filter((x: any) => x.M.name.S !== this.deletedFile);
    const key = this.dir + "/" + this.deletedFile
    this.fileService.deleteFile(this.fileArray, this.dirId, key).subscribe((response: any) => {
      console.log(response)
    })
  }

  editFile() {

  }
}
