export function fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (ev: ProgressEvent<FileReader>) => resolve(ev.target.result);
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
}
