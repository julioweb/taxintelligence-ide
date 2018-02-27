import { KeyValue } from "../models/KeyValue";

export interface IFiltrosTelaAprovacaoTO {
    Empresa: Array<KeyValue>;
    Filial: Array<KeyValue>;
    DataDaAprovacaoDe: Date;
    DataDaAprovacaoAte: Date;
    DocumentoId: string;
    Status: Array<KeyValue>;
    StatusDocumento: Array<KeyValue>;
    Aprovador: Array<KeyValue>;
    DataDeProcessamentoDe: Date;
    DataDeProcessamentoAte: Date;

    DocumentNumber: string;
    DocumentSeries: string;

    DataCompetenciaDe: Date;
    DataCompetenciaAte: Date;

    CNPJ: Array<KeyValue>;

    Rules: Array<string>;
    DocID:string;

    Clear();
}