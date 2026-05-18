"use client";

import dynamic from "next/dynamic";
import { createElement } from "react";

function ToolLoading() {
  return createElement("div", {
    className:
      "min-h-[260px] rounded-[24px] border border-white/10 bg-slate-950/45"
  });
}

const toolComponents = {
  BmiCalculatorTool: dynamic(() => import("@/components/tools/bmi-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageCompressorTool: dynamic(() => import("@/components/tools/image-compressor-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorBetonuTool: dynamic(() => import("@/components/tools/kalkulator-betonu-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorStyropianuTool: dynamic(() => import("@/components/tools/kalkulator-styropianu-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  AgeCalculatorTool: dynamic(() => import("@/components/tools/age-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageResizerTool: dynamic(() => import("@/components/tools/image-resizer-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorDachuTool: dynamic(() => import("@/components/tools/kalkulator-dachu-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PercentageCalculatorTool: dynamic(() => import("@/components/tools/percentage-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  StorageConverterTool: dynamic(() => import("@/components/tools/storage-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorFarbyTool: dynamic(() => import("@/components/tools/kalkulator-farby-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  LoanPaymentCalculatorTool: dynamic(() => import("@/components/tools/loan-payment-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PasswordGeneratorTool: dynamic(() => import("@/components/tools/password-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  QrCodeGeneratorTool: dynamic(() => import("@/components/tools/qr-code-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  CelsiusToFahrenheitConverterTool: dynamic(() => import("@/components/tools/celsius-to-fahrenheit-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  DaysBetweenDatesCalculatorTool: dynamic(() => import("@/components/tools/days-between-dates-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  FahrenheitToCelsiusConverterTool: dynamic(() => import("@/components/tools/fahrenheit-to-celsius-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageCropperTool: dynamic(() => import("@/components/tools/image-cropper-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorPlytekTool: dynamic(() => import("@/components/tools/kalkulator-plytek-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  CompoundInterestCalculatorTool: dynamic(() => import("@/components/tools/compound-interest-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  DiscountCalculatorTool: dynamic(() => import("@/components/tools/discount-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  GradientGeneratorTool: dynamic(() => import("@/components/tools/gradient-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  IconMakerTool: dynamic(() => import("@/components/tools/icon-maker-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageFormatConverterTool: dynamic(() => import("@/components/tools/image-format-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorWylewkiTool: dynamic(() => import("@/components/tools/kalkulator-wylewki-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KmToMilesConverterTool: dynamic(() => import("@/components/tools/km-to-miles-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MilesToKmConverterTool: dynamic(() => import("@/components/tools/miles-to-km-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  WordCounterTool: dynamic(() => import("@/components/tools/word-counter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  BoxShadowGeneratorTool: dynamic(() => import("@/components/tools/box-shadow-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  CaseConverterTool: dynamic(() => import("@/components/tools/case-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  CmToInchesConverterTool: dynamic(() => import("@/components/tools/cm-to-inches-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  InchConverterTool: dynamic(() => import("@/components/tools/inch-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorFundamentowTool: dynamic(() => import("@/components/tools/kalkulator-fundamentow-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorOgrodzeniaTool: dynamic(() => import("@/components/tools/kalkulator-ogrodzenia-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  LbsToKgConverterTool: dynamic(() => import("@/components/tools/lbs-to-kg-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PercentageDecreaseCalculatorTool: dynamic(() => import("@/components/tools/percentage-decrease-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PercentageIncreaseCalculatorTool: dynamic(() => import("@/components/tools/percentage-increase-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  TipCalculatorTool: dynamic(() => import("@/components/tools/tip-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  CharacterCounterTool: dynamic(() => import("@/components/tools/character-counter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlFormatterTool: dynamic(() => import("@/components/tools/html-formatter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  InchesToCmConverterTool: dynamic(() => import("@/components/tools/inches-to-cm-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorKostkiBrukowejTool: dynamic(() => import("@/components/tools/kalkulator-kostki-brukowej-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MetaTagGeneratorTool: dynamic(() => import("@/components/tools/meta-tag-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  SlugGeneratorTool: dynamic(() => import("@/components/tools/slug-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  FaviconGeneratorTool: dynamic(() => import("@/components/tools/favicon-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlMinifierTool: dynamic(() => import("@/components/tools/html-minifier-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlValidatorTool: dynamic(() => import("@/components/tools/html-validator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  JsonValidatorTool: dynamic(() => import("@/components/tools/json-validator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorTynkuTool: dynamic(() => import("@/components/tools/kalkulator-tynku-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KeywordDensityCheckerTool: dynamic(() => import("@/components/tools/keyword-density-checker-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  SalesTaxCalculatorTool: dynamic(() => import("@/components/tools/sales-tax-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  FeetToMetersConverterTool: dynamic(() => import("@/components/tools/feet-to-meters-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HexToRgbConverterTool: dynamic(() => import("@/components/tools/hex-to-rgb-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlToTextTool: dynamic(() => import("@/components/tools/html-to-text-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageMetadataReaderTool: dynamic(() => import("@/components/tools/image-metadata-reader-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorKlejuDoPlytekTool: dynamic(() => import("@/components/tools/kalkulator-kleju-do-plytek-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KgToLbsTool: dynamic(() => import("@/components/tools/kg-to-lbs-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MetersToFeetConverterTool: dynamic(() => import("@/components/tools/meters-to-feet-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ColorPickerTool: dynamic(() => import("@/components/tools/color-picker-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  GallonsToLitersConverterTool: dynamic(() => import("@/components/tools/gallons-to-liters-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlToMarkdownTool: dynamic(() => import("@/components/tools/html-to-markdown-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlViewerTool: dynamic(() => import("@/components/tools/html-viewer-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  InchesToMmConverterTool: dynamic(() => import("@/components/tools/inches-to-mm-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  JsonFormatterTool: dynamic(() => import("@/components/tools/json-formatter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  JsonMinifierTool: dynamic(() => import("@/components/tools/json-minifier-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorPaneliPodlogowychTool: dynamic(() => import("@/components/tools/kalkulator-paneli-podlogowych-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorPlytGkTool: dynamic(() => import("@/components/tools/kalkulator-plyt-gk-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorWelnyMineralnejTool: dynamic(() => import("@/components/tools/kalkulator-welny-mineralnej-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorZbrojeniaTool: dynamic(() => import("@/components/tools/kalkulator-zbrojenia-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  LitersToGallonsConverterTool: dynamic(() => import("@/components/tools/liters-to-gallons-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MarkdownToHtmlTool: dynamic(() => import("@/components/tools/markdown-to-html-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MarkupCalculatorTool: dynamic(() => import("@/components/tools/markup-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MmToInchesConverterTool: dynamic(() => import("@/components/tools/mm-to-inches-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PlaceholderImageGeneratorTool: dynamic(() => import("@/components/tools/placeholder-image-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  RandomTokenGeneratorTool: dynamic(() => import("@/components/tools/random-token-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  SimpleInterestCalculatorTool: dynamic(() => import("@/components/tools/simple-interest-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ContrastCheckerTool: dynamic(() => import("@/components/tools/contrast-checker-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlCleanerTool: dynamic(() => import("@/components/tools/html-cleaner-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorFugiTool: dynamic(() => import("@/components/tools/kalkulator-fugi-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorOgrzewaniaPodlogowegoTool: dynamic(() => import("@/components/tools/kalkulator-ogrzewania-podlogowego-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ReadingTimeCalculatorTool: dynamic(() => import("@/components/tools/reading-time-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  Sha256GeneratorTool: dynamic(() => import("@/components/tools/sha256-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  UnitPriceCalculatorTool: dynamic(() => import("@/components/tools/unit-price-calculator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  Base64DecoderTool: dynamic(() => import("@/components/tools/base64-decoder-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  Base64EncoderTool: dynamic(() => import("@/components/tools/base64-encoder-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlLinkExtractorTool: dynamic(() => import("@/components/tools/html-link-extractor-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlTagRemoverTool: dynamic(() => import("@/components/tools/html-tag-remover-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  ImageToBase64Tool: dynamic(() => import("@/components/tools/image-to-base64-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorGladziTool: dynamic(() => import("@/components/tools/kalkulator-gladzi-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  PaletteGeneratorTool: dynamic(() => import("@/components/tools/palette-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  SentenceCounterTool: dynamic(() => import("@/components/tools/sentence-counter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  Base64ToImageTool: dynamic(() => import("@/components/tools/base64-to-image-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlEscapeTool: dynamic(() => import("@/components/tools/html-escape-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlUnescapeTool: dynamic(() => import("@/components/tools/html-unescape-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorRynienTool: dynamic(() => import("@/components/tools/kalkulator-rynien-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  RemoveExtraSpacesTool: dynamic(() => import("@/components/tools/remove-extra-spaces-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  UuidGeneratorTool: dynamic(() => import("@/components/tools/uuid-generator-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  GbToMbConverterTool: dynamic(() => import("@/components/tools/gb-to-mb-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlImageExtractorTool: dynamic(() => import("@/components/tools/html-image-extractor-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlPrettyPrintTool: dynamic(() => import("@/components/tools/html-pretty-print-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  KalkulatorHydroizolacjiTool: dynamic(() => import("@/components/tools/kalkulator-hydroizolacji-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  MbToGbConverterTool: dynamic(() => import("@/components/tools/mb-to-gb-converter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  UrlDecoderTool: dynamic(() => import("@/components/tools/url-decoder-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  UrlEncoderTool: dynamic(() => import("@/components/tools/url-encoder-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  HtmlEntityEncoderTool: dynamic(() => import("@/components/tools/html-entity-encoder-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  LineCounterTool: dynamic(() => import("@/components/tools/line-counter-tool"), {
    loading: ToolLoading,
    ssr: false
  }),
  TextReverserTool: dynamic(() => import("@/components/tools/text-reverser-tool"), {
    loading: ToolLoading,
    ssr: false
  })
} as const;

export type ToolComponentName = keyof typeof toolComponents;

export function DynamicToolComponent({
  componentName
}: {
  componentName: ToolComponentName;
}) {
  const ToolComponent = toolComponents[componentName];
  return createElement(ToolComponent);
}
