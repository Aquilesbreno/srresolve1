import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import {ToastController} from 'ionic-angular';
import {ServicosProvider} from './../../providers/servicos/servicos'



@IonicPage()
@Component({
  selector: 'page-servicos-lista',
  templateUrl: 'servicos-lista.html',
})
export class ServicosListaPage {
  servicos: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private servicosProvider: ServicosProvider) {

      this.servicos = this.servicosProvider.getAll();//aqui ta guardando todos os produtos
}

newItemServicos(){ // push é método que chama/abre uma página
           // o nome da page vc vê na classe da Page
this.navCtrl.push('ServicosEditaPage');
}

editItemServicos(produto:any){
this.navCtrl.push('ServicosEditaPage', {produtokey: produto.key});

}


  removeItemServicos(produtokey:string, hasImg: boolean){
    // this.servicosProvider.remove(produtokey, hasImg);
    this.toast.create({
    message:"Servicos removidos com sucesso",
      duration: 3000,
      position: 'botton'}).present();
  }



}

