import { LocalStorage, SessionStorage, LocalStorageService } from 'ngx-webstorage';
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';

import { KeyValue } from "../../../models/KeyValue";
import { IFiltrosTelaAprovacaoTO } from "../../../Interfaces/IFiltrosTelaAprovacao";


export class FiltrosTelaAprovacaoTO implements IFiltrosTelaAprovacaoTO {

    public Empresa: Array<KeyValue>;
    public Filial: Array<KeyValue>;
    public DataDaAprovacaoDe: Date;
    public DataDaAprovacaoAte: Date;
    public DocumentoId: string;
    public Status: Array<KeyValue>;
    public StatusDocumento: Array<KeyValue>;
    public Aprovador: Array<KeyValue>;
    public DataDeProcessamentoDe: Date;
    public DataDeProcessamentoAte: Date;

    public DocumentNumber: string;
    public DocumentSeries: string;

    public DataCompetenciaDe: Date;
    public DataCompetenciaAte: Date;
    public CNPJ: Array<KeyValue>;
    public Rules: Array<string>;

    public DocID:string;

    public Clear() {
        throw new Error("Method not implemented.");
    }
}

export class FiltroAprocaoObj {
    public Empresa: Array<string>;
    public Filial: Array<string>;
    public DataDaAprovacaoDe: Date;
    public DataDaAprovacaoAte: Date;
    public DocumentoId: string;
    public Status: Array<number>;
    public StatusDocumento: Array<number>;
    public Aprovador: Array<string>;
    public DataDeProcessamentoDe: Date;
    public DataDeProcessamentoAte: Date;
    public DocumentNumber: string;
    public DocumentSeries: string;
    public DataCompetenciaDe: Date;
    public DataCompetenciaAte: Date;
    public CNPJ: Array<string>;
    public DocID: string;
}


@Injectable()
export class FiltrosTelaAprovacaoStorage implements IFiltrosTelaAprovacaoTO {
    constructor(
        private storage: LocalStorageService) {

        if (this.Rules == null)
            this.Rules = [];
    }

    @SessionStorage("FiltrosTelaAprovacaoStorage.Empresa")
    public Empresa: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.Filial")
    public Filial: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataDaAprovacaoDe")
    public DataDaAprovacaoDe: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataDaAprovacaoAte")
    public DataDaAprovacaoAte: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DocumentoId")
    public DocumentoId: string;

    @SessionStorage("FiltrosTelaAprovacaoStorage.Status")
    public Status: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.StatusDocumento")
    public StatusDocumento: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.Aprovador")
    public Aprovador: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataDeProcessamentoDe")
    public DataDeProcessamentoDe: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataDeProcessamentoAte")
    public DataDeProcessamentoAte: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DocumentNumber")
    public DocumentNumber: string;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DocumentSeries")
    public DocumentSeries: string;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataCompetenciaDe")
    public DataCompetenciaDe: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DataCompetenciaAte")
    public DataCompetenciaAte: Date;

    @SessionStorage("FiltrosTelaAprovacaoStorage.CNPJ")
    public CNPJ: Array<KeyValue>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.Rules")
    public Rules: Array<string>;

    @SessionStorage("FiltrosTelaAprovacaoStorage.DocID")
    public DocID:string;


    public Clear(): void {
        this.Empresa = null;
        this.Filial = null;
        this.DataDaAprovacaoDe = null;
        this.DataDaAprovacaoAte = null;
        this.DocumentoId = null;
        this.Status = null;
        this.StatusDocumento = null;
        this.Aprovador = null;
        this.DataDeProcessamentoDe = null;
        this.DataDeProcessamentoAte = null;
        this.DocumentNumber = null;
        this.DocumentSeries = null;
        this.DataCompetenciaDe = null;
        this.DataCompetenciaAte = null;
        this.Rules = [];
        this.CNPJ = null;
        this.DocID = null;
    }
}

export class FiltrosTelaAprovacaoTools {
    public static ToURLSearchParams(Filtros: IFiltrosTelaAprovacaoTO): URLSearchParams {

        let Parametros = new URLSearchParams('', new QueryEncoder());

        if (Filtros == null)
            return Parametros;

        if (Filtros.Empresa != null && Filtros.Empresa.length > 0)
            Parametros.append("Empresa", JSON.stringify(Filtros.Empresa.map(a => a.Key)));

        if (Filtros.Filial != null && Filtros.Filial.length > 0)
            Parametros.append("Filial", JSON.stringify(Filtros.Filial.map(a => a.Key)));

        if (Filtros.Aprovador != null && Filtros.Aprovador.length > 0)
            Parametros.append("Approval", JSON.stringify(Filtros.Aprovador.map(a => a.Key)));

        if (Filtros.DataDaAprovacaoDe != null)
            Parametros.append("Approval_Date_Ini", JSON.stringify(Filtros.DataDaAprovacaoDe));

        if (Filtros.DataDaAprovacaoAte != null)
            Parametros.append("Approval_Date_Fin", JSON.stringify(Filtros.DataDaAprovacaoAte));

        if (Filtros.DocumentoId != null && Filtros.DocumentoId != "")
            Parametros.append("DocumentID", JSON.stringify(Filtros.DocumentoId));

        if (Filtros.Status != null && Filtros.Status.length > 0)
            Parametros.append("Status", JSON.stringify(Filtros.Status.map(a => a.Key)));

        if (Filtros.StatusDocumento != null && Filtros.StatusDocumento.length > 0)
            Parametros.append("DocumentStatus", JSON.stringify(Filtros.StatusDocumento.map(a => a.Key)));

        if (Filtros.DataDeProcessamentoDe != null)
            Parametros.append("ProcessDateIni", JSON.stringify(Filtros.DataDeProcessamentoDe));

        if (Filtros.DataDeProcessamentoAte != null)
            Parametros.append("ProcessDateFin", JSON.stringify(Filtros.DataDeProcessamentoAte));

        if (Filtros.DocumentNumber != null && Filtros.DocumentNumber != "")
            Parametros.append("DocumentNumber", JSON.stringify(Filtros.DocumentNumber));

        if (Filtros.DocumentSeries != null && Filtros.DocumentSeries != "")
            Parametros.append("DocumentSeries", JSON.stringify(Filtros.DocumentSeries));

        if (Filtros.CNPJ != null && Filtros.CNPJ.length > 0)
            Parametros.append("CNPJ", JSON.stringify(Filtros.CNPJ.map(a => a.Key)));

        if (Filtros.DataCompetenciaDe != null)
            Parametros.append("CompetenceDateIni", JSON.stringify(Filtros.DataCompetenciaDe));

        if (Filtros.DataCompetenciaAte != null)
            Parametros.append("CompetenceDateEnd", JSON.stringify(Filtros.DataCompetenciaAte));

        if (Filtros.Rules != null && Filtros.Rules.length)
            Parametros.append("RulesId", JSON.stringify(Filtros.Rules));

        return Parametros;
    }

