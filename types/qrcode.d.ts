declare module 'qrcode' {
  interface QRCodeOptions {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    type?: 'svg' | 'utf8' | 'terminal' | 'image/png' | 'image/jpeg' | 'image/webp'
    [key: string]: any
  }

  export function toCanvas(
    canvas: HTMLCanvasElement | null,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>

  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>

  export function toString(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>
}
