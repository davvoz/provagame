import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '@angular/router';

@Pipe({
  name: 'myFormatDataString'
})
export class MyFormatDataPipeString implements PipeTransform {

  transform(arg: Data): string {
    const d = new Date(arg['seconds'] * 1000);
    return d.getDate() + '/' +
      (d.getMonth() + 1) + '/' +
      d.getFullYear() + ' ' +
      d.getHours() + ':' +
      d.getMinutes() + ':' +
      d.getSeconds();
  }

}
