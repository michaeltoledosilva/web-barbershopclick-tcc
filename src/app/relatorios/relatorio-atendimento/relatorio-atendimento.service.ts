import { HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable()
export class RelatorioAtendimentoService {

    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
    
    }

    listarDadosProdutosVendidos(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findProdutosVendidos`);       
    }

    listarDadosValoresProdutos(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findValoresProdutos`);       
    }

    listarDadosAtendimentosClientes(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findAtendimentosClientes`);       
    }

    listarDadosValoresClientes(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findValoresClientes`);       
    }

    listarDadosAtendimentosFuncionarios(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findAtendimentosFuncionarios`);       
    }

    listarDadosValoresFuncionarios(): Observable<any>{
        return this.http.get(`${URL_API}relatorio/findValoresFuncionarios`);       
    }
    
}