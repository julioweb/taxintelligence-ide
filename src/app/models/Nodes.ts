export class NodeType{
    public ID:string;
    public Name:string;
}

export class NodeItem{
    public ID:string;
    public Name:string;
    public Label: string;
    public Xpath: string;
    public TypeId: string;
    public TypeDesc: string;
    public isNew:boolean;
    public isEdited:boolean;
    public isDeleted:boolean;
    public RelNodId:string;
    public RelNodDesc:string;
    public NodParentId:string;
    public NodParentName:string;
}