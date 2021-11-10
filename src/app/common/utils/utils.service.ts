import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/pt-br';

export var URL_API: '';

@Injectable()
export class UtilsService {

    pt: any;
    constructor(private http: HttpClient, private messageService: MessageService, private router?: Router) {
        this.pt = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
                'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Limpar'
        };
    }

    buscarUrl(): Observable<any> {
        this.http.get<any>(this.getEnvironment()).subscribe(res => {
            let retorno: any;
            retorno = res;
            return URL_API = retorno.urlServices;
        });
        return this.http.get<any>('assets/barbershopclickconfig.json');
    }

    getEnvironment() {
        return "assets/barbershopclickconfig.json";
    }

    exibirMensagemSobreposicao(tipo: string, titulo: string, mensagem: string) {
        this.messageService.add({severity: tipo, summary: titulo, detail: mensagem});
    }


    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    saveByteArray(reportName, byte) {
        var blob = new Blob([byte]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
    }

    /**
     * Verifica se o conteúdo passado como parâmetro é null, empty ou undefined
     * @param conteudo 
     */
    isNullEmptyUndefined(conteudo: string) {
        if (conteudo == undefined) {
            return true;
        }
        if (typeof conteudo == "string" && (conteudo.trim() == null || conteudo.trim() == "")) {
            return true;
        }
        return false;
    }

    focusComponent(id) {
        setTimeout(function () { $(`#${id}`).focus(); }, 50);
        setTimeout(function () { $(`input[name=${id}]`).focus(); }, 50);
    }

    //FortmataMoedaFloatParaString  
    fortmataMoedaFloatParaString(numero) {

        if ($.type(numero) == "string") {
            return numero;
        }
        if (numero !== "" && numero != undefined && numero != null) {

            var numero = numero.toFixed(2).split('.');
            numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
            return numero.join(',');
        }

        return "";
    }

    //FortmataMoedaStringParaString  
    FortmataMoedaStringParaString(valor) {

        if (valor === "" || valor == undefined || valor == null) {
            valor = null;
        } else {

            valor = valor.replace(",", "")
            while (valor.toString().indexOf(".") >= 0) {
                valor = valor.replace(".", "")
            }

            valor = (parseInt(valor.replace(/\.,/g, '')) / 100)
            valor = this.number_format(parseFloat(valor.toString()), 2, ",", ".");

            // if (valor == "0,00") { return null; }
        }
        return valor;
    }


    number_format(number, decimals, dec_point, thousands_sep) {
        var n = number, prec = decimals;

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return (Math.round(n * k) / k).toString();
        };

        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

        var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

        var abs = toFixedFix(Math.abs(n), prec);
        var _, i;

        if (parseInt(abs) >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0, i + (n < 0)) + _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
            s = _.join(dec);
        }
        else {
            s = s.replace('.', dec);
        }

        var decPos = s.indexOf(dec);

        if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
            s += new Array(prec - (s.length - decPos - 1)).join("0") + '0';
        }
        else if (prec >= 1 && decPos === -1) {
            s += dec + new Array(prec).join("0") + '0';
        }

        return s;
    }

    formatarDecimalParaCalculo(valor) {

        if (valor === "" || valor == undefined || valor == null) {
            return null;
        } else {

            if ($.type(valor) == "string") {
                valor = valor.replace(".", "#").replace(",", "+").replace("+", ".").replace("#", "");
            }
            valor = parseFloat(valor);
        }
        return valor
    }

    convertToStringForDate(data, mascara) {

        if (!(data instanceof Date)) {

            if (data === "" || data == undefined || data == null) {
                return null;
            } else {
                if (typeof data != "string") {
                    data = moment(data).format(mascara);
                } else {

                    if (mascara == "MM/YYYY") {
                        data = new Date(("01/" + data).split('/').reverse().join('/'));
                    } else if (mascara == "DD/MM/YYYY") {
                        data = new Date(data);
                    }
                }
            }
        }
        return data
    }
}