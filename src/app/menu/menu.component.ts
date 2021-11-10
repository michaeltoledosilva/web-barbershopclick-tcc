import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  acessaAgenda: Boolean;
  acessaAtendimento: Boolean;
  acessaCargos: Boolean;
  acessaClientes: Boolean;
  acessaFuncionarios: Boolean;
  acessaPerfil: Boolean;
  acessaProdutos: Boolean;
  acessaUsuarios: Boolean;

  constructor(private router:Router, private titleService: Title) { 
    this.acessaAgenda = localStorage.getItem('usuario-acessaAgenda') == '1';
    this.acessaAtendimento = localStorage.getItem('usuario-acessaAtendimento') == '1';
    this.acessaCargos = localStorage.getItem('usuario-acessaCargos') == '1';
    this.acessaClientes = localStorage.getItem('usuario-acessaClientes') == '1';
    this.acessaFuncionarios = localStorage.getItem('usuario-acessaFuncionarios') == '1';
    this.acessaPerfil = localStorage.getItem('usuario-acessaPerfil') == '1';
    this.acessaProdutos = localStorage.getItem('usuario-acessaProdutos') == '1';
    this.acessaUsuarios = localStorage.getItem('usuario-acessaUsuarios') == '1';
  }
 
  ngOnInit() {
    this.titleService.setTitle('BarberShop Click');
    //Inicia com o menu escondido
    $(".main-panel").css("width", "calc(100% - 0px)");
    $(".sidebar").css("left", "-260px");
  }
}
