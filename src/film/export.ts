/**
 * Renders a film to a video file in the browser, one exact frame at a time
 * (no screen recording, so no dropped frames), using WebCodecs through
 * Mediabunny. H.264 MP4 where the browser can encode it, VP9 WebM otherwise.
 */

export interface VideoOptions {
  width: number;
  height: number;
  fps: number;
  from?: number;
  to?: number;
  onProgress?: (frame: number, total: number) => void;
  signal?: AbortSignal;
}

export interface VideoResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
  codec: string;
  frames: number;
}

export function canRenderVideo(): boolean {
  return typeof VideoEncoder !== 'undefined';
}

export async function renderVideo(duration: number, draw: (ctx: CanvasRenderingContext2D, T: number) => void, o: VideoOptions): Promise<VideoResult> {
  if (!canRenderVideo()) throw new Error('This browser cannot encode video. Try a recent Chrome, Edge or Safari.');
  // The encoder library loads only when a video is made, keeping the page light.
  const { BufferTarget, CanvasSource, Mp4OutputFormat, Output, QUALITY_VERY_HIGH, WebMOutputFormat, getFirstEncodableVideoCodec } = await import('mediabunny');
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = o.width;
  canvas.height = o.height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas is not available.');
  const codec = await getFirstEncodableVideoCodec(['avc', 'vp9', 'av1', 'vp8'], {
    width: o.width,
    height: o.height,
    quality: QUALITY_VERY_HIGH,
    frameRate: o.fps,
  });
  if (!codec) throw new Error('No video encoder is available in this browser.');
  const mp4 = codec === 'avc';
  const output = new Output({
    format: mp4 ? new Mp4OutputFormat({ fastStart: 'in-memory' }) : new WebMOutputFormat(),
    target: new BufferTarget(),
  });
  const source = new CanvasSource(canvas, { codec, quality: QUALITY_VERY_HIGH, keyFrameInterval: 2 });
  output.addVideoTrack(source, { frameRate: o.fps });
  await output.start();
  const from = o.from ?? 0;
  const to = Math.min(o.to ?? duration, duration);
  const total = Math.max(1, Math.round((to - from) * o.fps));
  for (let i = 0; i < total; i++) {
    if (o.signal?.aborted) {
      await output.cancel();
      throw new DOMException('Export cancelled', 'AbortError');
    }
    draw(ctx, from + i / o.fps);
    await source.add(i / o.fps, 1 / o.fps);
    o.onProgress?.(i + 1, total);
    if (i % 8 === 7) await new Promise((r) => setTimeout(r, 0));
  }
  await output.finalize();
  const buffer = output.target.buffer;
  if (!buffer) throw new Error('The video could not be written.');
  return { blob: new Blob([buffer], { type: mp4 ? 'video/mp4' : 'video/webm' }), extension: mp4 ? 'mp4' : 'webm', codec, frames: total };
}

/** Saves a file. (Embedded previews may block downloads; the app works fully when run locally.) */
export function download(data: Blob | string, name: string, type = 'text/plain') {
  const blob = typeof data === 'string' ? new Blob([data], { type: `${type};charset=utf-8` }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
