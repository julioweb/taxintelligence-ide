import { URLSearchParams, QueryEncoder } from "@angular/http";
import { UUID } from 'angular2-uuid';

export class ServiceUtils{
      
  ObjTOURLSearchParams(obj): URLSearchParams {
        let params = new URLSearchParams('', new QueryEncoder());
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var element = obj[key];
    
            params.append(key, element);
          }
        }
        return params;
  }

  ConvertStringToCNPJ(item:string)
  {
    var newstr = item.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
    return newstr
  }

  GetNewGuidId(){
    return UUID.UUID();
  }
}