import { HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable()
export class CargoService {
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

        return this.http.get(`${URL_API}cargo/findByFilters`, { params: params });       
    }

    salvarDados(model) {
        return this.http.post(`${URL_API}cargo/save`, model);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${URL_API}cargo/generateCsv`, { params: params });       
    }

    ativarRemoverDados(id): Observable<any> {
        return this.http.put(`${URL_API}cargo/disableOrEnableById/${id}`, null);
    }

}