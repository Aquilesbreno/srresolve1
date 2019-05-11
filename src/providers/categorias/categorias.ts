import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';


@Injectable()
export class CategoriasProvider {
  private PATH='categorias/';

constructor(private db:AngularFireDatabase) {
}

public getAll(){
  return this.db.list(this.PATH)
    .snapshotChanges().pipe(
      map(changes =>{
      return changes.map(m=> ({ key: m.payload.key, ...m.payload.val() }));
    }))
}

get(categoriaKey:string){
  return this.db.object(this.PATH + categoriaKey)
  .snapshotChanges().pipe(
  map(m => {
    return { key: m.key, ...m.payload.val()};
  }));
}

save(categoriaForm: any){
  const categoria ={
    name: categoriaForm.name,
    description: categoriaForm.description
  }

  if (categoriaForm.key){
    this.db.list(this.PATH)
    .update(categoriaForm.key, categoria);
  } else {
    this.db.list(this.PATH).push(categoria);
  }

}

remove(categoriaKey:string){
  this.db.list(this.PATH).remove(categoriaKey);
}

}
