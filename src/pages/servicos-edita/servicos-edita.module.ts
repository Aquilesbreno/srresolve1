import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicosEditaPage } from './servicos-edita';

@NgModule({
  declarations: [
    ServicosEditaPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicosEditaPage),
  ],
})
export class ServicosEditaPageModule {}
