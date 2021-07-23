import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CsvSelectorService } from 'src/app/services/csv-selector.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentModelComponent } from '../../payment/payment-model/payment-model.component';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss'],
})
export class ViewDashboardComponent implements OnInit {
  folders: any;
  isSelected: boolean;
  nullColumnsArray: any;
  dataArray: any;
  dateArray: any;
  csvDataHeads: any;
  headerCount: any;
  folderName: any;
  csvName: any;
  objectValuesArray: any;
  columnTypesArray: any;
  folderArray: any;
  csvSelectorType: string = 'Training';
  currentPage: number = 0;
  dashboardForm: FormGroup;
  dashboards: any[];
  constructor(
    private csvSelectorService: CsvSelectorService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.data.subscribe((data: { folders: any; dashboards: any }) => {
      this.folderArray = data.folders.folders;
      this.dashboards = data.dashboards.data;
      console.log(this.dashboards);
    });
  }

  openModal: boolean = true;
  ngOnInit() {
    this.openModal = true;
    // Check first login
    this.dashboardService.checkFirstLogin().subscribe((data) => {
      console.log(data);
      if (data.isFirstLogin === 'true') {
        const dialogRef = this.dialog.open(PaymentModelComponent, { disableClose: true });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      }
    });
  }

  selectFiles() {
    this.currentPage = 1;
  }

  createDashboard() {
    const formData = this.dashboardForm.value;
    formData.file = this.csvName;
    formData.folder = this.folderName;
    this.dashboardService.createDashboard(this.dashboardForm.value, this.delimiter).subscribe((response: any) => {
      console.log(response);
      alert(response.message);
      if (response.message == 'Dashboard Created!!!') {
        this.router.navigate([response.data], { relativeTo: this.route });
      }
    });
  }

  next() {
    this.currentPage += 1;
    if (this.currentPage === 2) {
      this.dashboardForm = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
      });
    }
  }

  previous() {
    this.currentPage -= 1;
  }

  getCSVName(event: any) {
    this.csvName = event;
  }

  getFolderName(event: any) {
    this.folderName = event;
  }

  getHeaders(event: any) {
    this.csvDataHeads = event;
    this.headerCount = this.csvDataHeads.length;
    // this.csvDataHeads.forEach((element) => {
    //   if (element.includes('Dt')) {
    //     this.dateArray.push(element);
    //   }
    // });
  }

  getData(event: any) {
    this.dataArray = event;
  }

  getNullColumns(event: any) {
    this.nullColumnsArray = event;
  }

  getColumnTypes(event: any) {
    this.columnTypesArray = event;
  }

  getObjects(event: any) {
    this.objectValuesArray = event;
  }

  delimiter
  getDelimiter(event) {
    this.delimiter = event
  }

  delete() {
    this.dashboardService.deleteDashboard(this.deleteDashboard).subscribe((response: any) => {
      console.log(response)
    })
  }

  edit() {

  }

  menuTopLeftPosition =  {x: '0', y: '0'}
  deleteDashboard: any;
  onRightClick(event, dashboard) {
    event.preventDefault();
    console.log("Hi")
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    console.log(this.menuTopLeftPosition)
    this.deleteDashboard = dashboard
    this.dashboards = this.dashboards.filter((x: any) => x.dashboardID.S !== dashboard);
    document.getElementById('menuButton').click();
  }
}
