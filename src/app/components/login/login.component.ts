import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm: FormGroup;
  redirect: string | null = null;
  // username!: string;
  // password!: string;
  formCarga!: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {


    this.buildForm();

    localStorage.setItem('section', 'login');
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      pass: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has("redirect")) {
        this.redirect = params.get("redirect");
      }
    })
  }

  private buildForm() {
    this.formCarga = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required
        ],
      ],
      password: ['', [Validators.required]],


    });
    }

  login(){
    let post: any = {
      usuario: this.formCarga.controls['username'].value,
      contrasenia: this.formCarga.controls['password'].value,

    }

          this.authService.login(post).subscribe(
            response => {
              // Autenticación exitosa, redirige a la página principal o a otra vista
              this.router.navigate(['/documentitos']);

            },
            error => {
              // Error en la autenticación, muestra un mensaje de error al usuario
              console.log('Error de autenticación:', error);

               Swal.fire({
                title: 'Credenciales Invalidas',
                text: 'Ingrese nuevamente sus credenciales',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                
              }).then(async (result) => {
                if(result.isDenied){
                  this.router.navigate(['/login']);
                }
            })
          }
          );
    
  }

  
}
