import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticaProvider } from './../../providers/autentica/autentica';



@IonicPage()
@Component({
  selector: 'page-esqueci-senha',
  templateUrl: 'esqueci-senha.html',
})
export class EsqueciSenhaPage {
    form: FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private aut: AutenticaProvider,
              private toast: ToastController,
              private formBuilder: FormBuilder


              ) {
                this.creatForm();
  }
  private creatForm(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  onSubmit(){
    if(this.form.valid) {
      this.aut.forgotEmail(this.form.value.email).then( (user:any) => {
        this.toast.create({ message: 'Um e-mail foi enviado para que você resete sua senha', duration: 6000}).present();
        this.navCtrl.pop();
      })
      .catch(message => {
        this.toast.create({ message: message, duration: 3000}).present();
      })
    }

  }



}
