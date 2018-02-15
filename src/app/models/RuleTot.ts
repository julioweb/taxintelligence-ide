export class RuleTotList {
    public Total: number;
    public Data: Array<RuleTot>
}

export class RuleTot {
    public TIR_ID: string
    public Description: string;
    public Summary: string;
    public Total: number;
}

export class RuleModelList {
    public Total: number;
    public Data: Array<RuleModel>
}

export class RuleModel {
    public RuleID: string;
    public DetailId: string;
    public OperationId: string;
    public OperationDesc: string;
    public TypeId: string;
    public TypeDesc: string;
    public RuleDescription: string;
    public SubID: string;
    public Status: number;
    public CreationDate: Date;
    public CreationUser: string;
    public Summary: string;
    public Detail:RuleDetailModel;    
    public DocId: string;
    public VersionId: string;
}

export class RuleDetailModel {
    public ID: string;
    public ValidationMsg: string;
    public ConditionType: number;
    public LevelType: number;
    public InitValidity: string;// Date;
    public EndValiditiy: string;// Date;
    public PluginID: string;
    public TransformRule:Array<RuleDetailData>;
    public ValidationRule:Array<RuleDetailData>;
}

export class RuleDetailData {
    public ID: string;
    public NodeID: string;
    public NodeDesc: string;
    public Condition: string;
    public ConditionDesc: string;
    public Type: number;
    public Value: string;
    public Relation: string;
    public RelationDesc: string;
    public DetailID: string;
    public isNew:boolean;
    public isDeleted:boolean;
    public isEdited:boolean;
    public Order:number;
}

export class GroupRuleModelList {
    public Total: number;
    public Data: Array<GroupRuleModel>
}

export class GroupRuleModel {
    public ID: string;
    public DocID: string;
    public DocVersionId: string;
    public DocVersion: string;
    public Name: string;
    public Description: string;
    public Status: number;
    public SubId: string;
    public CreationDate: Date;
    public CreationUser: string;
    public CNPJ: string;
    public Order: number;
    public RelacRules: Array<string>;
}

export class RuleType {
    public ID: string;
    public Name: string;
    public Description: string;
}

export class OperationType {
    public ID: string;
    public TotName: string;
    public TotDescription: string;
}

export class RulePlugin{
    public ID:string;
    public Name:string;
    public Description:string;
    public SubId:string;
}

export class RuleProcessList {
    public Total: number;
    public Data: Array<RuleProcess>
}

export class RuleProcess{
    public ID:string;
    public ProcessID:string;
    public RuleID:string;
    public RuleDesc:string;
    public RuleType:string;
    public Status:number;
    public StatusDesc:string;
    public InitDate:string;
    public EndDate:string;
    public Message:string;
    public Order:number;
    public StartValue:string;
    public EndValue:string;
    public NodeName:string;
}