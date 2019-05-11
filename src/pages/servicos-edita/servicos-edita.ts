import { Observable } from 'rxjs/Observable';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { ServicosProvider } from './../../providers/servicos/servicos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';






@IonicPage()
@Component({
  selector: 'page-servicos-edita',
  templateUrl: 'servicos-edita.html',
})
export class ServicosEditaPage {

  title:string;
formServicos:FormGroup;
// carregar as categorias no ion-select
categorias: Observable<any[]>;
// armazenar um produto
servicos:any;
hasImg:false;
private file: File=null;
// armazenar uma categoria
categoriaItem:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private servicosProvider: ServicosProvider,
              private categoriasProvider: CategoriasProvider) {

              this.servicos = this.navParams.data.produtoKey|| {}

              this.SetupPageTitle();
              this.createForm();
              //buscar todas as categorias
              this.loadCategorias();


              const subscribe = this.servicosProvider.get(this.navParams.data.produtokey).subscribe((servicosData: any) =>{

                subscribe.unsubscribe();
                  this.servicos = servicosData;
                  console.log(this.servicos);
                  this.createForm();

              });

  }

  private SetupPageTitle(){
    if(this.navParams.data.produtokey){
      this.title="Alterando Servico";
    } else {
      this.title="Novo Servico";
    }
  }



  private createForm(){
    this.formServicos = this.formBuilder.group({
      key: [this.servicos.key],
      name: [this.servicos.name, Validators.required],
      description: [this.servicos.description],
      price: [this.servicos.price, Validators.required],
      categoryKey: [this.servicos.categoryKey, Validators.required],
      categoryName: [this.servicos.categoryName],
      imgUrl: [this.servicos.imgUrl],
      img:[this.servicos.img],
    })
  }


  onSubmit(){
    if (this.formServicos.valid) {
      this.servicosProvider.save(this.formServicos.value, this.file);
      //this.toast.show('servicos salvo com sucesso');
      this.toast.create({ message: 'Categoria salva com sucesso', duration: 3000}).present();
      this.navCtrl.pop();
    }
  }



    getCategorias() {
      const subscribe = this.categoriasProvider.get(this.formServicos.value.categoryKey).subscribe((categoriasData: any) => {
        subscribe.unsubscribe();
        this.categoriaItem = categoriasData;
        console.log(this.categoriaItem);
        this.formServicos.controls['categoryName'].setValue(this.categoriaItem.name);//tem que ta igual ao que foi declarado no banco de dados//
        console.log(this.categoriaItem.name);
      });
    }

    private loadCategorias() {
      this.categorias = this.categoriasProvider.getAll();
    }





  }
