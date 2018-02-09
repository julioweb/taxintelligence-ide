export class NodeType{
    public ID:string;
    public Name:string;
}

export class NodeItem{
    public Id:string;
    public Name:string;
    public Label: string;
    public xPath: string;
    public Type: string;
    public TypeDesc: string;
    public isNew:boolean;
    public isEdited:boolean;
    public isDeleted:boolean;
}