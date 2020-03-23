import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from './Data';
import { SensitiveData } from '../sensitive';

@Injectable({
    providedIn: 'root',
})
export class Component1Service {
    api = SensitiveData.apiEndpoint;

    constructor(private http: HttpClient) { }

    getData() {
        return this.http.get<Data>(this.api);
    }

}