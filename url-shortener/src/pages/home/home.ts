import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShortenerServiceProvider } from '../../providers/shortener-service/shortener-service'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  backEndAddress: string = '192.168.0.10:3000';
  fullLink: string = '';
  shortenLink: string = '';
  constructor(public navCtrl: NavController, public shortener: ShortenerServiceProvider) {

  }

  validURL(url:string) {
    var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(url);
  }

  shorten(url: string){
    if (this.validURL(url)){
      const find = '/';
      const re = new RegExp(find, 'g');
      url = url.replace(re, '%2F');

      this.shortener.postSite(url).then((data: any)=>{
        this.shortenLink = `${this.shortener.backEndAddress}/${data.answer.code}`
      });
    }else{
      console.log('Invalid URL')
    }
  }

}
