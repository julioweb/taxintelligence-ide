import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from "../../environments/environment";
import { AuthService } from "../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) {

    if (environment.UsuarioSenhaFixo != null) {
        this.Usuario = environment.UsuarioSenhaFixo.Usuario;
        this.Senha = environment.UsuarioSenhaFixo.Senha;
    }
}

  ngOnInit() {
  }

  public Usuario: string;
  public Senha: string;

  public LoginMsg: string = "";
  public isDanger:boolean = false;

  bLogin_click(){
    this.authService.Login(this.Usuario, this.Senha)
            .subscribe(next => {
                if (next.Autenticado)
                {
                  this.LoginMsg = "";
                  '';//'this.router.navigate(['/']);
                }                    
                else {
                    this.Usuario = "";
                    this.Senha = "";
                }
            }, error => {
              this.LoginMsg = "Erro ao efetuar login";
              this.isDanger = true;
                //console.log("Erro ao efetuar login");
            });
  }
}
