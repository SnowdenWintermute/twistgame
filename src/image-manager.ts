interface ImageProgress {
  loaded: number;
  total: number;
}

export class ImageManager {
  cachedImages: Record<string, HTMLImageElement> = {};
  imageProgressMap: Record<string, ImageProgress> = {};

  constructor() {}

  async loadImages(
    urls: string[],
    onComplete: (loadedImages: Record<string, HTMLImageElement>) => void,
    onProgress?: (progress: number) => void
  ) {
    console.log("started load images");
    const loadedImages: Record<string, HTMLImageElement> = {};

    for (const url of urls) {
      if (this.cachedImages[url]) continue;
      this.imageProgressMap[url] = { loaded: 0, total: 0 };
    }

    const imagePromises = urls
      .filter((url) => this.cachedImages[url] === undefined)
      .map(async (url) => {
        const response = await fetch(url);
        const contentLength = response.headers.get("Content-Length");
        const totalBytes = contentLength
          ? parseInt(contentLength, 10)
          : undefined; // content length header might not have been sent
        if (totalBytes === undefined) console.log("no content length");

        let loadedBytes = 0;
        this.imageProgressMap[url] = { loaded: 0, total: totalBytes ?? 1 }; // Avoid division by 0

        const reader = response.body?.getReader();
        const chunks: Uint8Array[] = [];

        // checking if loaded bytes goes above total bytes to see if server is compressing
        // console.log(`Loading ${url}: ${loadedBytes} / ${totalBytes}`);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            loadedBytes += value.length;
            this.imageProgressMap[url].loaded = loadedBytes;

            const totalProgress = this.computeTotalProgress();
            onProgress?.(totalProgress);
            // await sleep(100);
          }
        }

        const svgBlob = new Blob(chunks, {
          type: "image/svg+xml;charset=utf-8",
        });
        const blobUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.src = blobUrl;

        await new Promise<void>((resolve) => {
          img.onload = () => {
            loadedImages[url] = img;
            this.cachedImages[url] = img;
            URL.revokeObjectURL(blobUrl);
            resolve();
          };
        });

        const totalProgress = this.computeTotalProgress();
        onProgress?.(totalProgress);
      });

    await Promise.all(imagePromises);
    onComplete(loadedImages);
  }

  private computeTotalProgress(): number {
    let totalLoaded = 0;
    let totalSize = 0;

    for (const { loaded, total } of Object.values(this.imageProgressMap)) {
      totalLoaded += loaded;
      totalSize += total;
    }

    const totalProgress = totalSize > 0 ? totalLoaded / totalSize : 1;

    return totalProgress;
  }
}
