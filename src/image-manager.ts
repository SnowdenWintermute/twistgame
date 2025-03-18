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
    const loadedImages: Record<string, HTMLImageElement> = {};
    this.imageProgressMap = {}; // Reset progress tracking

    // Initialize progress for all images
    for (const url of urls) {
      this.imageProgressMap[url] = { loaded: 0, total: 0 };
    }

    const imagePromises = urls.map(async (url) => {
      if (this.cachedImages[url]) {
        loadedImages[url] = this.cachedImages[url];
        return;
      }

      const response = await fetch(url);
      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

      let loadedBytes = 0;
      this.imageProgressMap[url] = { loaded: 0, total: totalBytes };

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loadedBytes += value.length;
          this.imageProgressMap[url].loaded = loadedBytes;

          // Update total progress
          const totalProgress = this.computeTotalProgress();
          onProgress?.(totalProgress);
        }
      }

      // Convert chunks to an SVG Blob
      const svgBlob = new Blob(chunks, { type: "image/svg+xml;charset=utf-8" });
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

      // Update total progress after loading image
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

    console.log("progresS: ", totalProgress);

    return totalProgress;
  }
}
