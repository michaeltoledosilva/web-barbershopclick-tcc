export class AgendaModel {

    id: number;
    dataAgenda: String;
    horaAgenda: String;
    codigoHora: number;
    tipo: number = 1;
    idCliente: number;
    idUsuarioCadastro: number;
    idUsuarioAgendado: number;
    cliente: String;
    usuarioCadastro: String;
    usuarioAgendado: String;

 }