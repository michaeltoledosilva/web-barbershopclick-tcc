import { HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';
import { PerfilModel } from "../perfil/perfil.model";

@Injectable()
export class UsuarioService {
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
    
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarPerfis(): Observable<PerfilModel> {
        return this.http.get<PerfilModel>(`${URL_API}perfil/findByFilters`);
    }

    listarDados(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}usuario/findByFilters`, { params: params });       
    }

    salvarDados(model) {
        return this.http.post(`${URL_API}usuario/save`, model);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}usuario/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idUsuario): Observable<any> {
        return this.http.put(`${URL_API}usuario/disableOrEnableById/${idUsuario}`, null);
    }

}