import { Component, OnInit, ViewChild, Input, NgZone, OnDestroy } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { UcprViewProcessService } from 'src/app/dashboard/processes/ucpr/components/ucpr-view-process/services/ucpr-view-process.service';
import { ToastrService } from 'ngx-toastr';
import { CobProcessService } from 'src/app/dashboard/processes/cob/components/cob-process/services/cob-process.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit, OnDestroy {
  @ViewChild('selectedFile', { static: true }) selectedFile: any;
  @Input() childResetArr;
  @Input() submittedFileData;
  fileArr = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  fileObj: any;
  myArr;
  uploadFile: boolean = true;
  uploaderFromApi: any;
  maxFileSize: number;
  errorMessage: string;
  allowedTypes: string[];
  businessKey: any;
  docTypeArr = [];
  docSubTypeArr = [];
  docSubTypeArr2 = [];
  config2: any = { 'class': 'docTypeAutocomplete', 'placeholder': 'Select Document SubType', 'sourceField': ['documentSubtype'] }
  config3: any = { 'class': 'docTypeAutocomplete', 'placeholder': 'Select Document Type', 'sourceField': ['documentType'] }
  myControl = new FormControl();
  subTypeControl = new FormControl();
  filteredOptions: Observable<String[]>;
  subTypeOptions: Observable<String[]>;
  isReadOnly: any;
  isActive: boolean = false;
  arrayInputs = [];
  releaseDocType : Subscription;

  // defining form & its control as formarray for the doc subtype dropdown.
  formName = this.fb.group({
    controllerArray: this.fb.array([])
  })
  get fileList(): FormArray {
    return this.formName.get('controllerArray') as FormArray;
  }


  constructor(private ucprviewservice: UcprViewProcessService, private toastr: ToastrService,
    private cobservice: CobProcessService, private fb: FormBuilder) {
    //To call this function on the change of file upload
    this.uploaderReset();
    this.getAllDocSubTypes();
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe(res => this.response = res);
  }

    /*
   Name of Author : Ketan Pande
   Function Name : ngOnDestroy()
   Description : Releasing all the subscribed values here.
    */
 ngOnDestroy(){
   if(this.releaseDocType){this.releaseDocType.unsubscribe()};
 }

  /*
   Name of Author : Ketan Pande
   Function Name : ngOnInit()
   Description : In this function, if its in ucpr-report page, it will hide the file upload.
    */
  ngOnInit() {
    if (this.childResetArr === '') {
      this.uploader = this.childResetArr;
    }
    if (this.submittedFileData && this.submittedFileData[0].token === "ucpr-reports") {
      this.uploadFile = false;
    }
  }

  /*
   Name of Author : Ketan Pande
   Function Name : getAllDocSubTypes()
   Description : In this function, I am calling the getDocSubtype API and pushing it in array.
                 And population the first dropdown of docsubtype using this.
    */
  getAllDocSubTypes() {
    let objParams = {
      "businessKey": this.businessKey,
    };
    this.releaseDocType = this.cobservice.getDocsSubType(objParams).subscribe(data => {
      if (data && data['result'].length > 0) {
        for (let i = 0; i < data['result'].length; i++) {
          let val = data['result'][i].documentSubtype
          this.docTypeArr.push(val)
        }
      }
    }, error => {
      this.toastr.error(error ? error : 'Http Failure Error')
    }, () => {
    })
  }

 /*
   Name of Author : Ketan Pande
   Function Name : onSelect()
   Description : This function gets called after selecting the docsubtype val from dropdown. on the basis of this
                 selected value I am calling another API of getdoctypebysubtypename to get all the doc types related
                 to that subtype. Also I am binding the value to formcontrol here. If the response of the API is more than
                 2 in length it will go into else and stored in  docSubTypeArr2 .
    */
  onSelect(item: any, index) {
    this.fileArr[index]['docSubType'] = item
    let obj = { "documentSubtype": item }
    this.cobservice.getdoctypebysubtypename(obj).subscribe(data => {
      if (data && data['result'].length > 0) {
        if (data['result'].length === 1) {
          let val = data['result'][0].documentType;
          this.docSubTypeArr[0] = val;
          this.isActive = true;
          const formArrayValue = (this.formName.get('controllerArray') as FormArray);
          const formArrayGroup = formArrayValue.at(index) as FormGroup;
          const control = formArrayGroup.get('controlerInputName1');
          control.setValue(data['result'][0].documentType);
          control.disable();
          control.updateValueAndValidity();
          this.fileArr[index]['doctype'] = data['result'][0].documentType;
          this.docSubTypeArr = [];
        }
        else {
          var tempArr = [];
          this.docSubTypeArr = [];
          this.isActive = true;
          const formArrayValue = (this.formName.get('controllerArray') as FormArray);
          const formArrayGroup = formArrayValue.at(index) as FormGroup;
          const control = formArrayGroup.get('controlerInputName1');
          control.setValue('');
          control.enable();
          control.updateValueAndValidity();
          for (let i = 0; i < data['result'].length; i++) {
            let val = data['result'][i].documentType
            tempArr.push(val)
          }
          this.docSubTypeArr2 = tempArr;
        }
      }
    })
  }


  ngOnChanges() {

    this.uploaderReset();
  }


  getDocSubTypeVal(val, index) {
    this.fileArr[index]['doctype'] = val;
  }

  uploaderReset() {
    if (this.submittedFileData) {
      this.uploaderFromApi = this.submittedFileData[0].attachments;

      if (this.uploaderFromApi.length > 0) {
        this.isActive = true;
      }
      this.businessKey = this.submittedFileData[0].businessKey;
      this.isReadOnly = (this.submittedFileData && this.submittedFileData[0].isReadOnly ? this.submittedFileData[0].isReadOnly : '')
      this.ucprviewservice.saveFileArr(null);
    }

    this.maxFileSize = 10 * 1024 * 1024; // max file size is set to 10mb
    this.allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/bmp', 'text/htm',
      'text/html', 'image/gif', 'application/rtf', 'image/tif', 'image/tiff', 'application/msword',
      'text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/xlsx',
      'application/vnd.ms-excel']

    this.uploader = new FileUploader({
      maxFileSize: this.maxFileSize,
      queueLimit: 15,
      // allowedMimeType: ["pdf", "text"],
      allowedMimeType: this.allowedTypes,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });

        });
      }
    });
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);


    this.uploader.onAfterAddingFile = (fileItem) => {
      this.fileList.push(this.fb.group({
        controlerInputName1: [''],
        subtype: ['']
      }))
      this.docSubTypeArr2 = [];
      fileItem.withCredentials = false;
      this.fileObj = fileItem;
      this.fileArr.push(fileItem);
      // this.docSubTypeArr2 =  [];
      // this.docSubTypeArr = [];
      //  this.myControl.setValue('')
      if (this.uploaderFromApi && this.uploaderFromApi.length > 0) {
        if (this.uploaderFromApi.length + this.fileArr.length > 15) {
          this.toastr.error("You can upload upto 15 files at a time");
          return;
        }
      }
      else {
        if (this.fileArr.length > 15) {
          this.toastr.error("You can upload upto 15 files at a time");
          return;
        }
      }

      let sendFileObj = {
        'file': this.fileArr,
        'isSendToApi': true
      }
      this.ucprviewservice.saveFileArr(this.fileArr);

    }

  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {

    switch (filter.name) {
      case 'fileSize':
        this.errorMessage = `Maximum upload size exceeded (${item.size} of ${this.maxFileSize} allowed)`;
        this.toastr.error(this.errorMessage)
        break;
      case 'queueLimit':
        this.toastr.error("You can upload upto 15 files at a time");
        break;
      case 'mimeType':
        this.toastr.error("File type not allowed");
        break;
      default:
      // this.toastr.error("Something went wrong");
      // this.errorMessage = `Unknown error (filter is ${filter.name})`;
    }
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  removeFile(item, index) {
    item.remove();
    this.fileList.removeAt(index);
    // for (var i = 0; i < this.fileArr.length; i++) {
    this.fileArr.splice(index, 1)
    // }
    if (this.fileArr.length === 0) {
      this.isActive = false;
    }

  }

  // clearInput(index) {
  //   const formArrayValue = (this.formName.get('controllerArray') as FormArray);
  //   const formArrayGroup = formArrayValue.at(index) as FormGroup;
  //   const control = formArrayGroup.get('subtype');
  //   control.reset();

  //   control.updateValueAndValidity();
  //   this.docTypeArr = [];
  //   this.getAllDocSubTypes();
  // }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  downloadFile(item, index) {
    const linkSource = 'data:application/pdf;base64,' + item.fileContents;
    const downloadLink = document.createElement("a");
    const fileName = item.fileName;//+ '.' + item.fileExt
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

  }

}
