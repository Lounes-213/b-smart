export class ImageResponse extends Response {
  constructor(_element: any, _options?: any) {
    super("OG Image preview", {
      headers: { "content-type": "text/plain" },
    });
  }
}

export default { ImageResponse };
