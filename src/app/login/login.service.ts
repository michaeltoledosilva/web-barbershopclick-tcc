import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilsService, URL_API } from '../common/utils/utils.service';

@Injectable()
 export  class LoginService{
    
    constructor(private http?: HttpClient, private util?: UtilsService){

    }

    sessaoLogada()
    {         
        let usuarioLogado = localStorage.getItem('usuario-login');        
        return usuarioLogado != undefined && usuarioLogado != null;
    }

    nomeUsuario(){
        let usuario = localStorage.getItem('usuario-nome');
        return (usuario != undefined && usuario != null) ? usuario : ""; ;
    }
    
    finalizarSessao(){
        localStorage.removeItem('usuario-login');
        window.location.href = "/" ;
    }

    defineLocalStorare(resposta: any){
        localStorage.setItem('usuario-login', resposta.login); 
        localStorage.setItem('usuario-nome', resposta.nome);    

        localStorage.setItem('usuario-id', resposta.id);    

        localStorage.setItem('usuario-idPerfil', resposta.idPerfil);  
        localStorage.setItem('usuario-acessaAgenda', resposta.acessaAgenda);  
        localStorage.setItem('usuario-acessaAtendimento', resposta.acessaAtendimento);  
        localStorage.setItem('usuario-acessaCargos', resposta.acessaCargos);  
        localStorage.setItem('usuario-acessaClientes', resposta.acessaClientes);  
        localStorage.setItem('usuario-acessaFuncionarios', resposta.acessaFuncionarios);  
        localStorage.setItem('usuario-acessaPerfil', resposta.acessaPerfil);  
        localStorage.setItem('usuario-acessaProdutos', resposta.acessaProdutos);  
        localStorage.setItem('usuario-acessaUsuarios', resposta.acessaUsuarios); 

    }
     
    autententicar(nome, usuario, senha, isGoogle): Observable<any> {
        const params = new HttpParams()
        .set('nome', nome)
        .set('usuario', usuario)
        .set('senha', senha)
        .set('isGoogle', isGoogle);
        return this.http.get(`${URL_API}usuario/loginValidation`, { params: params }); 
    } 

}