import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { CargoComponent } from './cadastro/cargo/cargo.component';
import { ClienteComponent } from './cadastro/cliente/cliente.component';
import { FuncionarioComponent } from './cadastro/funcionario/funcionario.component';
import { PerfilComponent } from './cadastro/perfil/perfil.component';
import { ProdutoComponent } from './cadastro/produto/produto.component';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { LoginComponent } from './login/login.component';
import { RelatorioAtendimentoComponent } from './relatorios/relatorio-atendimento/relatorio-atendimento.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'relatorio-atendimento', component: RelatorioAtendimentoComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'atendimento', component: AtendimentoComponent },
  { path: 'cargo', component: CargoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'produto', component: ProdutoComponent },
  { path: 'usuario', component: UsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
