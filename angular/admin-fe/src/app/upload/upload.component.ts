import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OverallService} from '../service/overall.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  form: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.min(0.0001),Validators.max(0.9999),Validators.required, Validators.pattern(/[\S]/)]),
    description: new FormControl('', [
      Validators.min(0.0001),Validators.max(0.9999),Validators.required, Validators.pattern(/[\S]/)]),
    acceptTerms: new FormControl(''),
    filer: new FormControl('')
  });

  selectedFiles: FileList | undefined | null;
  currentFile: File | null | undefined;
  progress = 0;
  message = '';


  constructor(private uploadService: OverallService, private route: Router) { }

  ngOnInit(): void {
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }


  upload(): void {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile, this.form.value).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.form.reset()
          this.route.navigate(['/videos'])
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });

    this.selectedFiles = undefined;
  }


  onSubmit(): void {

    if(!this.form.invalid) {
      console.log('fff')
      this.upload();
    }

    // console.log(JSON.stringify(this.form.value, null, 2));
    

}



}
