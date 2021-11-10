import { Component, OnInit } from '@angular/core';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { tipoMensagem } from '../../common/enum/tipo-mensagem';
import { Erro } from '../../common/model/erro-model';
import { UsuarioModel } from './usuario.model';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {

  msgs: Message[] = [];
  msgserro: Message[] = [];
  titulo: string;
  erro = new Erro();
  detalheErro: boolean = false;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  model = new UsuarioModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  perfil: SelectItem[] = [];
  perfisSelecionadas: number;

  constructor(private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: UsuarioService
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      this.carregaComboPerfis();
      this.carregarGridDados();
    });

    this.colunas = [
      { field: 'id', header: 'Código', width: "5%" },
      { field: 'nome', header: 'Nome', width: "20%" },
      { field: 'login', header: 'Login', width: "20%" },
      { field: 'perfil', header: 'Perfil', width: "20%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "20%" },
    ];
  }

  carregaComboPerfis() {
    this.service.listarPerfis().subscribe(res => {

      let retorno: any;
      retorno = res;
      for (let item of retorno) {

        this.perfil.push({ label: item.nome, value: item.id });
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

    this.model.idPerfil = this.perfisSelecionadas;
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
    this.util.focusComponent("nome");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  limparDadosEdicao() {
    this.model = new UsuarioModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;

      this.model = registro;
      this.perfisSelecionadas = registro.idPerfil;

      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
    }
  }

  btnAtivarRemoverDados(gridVo) {
    this.exibirCarregando = false;
    let ativarRemover = this.util.isNullEmptyUndefined(gridVo.dataDesativacao) ? "desativar" : "ativar";
    this.confirmationService.confirm({
      message: 'Deseja realmente ' + ativarRemover + ' esse registro?',
      header: 'Confirmação',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.ativarRemoverDados(gridVo);
      },
      reject: () => {
      }
    });
  }

  ativarRemoverDados(gridVo) {
    let ativarRemover = this.util.isNullEmptyUndefined(gridVo.dataDesativacao) ? "desativado" : "ativado";
    this.service.ativarRemoverDados(gridVo.id).subscribe(res => {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Atenção", "Registro " + ativarRemover + " com sucesso!");
      this.carregarGridDados()
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

  carregarGridDados() {
    this.service.listarDados(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {

      let retorno: any;
      retorno = res;
      this.gridVo = retorno;
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnGridCSV() {
    this.exibirCarregando = true;

    this.service.imprimirRelatorio(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {
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