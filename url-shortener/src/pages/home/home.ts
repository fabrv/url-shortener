import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ShortenerServiceProvider } from '../../providers/shortener-service/shortener-service'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('shortenInput') shortenInput;
  backEndAddress: string = '192.168.0.10:3000';
  fullLink: string = '';
  shortenLink: string = '';
  constructor(public navCtrl: NavController, public shortener: ShortenerServiceProvider, public toastCtrl: ToastController) {    
  }

  validURL(url:string) {
    var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(url);
  }

  shorten(url: string){
    if (this.validURL(url)){
      let find = '/';
      let re = new RegExp(find, 'g');
      url = url.replace(re, '%2F');

      find = '\\?';
      re = new RegExp(find, 'g');
      url = url.replace(re,'%3F');

      this.shortener.postSite(url).then((site: any)=>{
        this.shortenLink = `${this.shortener.backEndAddress}/${site.data.code}`

        this.showMsg(this.toastCtrl, 'Vinculo exitosamente acortado');
      });
    }else{
      console.log('Invalid URL')
      this.showMsg(this.toastCtrl, 'URL invalido');
    }
  }

  showMsg(toastCtrl: ToastController, msg: string) {
    let toast = toastCtrl.create({
        message: msg,
        duration: 3000
    });
    toast.present();
  }

  navigate(){
    window.open(this.shortenLink);
  }

}
