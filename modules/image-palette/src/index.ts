import { requireNativeModule } from "expo-modules-core";

export interface Swatch {
  row: number;
  col: number;
  r: number;
  g: number;
  b: number;
  population: number;
}

export interface DominantColorsResult {
  gridWidth: number;
  gridHeight: number;
  swatches: Swatch[];
}

export interface PaletteConfig {
  bitsPerChannel: number;
  gridWidth: number;
  gridHeight: number;
  edgesOnly: boolean;
  downsample: boolean;
  downsampleTargetSize: number;
  cache: boolean;
}

interface ImagePaletteNativeModule {
  configure(options: Partial<PaletteConfig>): void;
  getDominantColors(uri: string): Promise<DominantColorsResult | null>;
}

const ImagePalette = requireNativeModule<ImagePaletteNativeModule>("ImagePalette");

export default ImagePalette;
