import { HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable()
export class ClienteService {
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

        return this.http.get(`${URL_API}cliente/findByFilters`, { params: params });       
    }

    salvarDados(model) {
        return this.http.post(`${URL_API}cliente/save`, model);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}cliente/generateCsv`, { params: params });       
    }

    ativarRemoverDados(id): Observable<any> {
        return this.http.put(`${URL_API}cliente/disableOrEnableById/${id}`, null);
    }

    imprimirRelatorioItens(idCliente): Observable<any> {

        const params = new HttpParams()
                    .set('idCliente', idCliente);

        return this.http.get(`${URL_API}corteCliente/generateCsv`, { params: params });     
    }

}