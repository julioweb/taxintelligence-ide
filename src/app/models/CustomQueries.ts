export class CustomQueryModelList {
    public Total: number;
    public Data: Array<CustomQueryModel>
}

export class CustomQueryModel {
    public ID:string;
    public Name: string;
    public Desc: string;
    public TotParams: number;
    public Active:boolean;
    public StrQuery: string;
}