import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class AutenticaProvider {
  public month: any;
  public day: any;
  public year: any;
  private PATH = 'users/';
  rootPage: any = 'HomePage';


  constructor(public auth: AngularFireAuth,
    public db: AngularFireDatabase) {

  }

 /* createAccount(user: any){
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((firebaseUser: firebase.User) => {
        this.db.object(this.PATH + firebaseUser.uid)
          .set({ nome: user.nome, nascimento: user.nascimento, email: user.email});

        this.db.object(this.PATH + firebaseUser.uid)
          .update({ emailVerified: false, email: user.email });

        firebaseUser.updateProfile({ displayName: user.nome, photoURL: null });
        firebaseUser.sendEmailVerification();

        this.signOut();
        resolve();
      })
      .catch(e => {
        reject(this.handlerError(e));

      });
    })
  }*/
  createAccount(user: any){
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential: firebase.auth.UserCredential) => {
      // .then((firebaseUser: firebase.User) => {
        this.db.object(this.PATH + userCredential.user.uid)
          .set({ nome: user.nome, nascimento: user.nascimento, email: user.email});

        //this.db.object(this.PATH + firebaseUser.uid)
        this.db.object(this.PATH + userCredential.user.uid)
          .update({ emailVerified: false, email: user.email });

        //firebaseUser.updateProfile({ displayName: user.nome, photoURL: null });
        //firebaseUser.sendEmailVerification();

          userCredential.user.updateProfile({ displayName: user.nome, photoURL: null });
          userCredential.user.sendEmailVerification();

        this.signOut();
        resolve();
      })
      .catch(e => {
        reject(this.handlerError(e));

      });
    })
  }



  public login(user: any){
    return new Promise((resolve, reject) => {
      this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then ((userCredential: firebase.auth.UserCredential) => {
        if (userCredential.user.emailVerified){
          this.db.object(this.PATH + userCredential.user.uid).update({emailVerified: true});
        }
        resolve ({emailVerified: userCredential.user.emailVerified});
      })
      .catch(e => {
        reject(this.handlerError(e));
      })
    });
  }

  public forgotEmail(email: string){
    return new Promise((resolve, reject) => {
      this.auth.auth.sendPasswordResetEmail(email).then( () => {
        resolve();
      })
      .catch(e => {
        reject(this.handlerError(e));
      });
    })
  }


  public signOut(){
    this.auth.auth.signOut();
    this.rootPage = 'EntrarPage';
  }

  private handlerError(error: any) {
    let message = '';
    if (error.code == 'auth/email-already-in-use') {
      message = 'O e-mail informado já está sendo usado.';
    } else if (error.code == 'auth/invalid-email') {
      message = 'O e-mail informado é inválido.';
    } else if (error.code == 'auth/weak-password') {
      message = 'A senha informada é muito fraca.';
    } else if (error.code == 'auth/user-not-found') {
      message = 'Usuário não encontrado.';
    } else if (error.code == 'auth/wrong-password') {
      message = 'Usuário/senha inválido(s).';
    } else {
      message = 'Ocorreu algum erro, por favor tente novamente.';
    }

    return message;
  }


}
