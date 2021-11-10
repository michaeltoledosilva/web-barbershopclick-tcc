import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { tipoMensagem } from '../common/enum/tipo-mensagem';
import { Erro } from '../common/model/erro-model';
import { AgendaModel } from './agenda.model';
import { AgendaService } from './agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})

export class AgendaComponent implements OnInit {

  msgs: Message[] = [];
  msgserro: Message[] = [];
  titulo: string;
  erro = new Erro();
  detalheErro: boolean = false;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  model = new AgendaModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  clientes: SelectItem[] = [];
  clienteSelecionado: number;

  usuarios: SelectItem[] = [];
  usuarioSelecionado: number;

  horarios: SelectItem[] = [];
  horaSelecionada: number;

  constructor(
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: AgendaService
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
      this.carregaComboClientes();
      this.carregaComboUsuarios();
      this.carregaComboHorarios();
    });

    this.colunas = [
      { field: 'id', header: 'Código', width: "10%" },
      { field: 'dataAgenda', header: 'Data/Hora Agenda', width: "30%" },
      { field: 'cliente', header: 'Cliente', width: "30%" },
      { field: 'usuarioAgendado', header: 'Funcionário', width: "30%" },
    ];
  }

  carregaComboClientes() {
    this.service.listarClientes().subscribe(res => {

      let retorno: any;
      retorno = res;
      for (let item of retorno) {

        this.clientes.push({ label: item.nome, value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  carregaComboUsuarios() {
    this.service.listarUsuarios().subscribe(res => {

      let retorno: any;
      retorno = res;
      for (let item of retorno) {

        this.usuarios.push({ label: item.nome, value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  carregaComboHorarios() {
    this.service.listarHorarios().subscribe(res => {

      let retorno: any;
      retorno = res;
      for (let item of retorno) {

        this.horarios.push({ label: (item.label), value: item.codigo });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  btnSalvarDados() {
    this.salvar();
  }

  salvar() {
    this.exibirCarregando = true;

    this.model.idCliente = this.clienteSelecionado;
    this.model.idUsuarioAgendado = this.usuarioSelecionado;
    this.model.codigoHora = this.horaSelecionada;
    this.model.idUsuarioCadastro = Number(localStorage.getItem('usuario-id'));
    this.service.salvarDados(this.model).subscribe(res => {

      let retorno: any;
      retorno = res;

      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Atenção", "Registros salvo com sucesso!");
      this.exibirCarregando = false;
      this.btnVoltarTelaPrincipal();
    }, err => {
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', err.error);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  btnNovoDados() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("dataAgenda");

    this.horaSelecionada = null;
    this.clienteSelecionado = null;
    this.usuarioSelecionado = null;
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  limparDadosEdicao() {
    this.model = new AgendaModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;

      this.model = registro;
      this.model.idCliente = registro.idCliente;
      this.model.idUsuarioAgendado = registro.idUsuarioAgendado;
      this.model.codigoHora = registro.codigoHora;
      this.clienteSelecionado = this.model.idCliente;
      this.usuarioSelecionado = this.model.idUsuarioAgendado;
      this.horaSelecionada = this.model.codigoHora;

      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
    }
  }

  btnRemoverDados(gridVo) {
    this.exibirCarregando = false;
    this.confirmationService.confirm({
      message: 'Deseja realmente remover esse registro?',
      header: 'Confirmação',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.removerDados(gridVo);
      },
      reject: () => {
      }
    });
  }

  removerDados(gridVo) {
    this.service.removerDados(gridVo.id).subscribe(res => {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Atenção", "Registro removido com sucesso!");
      this.carregarGridDados()
    }, err => {
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:
          let msg = err.error.split(':')[1];
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", msg);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  carregarGridDados() {
    this.service.listarDados(this.pesquisa.nomeFiltro, this.pesquisa.dataFiltro).subscribe(res => {

      let retorno: any;
      retorno = res;
      this.gridVo = retorno;
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnGridCSV() {
    this.exibirCarregando = true;

    this.service.imprimirRelatorio(this.pesquisa.nomeFiltro, this.pesquisa.dataFiltro).subscribe(res => {
      if (res != null) {
        let retorno: any = res;
        var sampleArr = this.util.base64ToArrayBuffer(retorno.arquivo);
        this.util.saveByteArray(retorno.nomeArquivo, sampleArr);
      }
      this.exibirCarregando = false;
    }, err => {
      this.msgs = [];
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:          
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', err.error);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
      
    });
  }

}
