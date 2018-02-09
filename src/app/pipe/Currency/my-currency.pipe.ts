import { Pipe, PipeTransform } from '@angular/core';

const PADDING = "000000";

@Pipe({
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {

  private DECIMAL_SEPARATOR_ORIGEM: string;


  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor() {
      this.DECIMAL_SEPARATOR_ORIGEM = ".";
      // TODO comes from configuration settings
      this.DECIMAL_SEPARATOR = ",";
      this.THOUSANDS_SEPARATOR = ".";
  }

  transform(value: number | string, fractionSize: number = 2): string {
      let [integer, fraction = ""] = (value || "").toString()
          .split(this.DECIMAL_SEPARATOR_ORIGEM);

      if (integer == "")
          return "0" + this.DECIMAL_SEPARATOR + "00";


      fraction = fractionSize > 0
          ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
          : "";

      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

      return "R$ "+integer + fraction;
  }

  parse(value: string, fractionSize: number = 2): string {
      let [integer, fraction = ""] = (value || "").split(this.DECIMAL_SEPARATOR);

      integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");

      fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
          ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
          : "";

      return integer + fraction;
  }

}
