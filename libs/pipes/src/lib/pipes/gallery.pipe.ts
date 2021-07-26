import { Pipe, PipeTransform } from '@angular/core';
import { ImageItem } from 'ng-gallery';

@Pipe({
  name: 'gallery'
})
export class GalleryPipe implements PipeTransform {

  transform(value: any[]): ImageItem[] {
    return value.map(item => new ImageItem({...item, src: item.url, thumb: item.thumb}));
  }

}
