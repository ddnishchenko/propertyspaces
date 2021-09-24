import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

function isFullscreenActive() {
  // eslint-disable-next-line
  // @ts-ignore
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
}

export class Fullscreen {
  static change$ = fromEvent(document, 'fullscreenchange').pipe(
    startWith(isFullscreenActive()),
    map(() => Fullscreen.isActive)
  );
  static getRequestFullscreen(): boolean {
      const elem = document.documentElement;
      const requestFullscreenMethodToBeInvoked =
          elem.requestFullscreen
          // eslint-disable-next-line
          // @ts-ignore
          || elem.webkitRequestFullScreen
          || elem['mozRequestFullscreen']
          || elem['msRequestFullscreen'];
      return requestFullscreenMethodToBeInvoked
          ? requestFullscreenMethodToBeInvoked.bind(elem) : false;
  }

  static get isAvailable(): boolean {
      return !!Fullscreen.getRequestFullscreen();
  }

  static get isActive(): boolean {
    return !!isFullscreenActive();
  }

  static request(): Promise<void> {
      // @ts-ignore
      return Fullscreen.getRequestFullscreen()()
      .catch(err => console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
  }

  static exit(): Promise<void> {
      const exitFullscreenMethodToBeInvoked =
          document.exitFullscreen ||
          // eslint-disable-next-line
          // @ts-ignore
          document.webkitExitFullscreen ||
          document['mozExitFullscreen'] ||
          document['msExitFullscreen'];
      return exitFullscreenMethodToBeInvoked.call(document);
  }

  static toggle() {
    Fullscreen.isActive ? Fullscreen.exit() : Fullscreen.request();
  }

}
