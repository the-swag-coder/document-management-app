declare module 'pdf-poppler' {
  interface ConvertOptions {
    format?: string;
    out_dir?: string;
    out_prefix?: string;
    page?: number;
    scale?: number;
  }

  const pdf: {
    convert(input: string, options?: ConvertOptions): Promise<void>;
  };
  export default pdf;
} 