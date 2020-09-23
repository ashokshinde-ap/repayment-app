import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'roundTheNumber' })
export class RoundTheNumber implements PipeTransform {
    transform(input: number) {
        return Math.round(input);
    }
}