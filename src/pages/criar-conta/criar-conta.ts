import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticaProvider } from './../../providers/autentica/autentica';




@IonicPage()
@Component({
  selector: 'page-criar-conta',
  templateUrl: 'criar-conta.html',
})
export class CriarContaPage {

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
      nome: ['', Validators.required],
      nascimento: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(){
    if(this.form.valid) {
      this.aut.createAccount(this.form.value)
       .then( () => {
        this.toast.create({message:'Conta criada com sucesso. Foi enviado um e-mail de confirmação para você efetuar o login.',
         duration: 3000}).present();
         this.navCtrl.setRoot('EntrarPage');
      })
      .catch(message => {
        this.toast.create({message: message, duration: 3000}).present();
      })
    }
  }

  onClose(){
    this.navCtrl.pop();
  }



  }
