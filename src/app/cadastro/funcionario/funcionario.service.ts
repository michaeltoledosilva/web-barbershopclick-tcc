import { HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';
import { CargoModel } from "../cargo/cargo.model";
import { UsuarioModel } from "../usuario/usuario.model";

@Injectable()
export class FuncionarioService {
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
    
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDados(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}funcionario/findByFilters`, { params: params });       
    }

    salvarDados(model) {
        return this.http.post(`${URL_API}funcionario/save`, model);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}funcionario/generateCsv`, { params: params });       
    }

    ativarRemoverDados(id): Observable<any> {
        return this.http.put(`${URL_API}funcionario/disableOrEnableById/${id}`, null);
    }

    listarCargos(): Observable<CargoModel> {
        return this.http.get<CargoModel>(`${URL_API}cargo/findByFilters`);
    }

    listarUsuarios(): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${URL_API}usuario/findByFilters`);
    }

}