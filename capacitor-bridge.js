import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

window.AndroidPdfBridge = {
  isNative() { return Capacitor.isNativePlatform(); },
  async sharePdf(blob, filename) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo leer el PDF'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    const base64 = String(dataUrl).split(',')[1];
    const saved = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
      recursive: true
    });
    const file = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
    await Share.share({
      title: 'PDF de Imprime a Medida',
      text: 'PDF listo para guardar o imprimir a tamaño real.',
      url: file.uri,
      dialogTitle: 'Guardar o imprimir PDF'
    });
    return saved;
  }
};