    GetFiltroObject(Filtro: IFiltrosTelaAprovacaoTO)
    {
        let result: FiltroAprocaoObj = new FiltroAprocaoObj();

        result.DataCompetenciaAte = Filtro.DataCompetenciaAte;
        result.DataCompetenciaDe = Filtro.DataCompetenciaDe;
        result.DataDaAprovacaoAte = Filtro.DataDaAprovacaoAte;
        result.DataDaAprovacaoDe = Filtro.DataDaAprovacaoDe;
        result.DataDeProcessamentoAte = Filtro.DataDeProcessamentoAte;
        result.DataDeProcessamentoDe = Filtro.DataDeProcessamentoDe;
        result.DocumentNumber = Filtro.DocumentNumber;
        result.DocumentoId = Filtro.DocumentoId;
        result.DocID = Filtro.DocID;
        result.DocumentSeries = Filtro.DocumentSeries;
        result.Aprovador = Filtro.Aprovador!= null ? Filtro.Aprovador.map(a => a.Key): new Array<string>();
        result.CNPJ = Filtro.CNPJ!= null ? Filtro.CNPJ.map(a => a.Key): new Array<string>();
        result.Empresa = Filtro.Empresa!= null ? Filtro.Empresa.map(a => a.Key): new Array<string>();;
        result.Filial = Filtro.Filial!= null ? Filtro.Filial.map(a => a.Key) : new Array<string>();
        result.Status = Filtro.Status!= null ? Filtro.Status.map(a => parseInt(a.Key)): new Array<number>();;
        result.StatusDocumento = Filtro.StatusDocumento!= null ? Filtro.StatusDocumento.map(a => parseInt(a.Key)): new Array<number>();;

        return result;
    }
}



@Injectable()
export class FiltrosTelaAprovacaoHabilitadoStorage {
    constructor(
        private storage: LocalStorageService) {

    }

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.Empresa")
    public Empresa: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.Filial")
    public Filial: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DataDaAprovacao")
    public DataDaAprovacao: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DocumentoId")
    public DocumentoId: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.Status")
    public Status: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.StatusDocumento")
    public StatusDocumento: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.Aprovador")
    public Aprovador: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DataDeProcessamento")
    public DataDeProcessamento: boolean;


    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DocumentNumber")
    public DocumentNumber: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DocumentSeries")
    public DocumentSeries: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.DataCompetencia", true)
    public DataCompetencia: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.CNPJ", true)
    public CNPJ: boolean;

    @LocalStorage("FiltrosTelaAprovacaoHabilitadoStorage.Rules")
    public Rules: boolean;

    static _Captions: Array<KeyValue> = [
        { Key: "Empresa", Value: "Empresa" },
        { Key: "Filial", Value: "Filial" },
        { Key: "DataDaAprovacao", Value: "Data de aprovação" },
        { Key: "DocumentoId", Value: "ID do Documento" },
        { Key: "Status", Value: "Status" },
        { Key: "StatusDocumento", Value: "Status do Documento" },
        { Key: "Aprovador", Value: "Aprovador" },
        { Key: "DataDeProcessamento", Value: "Data de Processamento" },
        { Key: "DocumentNumber", Value: "Número do Documento" },
        { Key: "DocumentSeries", Value: "Série do Documento" },
        { Key: "DataCompetencia", Value: "Data da Competencia" },
        { Key: "CNPJ", Value: "CNPJ" },
        { Key: "Rules", Value: "Valiações" },
    ];

    public get Captions(): Array<KeyValue> {
        return FiltrosTelaAprovacaoHabilitadoStorage._Captions;
    }

    public GetCaption(vName: string): string {
        return FiltrosTelaAprovacaoHabilitadoStorage._Captions.find(a => a.Key == vName).Value;
    }

    public SetValue(vName: string, Value: boolean): void {
        this[vName] = Value;
    }

    public GetValue(vName: string): boolean {
        return this[vName] as boolean;
    }

    public Toogle(vName: string): void {
        this[vName] = !this[vName];
    }


}