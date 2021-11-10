import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { ComponenteBasicoComponent } from './shared/componente-basico/componente-basico.component'
import { CarregandoComponent } from './shared/carregando/carregando.component';
import { PerfilComponent } from './cadastro/perfil/perfil.component';
import { ProdutoComponent } from './cadastro/produto/produto.component';
import { FuncionarioComponent } from './cadastro/funcionario/funcionario.component';
import { ClienteComponent } from './cadastro/cliente/cliente.component';
import { CargoComponent } from './cadastro/cargo/cargo.component';
import { AgendaComponent } from './agenda/agenda.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { LegendaComponent } from './shared/legenda/legenda.component';

//Services
import { LoginService } from './login/login.service';
import { RelatorioAtendimentoComponent } from './relatorios/relatorio-atendimento/relatorio-atendimento.component';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { UsuarioService } from './cadastro/usuario/usuario.service'
import { UtilsService } from './common/utils/utils.service';
import { HttpClientModule } from '@angular/common/http';
import { ValidacaoService } from './common/validacao/validacao.service';
import { PerfilService } from './cadastro/perfil/perfil.service';
import { ProdutoService } from './cadastro/produto/produto.service';
import { FuncionarioService } from './cadastro/funcionario/funcionario.service';
import { ClienteService } from './cadastro/cliente/cliente.service';
import { CargoService } from './cadastro/cargo/cargo.service'
import { AgendaService } from './agenda/agenda.service';
import { AtendimentoService } from './atendimento/atendimento.service';
import { RelatorioAtendimentoService } from './relatorios/relatorio-atendimento/relatorio-atendimento.service';

//Terceiros
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule }   from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule} from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    HeaderComponent,
    RelatorioAtendimentoComponent,
    UsuarioComponent,
    ComponenteBasicoComponent,
    CarregandoComponent,
    PerfilComponent,
    CargoComponent,
    FuncionarioComponent,
    AgendaComponent,
    AtendimentoComponent,
    ClienteComponent,
    ProdutoComponent,
    LegendaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,    
    ProgressSpinnerModule,
    ToastModule,
    NgChartsModule
  ],
  providers: [
    LoginService,
    UsuarioService,
    UtilsService,
    ValidacaoService,
    ConfirmationService,
    MessageService,
    PerfilService,
    ProdutoService,
    CargoService,
    FuncionarioService,
    AgendaService,
    AtendimentoService,
    ClienteService,
    RelatorioAtendimentoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
