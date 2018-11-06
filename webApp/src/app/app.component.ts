import { Component } from '@angular/core';
import { Http_Requests } from './http-requests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Generador de peticiones';
  isGeneratingRequests = false;
  text = '';

  constructor(public http: Http_Requests) {}

  onGenerateRequests(): void {
    this.isGeneratingRequests = true;
    while (this.isGeneratingRequests) {
      this.http.postService({}, '')
      .then((success: any) => {
        this.text += '\n' + success;
      });
    }
  }

  onCancel(): void {
    this.isGeneratingRequests = false;
  }
}
