import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GestionDocumentosService } from 'src/app/services/gestion-documentos.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-gestion-documentos',
  templateUrl: './gestion-documentos.component.html',
  styleUrls: ['./gestion-documentos.component.scss']
})
export class GestionDocumentosComponent implements OnInit {

  catalogoOpciones: any[] = [
    {
      idCatalogueChild: 1,
      name: 'Carga',
    },
    {
      idCatalogueChild: 2,
      name: 'Descarga',
    },
  ];

documentos: any[] = []

  mostrarCarga: boolean = false;
  mostrarDescarga: boolean = false;
  mostrarConsultaDescargas: boolean = false;

  grupoOpciones!: FormGroup;

  consultarDescarga!: FormGroup;

  formCarga!: FormGroup;


  selectedFile: File | null = null;


  selectedFiles: FileList | undefined | null;

  currentFile: File | undefined | null;
  progress = 0;
  message = '';

  fileInfos!: Observable<any>;


  archivoData: Uint8Array | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: GestionDocumentosService,
    private router: Router,
    private http: HttpClient,
    private uploadService: UploadFileService
    

  ) {
    this.buildForm();
    this.grupoOpciones = new FormGroup({
      opciones: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }
  private buildForm() {
    this.formCarga = this.formBuilder.group({
      nombreDoc: [
        '',
        [
          Validators.required
        ],
      ],
      fechaElaboracion: ['', [Validators.required]],
      fechaIngreso: [
        '',
        [
          Validators.required
        ],
      ],

      propietario: [
        '',
        [
          Validators.required
        ],
      ],


    });

    this.consultarDescarga = new FormGroup({
      propietario: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
    });

  }


  consultarDocDescarga(){


    const formulario = this.consultarDescarga.value;

    this.mostrarConsultaDescargas = true;
  }
  
  

consultarOpciones(){
  let variable = {
    opcion : this.grupoOpciones.get('opciones')?.value
  }

  if(variable.opcion=='Descarga'){
    this.mostrarDescarga=true
    this.mostrarCarga=false
  }else{
    this.mostrarCarga=true
    this.mostrarDescarga=false
  }
  this.mostrarConsultaDescargas = false;


}

async guardar() {
  this.spinner.show(); // Mostrar el spinner de carga

  setTimeout(() => {
    window.location.reload();
  }, 1000);

  this.progress = 0;

  if (this.selectedFiles && this.selectedFiles.length > 0) {
    const file = this.selectedFiles.item(0);

    if (file) {
      this.uploadService.upload(file).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            }
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        err => {
          this.progress = 0;
          this.message = 'Could not upload the file!';
        }
      );

      this.selectedFiles = null;
    }

    let post: any = {
      nombreDocumento: this.formCarga.controls['nombreDoc'].value,
      fechaElaboracion: this.formCarga.controls['fechaElaboracion'].value,
      fechaIngreso: this.formCarga.controls['fechaIngreso'].value,
      propietario: this.formCarga.controls['propietario'].value,
      idUsuario: 1,
      linkArchivo: file?.name
    };

    try {
      const res = await this.service.guardar(post).toPromise();

      const ip = await this.service.getIp();

      let bitacoraPost: any = {
        fechaRegistro: new Date(),
        idDocumento: res.idDocumento,
        idUsuario: res.idUsuario,
        ipUsuario: ip
      };

      await this.service.crearBitacora(bitacoraPost).toPromise();

    } catch (error) {
      
    }
  }
}

    
      obtenerDocumentos() {

        this.spinner.show(); // Mostrar el spinner de carga

        setTimeout(() => {
          this.spinner.hide(); // Ocultar el spinner después de 5 segundos
        }, 1000);

      
        this.service.obtenerDocumentos(this.consultarDescarga.controls.fechaInicio.value, this.consultarDescarga.controls.fechaFin.value, this.consultarDescarga.controls.propietario.value).toPromise().then(tmp => {

      
          this.documentos = [];
      
          const opcionesFecha: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };


          for (let i = 0; i < tmp.length; i++) {

            const fechaElaboracion = new Date(tmp[i].fechaElaboracion).toLocaleDateString('es-ES', opcionesFecha);
            const fechaIngreso = new Date(tmp[i].fechaIngreso).toLocaleDateString('es-ES', opcionesFecha);
      
      
            const documento = {
              nombreDocumento: tmp[i].nombreDocumento,
              fechaElaboracion: fechaElaboracion,
              fechaIngreso: fechaIngreso,
              propietario: tmp[i].propietario,
              Descargar: "http://localhost:18080/external/files/" + tmp[i].linkArchivo,
              doc: tmp[i].linkArchivo
             
              
            };
            
            
            this.documentos.push(documento);
          }
      
          
        });
      
        this.mostrarConsultaDescargas = true;
      }
      
      limpiar(){
        this.formCarga.reset();

      }
      
      selectFile(event: any) {
        this.selectedFiles = event.target.files;
      }

      
}
