import { HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClienteModel } from "../cadastro/cliente/cliente.model";
import { UsuarioModel } from "../cadastro/usuario/usuario.model";
import { ComboModel } from "../common/model/combo.model";

@Injectable()
export class AgendaService {
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
    
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDados(descricao, data): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('data', data);

        return this.http.get(`${URL_API}agenda/findByFilters`, { params: params });       
    }

    salvarDados(model) {
        return this.http.post(`${URL_API}agenda/save`, model);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}agenda/generateCsv`, { params: params });       
    }

    removerDados(id): Observable<any> {
        return this.http.delete(`${URL_API}agenda/delete/${id}`);
    }

    listarClientes(): Observable<ClienteModel> {
        return this.http.get<ClienteModel>(`${URL_API}cliente/findByFilters`);
    }

    listarUsuarios(): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${URL_API}usuario/findByFilters`);
    }

    listarHorarios(): Observable<ComboModel> {
        return this.http.get<ComboModel>(`${URL_API}agenda/findSchedules`);
    }
}