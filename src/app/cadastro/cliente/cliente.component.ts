import { Component, OnInit } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { tipoMensagem } from '../../common/enum/tipo-mensagem';
import { Erro } from '../../common/model/erro-model';
import { ClienteModel } from './cliente.model';
import { ClienteService } from './cliente.service';
import { CorteClienteModel } from './cortecliente.model';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})

export class ClienteComponent implements OnInit {

  msgs: Message[] = [];
  msgserro: Message[] = [];
  titulo: string;
  erro = new Erro();
  detalheErro: boolean = false;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  model = new ClienteModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  exibirGridItens: any = true;
  modelItem = new CorteClienteModel();
  itensGridVo: any[];
  idItens = 0;
  itensVo: any[];
  colunasItens: any[];
  isEdicaoItem: boolean = false;

  constructor(private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: ClienteService
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
    });

    this.colunas = [
      { field: 'id', header: 'Código', width: "10%" },
      { field: 'nome', header: 'Nome', width: "50%" },
      { field: 'telefone', header: 'Telefone', width: "20%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "20%" },
    ];

    this.colunasItens = [
      { field: 'descrição', header: 'Descrição', width: "50%" },
      { field: 'tipo', header: 'Tipo', width: "50%" },
    ];
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
    this.exibirGridItens = true;
    this.model.itensVo = this.itensGridVo;
    this.service.salvarDados(this.model).subscribe(res => {
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

  adicionarItens() {
    this.isEdicaoItem = false;
    let retorno = this.itensGridVo;   
    this.model.idMaxItem = this.model.idMaxItem + 1;
    this.idItens = this.model.idMaxItem;
    this.modelItem.id = this.idItens;

    if (retorno == undefined) {
      retorno = [];
    }

    retorno.push(
      {

        id: this.idItens,
        descricao: this.modelItem.descricao,
        tipo: this.modelItem.tipo,

      }
    );

    this.itensGridVo = retorno;
  }

  limparCamposItem() {
    this.modelItem.descricao = null;
    this.modelItem.tipo = null;
  }

  btnSalvarDadosItens() {
    this.exibirCarregando = true;
    let index = this.itensGridVo.findIndex(x => x['id'] === this.idItens);

    this.itensGridVo[index].descricao = this.modelItem.descricao;
    this.itensGridVo[index].tipo = this.modelItem.tipo;

    this.exibirGridItens = true;
    this.exibirCarregando = false;

    this.limparCamposItem();
  }

  btnNovoDados() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("nome");
    this.itensGridVo = null;
  }

  btnAdicionar() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridItens = false;

    this.adicionarItens();
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.exibirGridItens = true;
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  btnVoltarItem() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridItens = true;

    if (!this.isEdicaoItem) {
      this.btnRemoverItem(this.idItens);
    }
  }

  limparDadosEdicao() {
    this.model = new ClienteModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;

      this.model = registro;
      this.itensGridVo = registro.itensVo;

      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
    }
  }

  btnAlterarDadosItens(registro) {
      this.exibirGridItens = false;
      this.isEdicaoItem = true;
      this.idItens = registro.id;

      let index = null;
      index = this.itensGridVo.findIndex(x => x['id'] === this.idItens);
      let retorno = this.itensGridVo[index];
  
      this.modelItem.id = retorno.id;
      this.modelItem.descricao = retorno.descricao;
      this.modelItem.tipo = retorno.tipo;
  }

  btnRemoverItem(registro) {
    let index = null;
    index = this.itensGridVo.findIndex(x => x['id'] === registro.id);
    this.itensGridVo.splice(index, 1);
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

  btnGridCSVItens() {
    this.exibirCarregando = true;

    this.service.imprimirRelatorioItens(this.model.id).subscribe(res => {
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