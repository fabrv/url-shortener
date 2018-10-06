import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the ShortenerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShortenerServiceProvider {
  data: Observable<any>;
  result: any = [];
  public backEndAddress: string = 'http://10.0.3.159:3000';
  constructor(public http: HttpClient) {
  }

  postSite(site: string){
    return new Promise ((shorten)=>{
      this.http.post(`${this.backEndAddress}/sites/${site}`,{}, {})
      .subscribe(data =>{
        shorten(data);
      });
    }) 
  }

  getSites(){
    return new Promise ((sites)=>{
      this.http.get(`${this.backEndAddress}/sites`)
      .subscribe(data =>{
        sites(data);
      });
    })
  }

}
