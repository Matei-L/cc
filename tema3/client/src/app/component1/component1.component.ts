import { Component, OnInit } from '@angular/core';
import { Data } from './Data';
import { Component1Service } from './component1.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.scss']
})
export class Component1Component implements OnInit {

  data: Data;

  constructor(private component1Service: Component1Service) {}

  ngOnInit(): void {
    this.showData();
  }

  showData() {
  this.component1Service.getData()
    .subscribe((data: Data) => {
      this.data = data;
      this.data.origin = environment.baseUrl + this.data.origin;
    });
  }

}
