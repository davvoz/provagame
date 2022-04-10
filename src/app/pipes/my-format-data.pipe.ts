import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '@angular/router';

@Pipe({
  name: 'myFormatData'
})
export class MyFormatDataPipe implements PipeTransform {

  transform(arg: Data): Data {
    return new Date(arg['seconds']*1000);
  }

}
