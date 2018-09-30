import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ShortenerServiceProvider } from '../../providers/shortener-service/shortener-service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  sites: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public shortener: ShortenerServiceProvider, public loadingCtrl: LoadingController) {
    this.loadSites();
  }

  loadSites(){
    const loader = this.loadingCtrl.create({
      content: "Cargando..."      
    });
    loader.present();
    this.shortener.getSites().then((data)=>{
      this.sites = data;
      loader.dismiss();
    })
  }
  
  navigate(i: number){
    window.open(`${this.shortener.backEndAddress}/${this.sites[i].code}`)
  }

  doRefresh(refresher) {
    this.loadSites();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
