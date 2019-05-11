import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable()
export class ServicosProvider {
  private PATH='servicos/';
  private PATH_IMG = 'img/';

  // FirebaseApp é para parte de Upload de Arquivos
  // AngularFireDatabase não dá suporte para o Firebase Storage
  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase) {}

  // consulta todos os produtos, e ordena pelo nome da Categoria
  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('categoryName'))
      .snapshotChanges().pipe(
        map(changes => {
        return changes.map(m => ({ key: m.key, data: m.payload.val() }));
      }));
  }

  // file é o arquivo passando por parâmetro
  save(item: any, file: File) {
    const product = {
      name: item.name,
      description: item.description,
      imgUrl: item.imgUrl,
      price: item.price,
      categoryKey: item.categoryKey,
      categoryName: item.categoryName
    };

    if (item.key) {
      this.db.object(this.PATH + item.key).update(product).then(() => {
        // quando o usuário clicar pra salvar eu salvo a imagem e se salvou com sucesso (then) e daí fazer o upload da imagem
        // Se não ficaria assim: this.db.object(this.PATH + item.key).update(product);
        if (file) {
          //this.uploadImg(item.key, file);
        }
      });
    } else {                                // a partir do then tenho na variavel result o resultado da inclusão e pego a key que foi incluída...
      this.db.list(this.PATH).push(product).then((result: any) => {
        if (file) {
          //this.uploadImg(result.key, file);
        }
      });
    }
  }


  /*public getALL(){
    return this.db.list(this.PATH)
      .snapshotChanges()
      .map(changes =>{
        return changes.map(m=> ({ key: m.key, ...m.payload.val() }))
      })
  }*/

  get(produtoKey:string){
    return this.db.object(this.PATH + produtoKey)
    .snapshotChanges().pipe(
      map(m => {
      return { key: m.key, ...m.payload.val()};
    }));
  }

  uploadImg(key: string, file: File) {
    const filePath =  'produtos/'+key+'/'+file.name;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe(
      finalize(() => {
      ref.getDownloadURL().subscribe( url => {
        this.db.object(this.PATH + key).update( {imgUrl: url, filepath: filePath })
      })
    })
    ).subscribe();



}

  // uploadImg(key: string, file: File) {
  //   const storageRef = this.fb.storage().ref();              // put(file) adicionando o arquivo
  //   const uploadTask = storageRef.child(this.PATH_IMG + key).put(file);
  //                                             // quando o status mudar... implementar 3 métodos
  //                                             // snapshot, error e quando tiver finalizado
  //   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //     (snapshot: any) => {
  //       // upload em andamento
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     },
  //     (error) => {
  //       // upload falhou
  //       console.log(error);
  //     },
  //     () => {
  //       // upload com sucesso, update estou usando somente uma parte do registro
  //                                                         //uploadTask pego a propriedade downloadURL que é caminho do storage gravado da imagem
  //       this.db.object(this.PATH + key).update({ imgUrl: uploadTask.snapshot.downloadURL });
  //     }
  //   );
  // }

  //   remove(produtokey: string, removeImg: boolean) {
  //     removeImg= false;
  //   this.db.list(this.PATH).remove(produtokey).then(() => {
  //     if (removeImg) {
  //       this.removeImg(produtokey);
  //     }
  //   });
  // }

  // private removeImg(produtokey: string) {
  //   const storageRef = this.fb.storage().ref();
  //   storageRef.child(this.PATH_IMG + produtokey).delete();
  // }

  remove(key: string, filePath: string) {
    this.db.object(this.PATH + key).update({ imgUrl: '' });
    this.db.list(this.PATH).remove(key);
    if (filePath) {
      this.removeImg(filePath, key, false);
    }
}

  removeImg(filePath: string, key: string, atualizarProduto: boolean = true) {
    const ref = this.storage.ref(filePath);
    ref.delete();
    if (atualizarProduto) {
      this.db.object(this.PATH + key).update( {filepath: '', imgUrl: '' })
    }
  }


// removeImgOfProduct(produtokey: string) {
//     this.removeImg(produtokey);
//     this.db.object(this.PATH + produtokey).update({ imgUrl: '' });
//   }









}


