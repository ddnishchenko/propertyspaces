export class Fullscreen {
  static getRequestFullscreen(): any {
      const elem = document.documentElement;
      const requestFullscreenMethodToBeInvoked =
          elem.requestFullscreen
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
    // @ts-ignore
    const active = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    return !!active;
  }

  static request(): Promise<any> {
      return Fullscreen.getRequestFullscreen()()
      .catch(err => console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
  }

  static exit(): Promise<any> {
      const exitFullscreenMethodToBeInvoked =
          document.exitFullscreen ||
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
