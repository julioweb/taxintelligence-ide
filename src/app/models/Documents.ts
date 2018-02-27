import { KeyValue } from "./KeyValue";
import { NodeItem } from "./Nodes";

export class DocBriefList{
    public Total:number;
    public Data: Array<DocBrief>;
}

export class DocBrief{
    public TIR_ID: string;
    public Description:string;
    public Summary:string;
    public Total:number;
    public ID:string
    public DocumentID:string;
    public DocumentNumber:number;
    public DocumentSeries:string;
    public CompetenceDate:Date;
    public DtFim:Date;
    public CNPJ:string;
    public Status:number;
    public StatusDesc:string;
    public TotalValue:number;
    public TotErrorRules:number;
}


export class DocProcessList{
    public Total:number;
    public Data: Array<DocProcess>;
}

export class DocProcess{
    public ID: string;
    public DocVersionID: string;
    public DocVersion: string;
    public OperationId: string;
    public OperationDesc: string;
    public DocumentID: string;
    public DocumentNumber: string;
    public DocumentSeries: string;
    public DocumentStatus: string;
    public CompetenceDate: string;
    public DtInit: string;
    public DtFim: string;
    public SubID: string;
    public CNPJ: string;
    public Status: string;
    public StatusDesc: string;
    public ApprovalUser: string;
    public ApprovalDate: string;
    public UrlXml: string;
    public UrlJson: string;
    public TotalValue: string;
    public CanEditDoc:boolean;
}

export class DocPrcEditData{
    public GroupID:string;
    public GrpName:string;
    public Nodes:Array<DocPrcEditNode>;
}

export class DocPrcEditNode{
    public NodeId:string;
    public NodeLabel:string;
    public Value:string;
}

export class DocumentList{
    public Total:number;
    public Data: Array<DocumentModel>;
}

export class DocumentModel{
    public ID: string;
    public Name: string;
    public Description:string;
    public Level:number;
    public CanEdit:boolean;
}

export class DocVersionList
{
    public Total:number;
    public Data: Array<DocVersionModel>;
}

export class VersionDocRelac{
    public docID:string;
    public versaoID: string;
}
export class DocVersionModel
{
    public ID: string;
    public DocID: string;
    public Name: string;
    public Desc:string;
    public Namespace:string;
    public Prefix:string;
    public isNew:boolean;
    public isEdited:boolean;
    public isDeleted: boolean;
    public SelNodes:Array<string>;
    public RelacItems: Array<KeyValue>;
    public DocRelac:VersionDocRelac;
}

export class DocPostObject{
    public Properties: DocumentModel;
    public NodeList:Array<NodeItem>;
    public VersionList: Array<DocVersionModel>;
}

