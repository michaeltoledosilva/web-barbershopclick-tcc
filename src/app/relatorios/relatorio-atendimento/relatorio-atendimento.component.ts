import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js'
import { UtilsService } from 'src/app/common/utils/utils.service';
import { RelatorioAtendimentoService } from './relatorio-atendimento.service';

Chart.register(...registerables);

@Component({
  selector: 'app-relatorio-atendimento',
  templateUrl: './relatorio-atendimento.component.html',
  styleUrls: ['./relatorio-atendimento.component.css']
})
export class RelatorioAtendimentoComponent {
  
  constructor(public util: UtilsService, public service: RelatorioAtendimentoService) { }

  ngOnInit(){

    this.util.buscarUrl().subscribe(res => {
      this.carregarDadosRelatorioProdutosVendidos();      
      this.carregarDadosRelatorioValoresProdutos(); 
      this.carregarDadosRelatorioAtendimentosClientes(); 
      this.carregarDadosRelatorioValoresClientes(); 
      this.carregarDadosRelatorioAtendimentosFuncionarios(); 
      this.carregarDadosRelatorioValoresFuncionarios();
    });
  }

  carregarDadosRelatorioProdutosVendidos() {
    this.service.listarDadosProdutosVendidos().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataProdutosVendidos = [{data: retorno.quantidade, label: 'Vendas por Produtos', backgroundColor: "#2196f3", borderColor: '#2196f3'}];
      this.labelsProdutosVendidos = retorno.descricao;
    });
  }

  carregarDadosRelatorioValoresProdutos() {
    this.service.listarDadosValoresProdutos().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataValoresProdutos = [{data: retorno.valor, label: 'Receitas por Produto', backgroundColor: "green", borderColor: 'green'}];
      this.labelsValoresProdutos = retorno.descricao;
    });
  }

  carregarDadosRelatorioAtendimentosClientes() {
    this.service.listarDadosAtendimentosClientes().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataAtendimentosClientes = [{data: retorno.quantidade, label: 'Atendimentos por Cliente', backgroundColor: "#2196f3", borderColor: '#2196f3'}];
      this.labelsAtendimentosClientes = retorno.descricao;
    });
  }

  carregarDadosRelatorioValoresClientes() {
    this.service.listarDadosValoresClientes().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataValoresClientes = [{data: retorno.valor, label: 'Receitas por Cliente', backgroundColor: "green", borderColor: 'green'}];
      this.labelsValoresClientes = retorno.descricao;
    });
  }

  carregarDadosRelatorioAtendimentosFuncionarios() {
    this.service.listarDadosAtendimentosFuncionarios().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataAtendimentosFuncionarios = [{data: retorno.quantidade, label: 'Atendimentos por Funcionário', backgroundColor: "#2196f3", borderColor: '#2196f3'}];
      this.labelsAtendimentosFuncionarios = retorno.descricao;
    });
  }

  carregarDadosRelatorioValoresFuncionarios() {
    this.service.listarDadosValoresFuncionarios().subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataValoresFuncionarios = [{data: retorno.valor, label: 'Receitas por Funcionário', backgroundColor: "green", borderColor: 'green'}];
      this.labelsValoresFuncionarios = retorno.descricao;
    });
  }

  public dataProdutosVendidos: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsProdutosVendidos: string[] = [];

  public dataValoresProdutos: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsValoresProdutos: string[] = [];

  public dataAtendimentosClientes: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsAtendimentosClientes: string[] = [];

  public dataValoresClientes: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsValoresClientes: string[] = [];

  public dataAtendimentosFuncionarios: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsAtendimentosFuncionarios: string[] = [];

  public dataValoresFuncionarios: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"},
  ];
  public labelsValoresFuncionarios: string[] = [];

  public options: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}