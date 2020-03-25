import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from './Data';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class Component1Service {
    api = environment.baseUrl + '/example';

    constructor(private http: HttpClient) { }

    getData() {
        return this.http.get<Data>(this.api);
    }

}