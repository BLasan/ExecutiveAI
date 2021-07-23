import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadingService {
  constructor(private http: HttpClient) {}

  getUserDirectories(): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/getuserfolders';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    console.log(requestOptions);
    return this.http.get<any>(url, requestOptions);
  }

  getS3PresignedUrl(
    bucketName,
    key,
    fileType,
    fileSize,
    dateModified,
    folderId
  ): Observable<any> {
    const apiGatewayUrl =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/gets3url';
    const params = {
      bucketName: bucketName,
      key: key,
      contentType: fileType,
      fileSize: fileSize,
      dateModified: dateModified,
      folderId: folderId,
    };

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };

    return this.http.get(apiGatewayUrl, { headers, params });
  }

  uploadToS3(url: string, file: any, fields: any): Observable<any> {
    const formData = new FormData();
    formData.append('AWSAccessKeyId', fields.AWSAccessKeyId);
    formData.append('key', fields.key);
    formData.append('policy', fields.policy);
    formData.append('signature', fields.signature);
    formData.append('x-amz-security-token', fields['x-amz-security-token']);
    formData.append('file', file);
    //this.http = new HttpClient(this.handler)
    //const secret = new TextEncoder().encode("AWS4"+"AKIAJECQKZCQFM2I6UCA")
    // const secret = "AWS4"+"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"
    // const currentDate = new Date();
    // const tempVal = currentDate;
    // const curDateString = tempVal.toISOString().replace('-', '').replace('-', '').replace(':', '').replace(':', '').replace(':', '').split('T')
    // const secPart = 'T' + curDateString[1].substring(0, 6) + 'Z'
    // const firstPart = this.datePipe.transform(currentDate, 'yyyyMMdd')
    // const date = this.datePipe.transform(currentDate, 'yyyyMMdd')
    // console.log(date)
    // console.log(firstPart+secPart)
    // const sha256Date = CryptoJS.HmacSHA256(secret, firstPart+secPart)
    // const sha256Region = CryptoJS.HmacSHA256(sha256Date, 'us-east-1')
    // const sha256Service = CryptoJS.HmacSHA256(sha256Region, 's3')
    // const sha256Signing = CryptoJS.HmacSHA256(sha256Service, "aws4_request")
    // const signature = sha256Signing.toString(Hex)
    // const auth = "AWS4-HMAC-SHA256 Credential=AKIAJ7VSEFECETMWBPAA/" + date + "/us-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=" + "42aa48c2e1dae8e175bb336d8b006d2fce4d0580e51ba4e91dc2eabf93a7d015"
    // const httpHeaders = {'Content-Type': file.type,'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Methods':'PUT', 'Authorization': auth, 'X-Amz-Content-Sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','X-Amz-Date': firstPart+secPart}
    // const httpHeadersParam = new HttpHeaders(httpHeaders);
    //const req = new HttpRequest('PUT', url, file, { headers: httpHeadersParam, reportProgress: true })
    // return this.http.put(url, file);
    return this.http.post(url, formData);
  }

  fileUploadTrigger(data: any): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/fileuploadtrigger';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.post(url, JSON.stringify(data), requestOptions);   
  }

  createNewDirectory(folderDetails: any): Observable<any> {
    const url =
      'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/createfolder';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.post(url, JSON.stringify(folderDetails), requestOptions);
  }

  deleteDirectory(data: any, folderName: any): Observable<any> {
    const url =
    'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/deletefolder';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.patch(url, JSON.stringify({'folders': {'L': data}, 'folder_name': folderName}), requestOptions); 
  }

  deleteFile(data: any, dirId: any, key: any): Observable<any> {
    const url =
    'https://h9tp4sv29j.execute-api.us-east-1.amazonaws.com/v1/deletefiles';

    const headers = {
      Authorization: localStorage.getItem('IdToken'),
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };

    return this.http.patch(url, JSON.stringify({'files': {'L': data}, 'key': key, 'dir_id': dirId}), requestOptions); 
  }
}
