import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { tipoMensagem } from '../common/enum/tipo-mensagem';
import { Erro } from '../common/model/erro-model';
import { LoginService } from '../login/login.service';
import { AtendimentoModel } from './atendimento.model';
import { AtendimentoService } from './atendimento.service';
import { ProdutoAtendimentoModel } from './produtoatendimento.model';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.css']
})

export class AtendimentoComponent implements OnInit {

  msgs: Message[] = [];
  msgserro: Message[] = [];
  titulo: string;
  erro = new Erro();
  detalheErro: boolean = false;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  model = new AtendimentoModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  exibirGridItens: any = true;
  modelItem = new ProdutoAtendimentoModel();
  itensGridVo: any[];
  idItens = 0;
  itensVo: any[];
  colunasItens: any[];
  isEdicaoItem: boolean = false;

  clientes: SelectItem[] = [];
  clienteSelecionado: number;

  usuarios: SelectItem[] = [];
  usuarioSelecionado: number;

  horarios: SelectItem[] = [];
  horaSelecionada: number;

  produtos: SelectItem[] = [];
  produtoSelecionado: number;

  constructor(private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: AtendimentoService
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
      this.carregaComboClientes();
      this.carregaComboUsuarios();
      this.carregaComboHorarios();
      this.carregaComboProdutos();
    });

    this.colunas = [
      { field: 'id', header: 'Código', width: "10%" },
      { field: 'descricao', header: 'Descrição', width: "20%" },
      { field: 'dataAtendimento', header: 'Data/Hora', width: "20%" },
      { field: 'cliente', header: 'Cliente', width: "20%" },
      { field: 'usuarioAgendado', header: 'Funcionário', width: "20%" },
      { field: 'valorTotal', header: 'Valor', width: "10%" },
    ];

    this.colunasItens = [
      { field: 'nome', header: 'Descrição', width: "100%" }
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

    this.model.idCliente = this.clienteSelecionado;
    this.model.idUsuarioAtendimento = this.usuarioSelecionado;
    this.model.codigoHora = this.horaSelecionada;
    this.model.idUsuarioLancamento = Number(localStorage.getItem('usuario-id'));
    this.model.itensVo = this.itensGridVo;
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

  adicionarItens() {
    this.isEdicaoItem = false;
    let retorno = this.itensGridVo;
    this.model.idMaxItem = this.model.idMaxItem == null ? 0 : this.model.idMaxItem;
    this.model.idMaxItem = this.model.idMaxItem + 1;
    this.idItens = this.model.idMaxItem;
    this.modelItem.id = this.idItens;

    if (retorno == undefined) {
      retorno = [];
    }

    retorno.push(
      {

        id: this.idItens,
        idProduto: this.produtos[0].value,
        produto: this.produtos[0].label

      }
    );

    this.itensGridVo = retorno;
    this.produtoSelecionado = null;
  }

  limparCamposItem() {
    this.modelItem.produto = null;
  }

  btnSalvarDadosItens() {
    this.exibirCarregando = true;
    let index = this.itensGridVo.findIndex(x => x['id'] === this.idItens);
    let indexProduto = this.produtos.findIndex(x => x['value'] === this.produtoSelecionado);

    this.itensGridVo[index].produto = this.produtos[indexProduto].label;
    this.itensGridVo[index].idProduto = this.produtos[indexProduto].value;

    this.exibirGridItens = true;
    this.exibirCarregando = false;

    this.limparCamposItem();
  }

  btnNovoDados() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("dataAtendimento");

    this.itensGridVo = null;
    this.horaSelecionada = null;
    this.clienteSelecionado = null;
    this.usuarioSelecionado = null;
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
    this.model = new AtendimentoModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;

      this.model = registro;
      this.itensGridVo = registro.itensVo;
      this.model.idCliente = registro.idCliente;
      this.model.idUsuarioAtendimento = registro.idUsuarioAtendimento;
      this.model.codigoHora = registro.codigoHora;
      this.clienteSelecionado = this.model.idCliente;
      this.usuarioSelecionado = this.model.idUsuarioAtendimento;
      this.horaSelecionada = this.model.codigoHora;

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
    this.modelItem.produto = retorno.produto;
    this.modelItem.idProduto = retorno.idProduto;
    this.produtoSelecionado = retorno.idProduto;
}

btnRemoverItem(registro) {
  let index = null;
  index = this.itensGridVo.findIndex(x => x['id'] === registro.id);
  this.itensGridVo.splice(index, 1);
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

        this.horarios.push({ label: item.label, value: item.codigo });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  carregaComboProdutos() {
    this.service.listarProdutos().subscribe(res => {

      let retorno: any;
      retorno = res;
      for (let item of retorno) {

        this.produtos.push({ label: item.nome, value: item.id });
      }
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