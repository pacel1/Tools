import path from "node:path";
import { locales, type Locale } from "@/lib/constants";
import { writeFileSafe, writeJson } from "./shared/filesystem";
import { syncGeneratedArtifacts } from "./shared/registry-writer";

type ToolKind = "converter" | "calculator" | "text-tool" | "developer-tool" | "security-tool";
type Category =
  | "converters"
  | "calculators"
  | "construction-calculators"
  | "text-tools"
  | "developer-tools"
  | "security-tools";
type Family = "converter" | "calculator" | "date" | "text-metric" | "text-transform" | "json" | "generator";

type Seed = {
  id: string;
  title: string;
  description: string;
  category: Category;
  type: ToolKind;
  family: Family;
  seoPriority: number;
  variant: string;
  inputLabel?: string;
  outputLabel?: string;
  factor?: number;
  exampleInput?: number;
};

const converterRows = [
  "lbs-to-kg-converter|LBS to KG Converter|Convert pounds to kilograms instantly|0.94|Pounds|Kilograms|0.45359237|10",
  "cm-to-inches-converter|CM to Inches Converter|Convert centimeters to inches instantly|0.94|Centimeters|Inches|0.3937007874|10",
  "inches-to-cm-converter|Inches to CM Converter|Convert inches to centimeters instantly|0.93|Inches|Centimeters|2.54|10",
  "mm-to-inches-converter|MM to Inches Converter|Convert millimeters to inches instantly|0.90|Millimeters|Inches|0.03937007874|25",
  "inches-to-mm-converter|Inches to MM Converter|Convert inches to millimeters instantly|0.90|Inches|Millimeters|25.4|4",
  "meters-to-feet-converter|Meters to Feet Converter|Convert meters to feet instantly|0.91|Meters|Feet|3.280839895|2",
  "feet-to-meters-converter|Feet to Meters Converter|Convert feet to meters instantly|0.91|Feet|Meters|0.3048|6",
  "km-to-miles-converter|KM to Miles Converter|Convert kilometers to miles instantly|0.95|Kilometers|Miles|0.6213711922|5",
  "miles-to-km-converter|Miles to KM Converter|Convert miles to kilometers instantly|0.95|Miles|Kilometers|1.609344|10",
  "celsius-to-fahrenheit-converter|Celsius to Fahrenheit Converter|Convert Celsius to Fahrenheit instantly|0.96|Celsius|Fahrenheit|0|20",
  "fahrenheit-to-celsius-converter|Fahrenheit to Celsius Converter|Convert Fahrenheit to Celsius instantly|0.96|Fahrenheit|Celsius|0|68",
  "liters-to-gallons-converter|Liters to Gallons Converter|Convert liters to gallons instantly|0.90|Liters|Gallons|0.2641720524|10",
  "gallons-to-liters-converter|Gallons to Liters Converter|Convert gallons to liters instantly|0.90|Gallons|Liters|3.785411784|3",
  "mb-to-gb-converter|MB to GB Converter|Convert megabytes to gigabytes instantly|0.86|Megabytes|Gigabytes|0.0009765625|512",
  "gb-to-mb-converter|GB to MB Converter|Convert gigabytes to megabytes instantly|0.86|Gigabytes|Megabytes|1024|2"
];

const calculatorRows = [
  "bmi-calculator|BMI Calculator|Calculate body mass index from height and weight|0.99|bmi",
  "age-calculator|Age Calculator|Calculate exact age from date of birth|0.98|age-calculator",
  "days-between-dates-calculator|Days Between Dates Calculator|Calculate the number of days between two dates|0.96|days-between-dates",
  "percentage-calculator|Percentage Calculator|Calculate what percentage one number is of another|0.98|percentage-of",
  "percentage-increase-calculator|Percentage Increase Calculator|Calculate a value after a percentage increase|0.94|percentage-increase",
  "percentage-decrease-calculator|Percentage Decrease Calculator|Calculate a value after a percentage decrease|0.94|percentage-decrease",
  "discount-calculator|Discount Calculator|Calculate sale price after a discount percentage|0.95|discount",
  "sales-tax-calculator|Sales Tax Calculator|Calculate total price after adding sales tax|0.92|sales-tax",
  "tip-calculator|Tip Calculator|Calculate tip amount and total bill instantly|0.94|tip",
  "loan-payment-calculator|Loan Payment Calculator|Estimate monthly loan payment from amount, rate and term|0.97|loan-payment",
  "simple-interest-calculator|Simple Interest Calculator|Calculate simple interest from principal, rate and time|0.90|simple-interest",
  "compound-interest-calculator|Compound Interest Calculator|Calculate compound interest growth over time|0.95|compound-interest",
  "unit-price-calculator|Unit Price Calculator|Compare price per unit from total cost and quantity|0.89|unit-price",
  "markup-calculator|Markup Calculator|Calculate markup percentage and final selling price|0.90|markup"
];

const textMetricRows = [
  "character-counter|Character Counter|Count characters in text instantly|0.93|character-counter",
  "line-counter|Line Counter|Count lines in text instantly|0.84|line-counter",
  "sentence-counter|Sentence Counter|Count sentences in text instantly|0.88|sentence-counter",
  "reading-time-calculator|Reading Time Calculator|Estimate reading time from word count instantly|0.89|reading-time",
  "keyword-density-checker|Keyword Density Checker|Check keyword density in a block of text|0.92|keyword-density"
];

const textTransformRows = [
  "case-converter|Case Converter|Convert text to upper case, lower case, title case and sentence case|0.94|case-converter",
  "slug-generator|Slug Generator|Convert text into an SEO friendly URL slug|0.93|slug-generator",
  "text-reverser|Text Reverser|Reverse text instantly online|0.82|text-reverser",
  "remove-extra-spaces|Remove Extra Spaces Tool|Remove extra spaces and clean up pasted text|0.87|remove-extra-spaces",
  "base64-encoder|Base64 Encoder|Encode text to Base64 instantly|0.88|base64-encoder",
  "base64-decoder|Base64 Decoder|Decode Base64 text instantly|0.88|base64-decoder",
  "url-encoder|URL Encoder|Encode text for safe use in URLs|0.86|url-encoder",
  "url-decoder|URL Decoder|Decode URL encoded text instantly|0.86|url-decoder"
];

const jsonRows = [
  "json-minifier|JSON Minifier|Minify JSON instantly online|0.90|json-minifier",
  "json-validator|JSON Validator|Validate JSON and detect errors instantly|0.92|json-validator"
];

const generatorRows = [
  "password-generator|Password Generator|Generate strong random passwords instantly|security-tools|security-tool|0.97|password-generator",
  "uuid-generator|UUID Generator|Generate random UUIDs instantly|developer-tools|developer-tool|0.87|uuid-generator",
  "sha256-generator|SHA256 Generator|Generate SHA256 hash from text instantly|security-tools|security-tool|0.89|sha256-generator"
];

function parseConverter(row: string): Seed {
  const [id, title, description, seo, inputLabel, outputLabel, factor, exampleInput] = row.split("|");
  return { id, title, description, category: "converters", type: "converter", family: "converter", seoPriority: Number(seo), variant: id, inputLabel, outputLabel, factor: Number(factor), exampleInput: Number(exampleInput) };
}

function parseCalculator(row: string): Seed {
  const [id, title, description, seo, variant] = row.split("|");
  return { id, title, description, category: "calculators", type: "calculator", family: variant === "age-calculator" || variant === "days-between-dates" ? "date" : "calculator", seoPriority: Number(seo), variant };
}

function parseTextMetric(row: string): Seed {
  const [id, title, description, seo, variant] = row.split("|");
  return { id, title, description, category: "text-tools", type: "text-tool", family: "text-metric", seoPriority: Number(seo), variant };
}

function parseTextTransform(row: string): Seed {
  const [id, title, description, seo, variant] = row.split("|");
  const developerVariant = variant === "base64-encoder" || variant === "base64-decoder" || variant === "url-encoder" || variant === "url-decoder";
  return { id, title, description, category: developerVariant ? "developer-tools" : "text-tools", type: developerVariant ? "developer-tool" : "text-tool", family: "text-transform", seoPriority: Number(seo), variant };
}

function parseJson(row: string): Seed {
  const [id, title, description, seo, variant] = row.split("|");
  return { id, title, description, category: "developer-tools", type: "developer-tool", family: "json", seoPriority: Number(seo), variant };
}

function parseGenerator(row: string): Seed {
  const [id, title, description, category, type, seo, variant] = row.split("|");
  return { id, title, description, category: category as Category, type: type as ToolKind, family: "generator", seoPriority: Number(seo), variant };
}

const seeds: Seed[] = [
  ...converterRows.map(parseConverter),
  ...calculatorRows.map(parseCalculator),
  ...textMetricRows.map(parseTextMetric),
  ...textTransformRows.map(parseTextTransform),
  ...jsonRows.map(parseJson),
  ...generatorRows.map(parseGenerator)
];

function pascal(value: string) { return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(""); }
function camel(value: string) { const p = pascal(value); return p.charAt(0).toLowerCase() + p.slice(1); }
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function record(seed: Seed) { const c = camel(seed.id); return { id: seed.id, type: seed.type, category: seed.category, componentName: `${pascal(seed.id)}Tool`, logicModule: seed.id, inputSchema: `${c}InputSchema`, outputSchema: `${c}OutputSchema`, supportedLocales: [...locales], relatedTools: [], seoPriority: seed.seoPriority }; }
const localeCopy = {
  en: { overview: "This page gives a fast answer with a practical utility tool and a simple result flow.", step1: "Enter the required value or text into the form.", step2: "The conversion, calculation or transformation runs instantly in the browser.", step3: "Review the result and continue with related tools if you need another step.", q1: "How accurate is this tool?", a1: "The result is calculated directly from the formula or browser-side logic used by this tool.", q2: "Can I use this tool on mobile?", a2: "Yes. The page works on desktop and mobile screens with a simple input and result layout.", ex1: "Example 1", ex2: "Example 2" },
  pl: { overview: "Ta strona szybko rozwiazuje konkretny problem za pomoca prostego narzedzia online.", step1: "Wpisz wartosc lub tekst do formularza.", step2: "Konwersja, obliczenie albo transformacja wykonuje sie od razu w przegladarce.", step3: "Sprawdz wynik i przejdz do powiazanych narzedzi, jesli potrzebujesz kolejnego kroku.", q1: "Jak dokladne jest to narzedzie?", a1: "Wynik jest liczony bezposrednio na podstawie wzoru albo logiki dzialajacej po stronie przegladarki.", q2: "Czy narzedzie dziala na telefonie?", a2: "Tak. Strona dziala na komputerach i urzadzeniach mobilnych z prostym ukladem wejscia i wyniku.", ex1: "Przyklad 1", ex2: "Przyklad 2" },
  es: { overview: "Esta pagina resuelve una necesidad concreta con una herramienta online simple y rapida.", step1: "Introduce el valor o texto necesario en el formulario.", step2: "La conversion, el calculo o la transformacion se ejecuta al instante en el navegador.", step3: "Revisa el resultado y usa las herramientas relacionadas si necesitas otro paso.", q1: "Que precision tiene esta herramienta?", a1: "El resultado se calcula directamente a partir de la formula o de la logica del navegador usada por la herramienta.", q2: "Puedo usarla en movil?", a2: "Si. La pagina funciona en escritorio y movil con una interfaz simple de entrada y resultado.", ex1: "Ejemplo 1", ex2: "Ejemplo 2" },
  de: { overview: "Diese Seite loest eine konkrete Aufgabe mit einem einfachen und schnellen Online Tool.", step1: "Gib den benoetigten Wert oder Text in das Formular ein.", step2: "Die Umrechnung, Berechnung oder Transformation laeuft sofort im Browser.", step3: "Pruefe das Ergebnis und nutze bei Bedarf verwandte Tools fuer den naechsten Schritt.", q1: "Wie genau ist dieses Tool?", a1: "Das Ergebnis wird direkt aus der Formel oder der Browser Logik dieses Tools berechnet.", q2: "Funktioniert das Tool auf dem Handy?", a2: "Ja. Die Seite funktioniert auf Desktop und Mobilgeraeten mit einem einfachen Ablauf.", ex1: "Beispiel 1", ex2: "Beispiel 2" },
  fr: { overview: "Cette page repond a un besoin precis avec un outil en ligne simple et rapide.", step1: "Saisissez la valeur ou le texte necessaire dans le formulaire.", step2: "La conversion, le calcul ou la transformation se lance instantanement dans le navigateur.", step3: "Consultez le resultat puis utilisez les outils associes si besoin.", q1: "Quelle est la precision de cet outil ?", a1: "Le resultat est calcule directement a partir de la formule ou de la logique utilisee dans le navigateur.", q2: "Puis je utiliser cet outil sur mobile ?", a2: "Oui. La page fonctionne sur ordinateur et mobile avec une interface simple.", ex1: "Exemple 1", ex2: "Exemple 2" }
} as const;

const commonUi = {
  result: { en: "Result", pl: "Wynik", es: "Resultado", de: "Ergebnis", fr: "Resultat" },
  text: { en: "Text", pl: "Tekst", es: "Texto", de: "Text", fr: "Texte" },
  input: { en: "Input", pl: "Dane", es: "Entrada", de: "Eingabe", fr: "Entree" },
  keyword: { en: "Keyword", pl: "Slowo kluczowe", es: "Palabra clave", de: "Schluesselwort", fr: "Mot cle" },
  detailCalculated: { en: "Calculated result", pl: "Obliczony wynik", es: "Resultado calculado", de: "Berechnetes Ergebnis", fr: "Resultat calcule" },
  detailAge: { en: "Exact age in years", pl: "Dokladny wiek w latach", es: "Edad exacta en anos", de: "Genaues Alter in Jahren", fr: "Age exact en annees" },
  detailDays: { en: "Difference in days", pl: "Roznica w dniach", es: "Diferencia en dias", de: "Differenz in Tagen", fr: "Difference en jours" },
  density: { en: "Density", pl: "Gestosc", es: "Densidad", de: "Dichte", fr: "Densite" },
  occurrences: { en: "Occurrences", pl: "Wystapienia", es: "Apariciones", de: "Vorkommen", fr: "Occurrences" },
  totalWords: { en: "Total words", pl: "Liczba slow", es: "Total de palabras", de: "Woerter gesamt", fr: "Nombre de mots" },
  statusValid: { en: "Status: valid", pl: "Status: poprawny", es: "Estado: valido", de: "Status: gueltig", fr: "Statut : valide" },
  statusInvalid: { en: "Status: invalid", pl: "Status: niepoprawny", es: "Estado: no valido", de: "Status: ungueltig", fr: "Statut : invalide" },
  validJson: { en: "Valid JSON", pl: "Poprawny JSON", es: "JSON valido", de: "Gueltiges JSON", fr: "JSON valide" },
  jsonMinified: { en: "JSON minified successfully", pl: "JSON zostal zminimalizowany", es: "JSON minimizado correctamente", de: "JSON wurde minifiziert", fr: "JSON minifie avec succes" },
  length: { en: "Length", pl: "Dlugosc", es: "Longitud", de: "Laenge", fr: "Longueur" },
  uppercase: { en: "Uppercase", pl: "Wielkie litery", es: "Mayusculas", de: "Grossbuchstaben", fr: "Majuscules" },
  lowercase: { en: "Lowercase", pl: "Male litery", es: "Minusculas", de: "Kleinbuchstaben", fr: "Minuscules" },
  numbers: { en: "Numbers", pl: "Cyfry", es: "Numeros", de: "Zahlen", fr: "Chiffres" },
  symbols: { en: "Symbols", pl: "Symbole", es: "Simbolos", de: "Symbole", fr: "Symboles" },
  generatedPassword: { en: "Generated password", pl: "Wygenerowane haslo", es: "Contrasena generada", de: "Generiertes Passwort", fr: "Mot de passe genere" },
  count: { en: "Count", pl: "Liczba", es: "Cantidad", de: "Anzahl", fr: "Nombre" },
  uuidValues: { en: "UUID values", pl: "Wartosci UUID", es: "Valores UUID", de: "UUID Werte", fr: "Valeurs UUID" },
  json: { en: "JSON", pl: "JSON", es: "JSON", de: "JSON", fr: "JSON" },
  sha256Hash: { en: "SHA256 hash", pl: "Hash SHA256", es: "Hash SHA256", de: "SHA256 Hash", fr: "Hash SHA256" },
  upperCaseResult: { en: "UPPER CASE", pl: "WIELKIE LITERY", es: "MAYUSCULAS", de: "GROSSBUCHSTABEN", fr: "MAJUSCULES" },
  lowerCaseResult: { en: "lower case", pl: "male litery", es: "minusculas", de: "kleinbuchstaben", fr: "minuscules" },
  titleCaseResult: { en: "Title Case", pl: "Kazde Slowo Wielka Litera", es: "Tipo Titulo", de: "Titelgrossschreibung", fr: "Style Titre" },
  sentenceCaseResult: { en: "Sentence case", pl: "Zdanie", es: "Tipo frase", de: "Satzschreibung", fr: "Style phrase" }
} as const;

const fieldUi = {
  weightKg: { en: "Weight (kg)", pl: "Waga (kg)", es: "Peso (kg)", de: "Gewicht (kg)", fr: "Poids (kg)" },
  heightCm: { en: "Height (cm)", pl: "Wzrost (cm)", es: "Altura (cm)", de: "Groesse (cm)", fr: "Taille (cm)" },
  value: { en: "Value", pl: "Wartosc", es: "Valor", de: "Wert", fr: "Valeur" },
  total: { en: "Total", pl: "Suma", es: "Total", de: "Gesamt", fr: "Total" },
  percent: { en: "Percent", pl: "Procent", es: "Porcentaje", de: "Prozent", fr: "Pourcentage" },
  amount: { en: "Amount", pl: "Kwota", es: "Cantidad", de: "Betrag", fr: "Montant" },
  principal: { en: "Principal", pl: "Kapital", es: "Capital", de: "Kapital", fr: "Capital" },
  annualRate: { en: "Annual rate (%)", pl: "Oprocentowanie roczne (%)", es: "Tasa anual (%)", de: "Jahreszins (%)", fr: "Taux annuel (%)" },
  termMonths: { en: "Term (months)", pl: "Okres (miesiace)", es: "Plazo (meses)", de: "Laufzeit (Monate)", fr: "Duree (mois)" },
  years: { en: "Years", pl: "Lata", es: "Anos", de: "Jahre", fr: "Annees" },
  compoundsPerYear: { en: "Compounds per year", pl: "Kapitalizacja w roku", es: "Capitalizaciones por ano", de: "Verzinsungen pro Jahr", fr: "Capitalisations par an" },
  totalPrice: { en: "Total price", pl: "Cena laczna", es: "Precio total", de: "Gesamtpreis", fr: "Prix total" },
  quantity: { en: "Quantity", pl: "Ilosc", es: "Cantidad", de: "Menge", fr: "Quantite" },
  cost: { en: "Cost", pl: "Koszt", es: "Costo", de: "Kosten", fr: "Cout" },
  markupPercent: { en: "Markup (%)", pl: "Marza (%)", es: "Margen (%)", de: "Aufschlag (%)", fr: "Marge (%)" },
  birthDate: { en: "Birth date", pl: "Data urodzenia", es: "Fecha de nacimiento", de: "Geburtsdatum", fr: "Date de naissance" },
  startDate: { en: "Start date", pl: "Data poczatkowa", es: "Fecha inicial", de: "Startdatum", fr: "Date de debut" },
  endDate: { en: "End date", pl: "Data koncowa", es: "Fecha final", de: "Enddatum", fr: "Date de fin" }
} as const;

const unitUi = {
  Pounds: { en: "Pounds", pl: "Funty", es: "Libras", de: "Pfund", fr: "Livres" },
  Kilograms: { en: "Kilograms", pl: "Kilogramy", es: "Kilogramos", de: "Kilogramm", fr: "Kilogrammes" },
  Centimeters: { en: "Centimeters", pl: "Centymetry", es: "Centimetros", de: "Zentimeter", fr: "Centimetres" },
  Inches: { en: "Inches", pl: "Cale", es: "Pulgadas", de: "Zoll", fr: "Pouces" },
  Millimeters: { en: "Millimeters", pl: "Milimetry", es: "Milimetros", de: "Millimeter", fr: "Millimetres" },
  Meters: { en: "Meters", pl: "Metry", es: "Metros", de: "Meter", fr: "Metres" },
  Feet: { en: "Feet", pl: "Stopy", es: "Pies", de: "Fuss", fr: "Pieds" },
  Kilometers: { en: "Kilometers", pl: "Kilometry", es: "Kilometros", de: "Kilometer", fr: "Kilometres" },
  Miles: { en: "Miles", pl: "Mile", es: "Millas", de: "Meilen", fr: "Miles" },
  Celsius: { en: "Celsius", pl: "Celsjusz", es: "Celsius", de: "Celsius", fr: "Celsius" },
  Fahrenheit: { en: "Fahrenheit", pl: "Fahrenheit", es: "Fahrenheit", de: "Fahrenheit", fr: "Fahrenheit" },
  Liters: { en: "Liters", pl: "Litry", es: "Litros", de: "Liter", fr: "Litres" },
  Gallons: { en: "Gallons", pl: "Galony", es: "Galones", de: "Gallonen", fr: "Gallons" },
  Megabytes: { en: "Megabytes", pl: "Megabajty", es: "Megabytes", de: "Megabyte", fr: "Megaoctets" },
  Gigabytes: { en: "Gigabytes", pl: "Gigabajty", es: "Gigabytes", de: "Gigabyte", fr: "Gigaoctets" }
} as const;

function jsonLiteral(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function converterResult(seed: Seed, value: number) {
  if (seed.id === "celsius-to-fahrenheit-converter") return value * (9 / 5) + 32;
  if (seed.id === "fahrenheit-to-celsius-converter") return (value - 32) * (5 / 9);
  return value * Number(seed.factor ?? 1);
}

function exampleInput(seed: Seed) {
  if (seed.family === "converter") return `${seed.exampleInput} ${seed.inputLabel?.toLowerCase()}`;
  const map: Record<string, string> = {
    bmi: "70 kg and 175 cm",
    "age-calculator": "1990-05-15",
    "days-between-dates": "2025-01-01 to 2025-01-31",
    "percentage-of": "25 of 200",
    "percentage-increase": "120 increased by 15%",
    "percentage-decrease": "120 decreased by 15%",
    discount: "100 with 20% discount",
    "sales-tax": "100 with 8% tax",
    tip: "86 with 15% tip",
    "loan-payment": "25000, 6%, 60 months",
    "simple-interest": "5000, 4%, 3 years",
    "compound-interest": "5000, 5%, 10 years",
    "unit-price": "12 for 3 units",
    markup: "Cost 50, markup 30%",
    "character-counter": "Product description text",
    "line-counter": "Three lines of text",
    "sentence-counter": "A paragraph with several sentences.",
    "reading-time": "A blog draft",
    "keyword-density": "SEO article + target keyword",
    "case-converter": "sample headline text",
    "slug-generator": "Best SEO Tool Page Title",
    "text-reverser": "utility tools",
    "remove-extra-spaces": "text   with   extra   spaces",
    "json-minifier": '{"name":"tool","value":1}',
    "json-validator": '{"items":[1,2,3]}',
    "base64-encoder": "hello world",
    "base64-decoder": "aGVsbG8gd29ybGQ=",
    "url-encoder": "hello world?x=1&y=2",
    "url-decoder": "hello%20world%3Fx%3D1%26y%3D2",
    "password-generator": "Length 16",
    "uuid-generator": "Generate one UUID",
    "sha256-generator": "hash this text"
  };
  return map[seed.variant];
}

function exampleOutput(seed: Seed) {
  if (seed.family === "converter") return `${Number(converterResult(seed, Number(seed.exampleInput)).toFixed(4)).toString()} ${seed.outputLabel?.toLowerCase()}`;
  const map: Record<string, string> = {
    bmi: "22.86",
    "age-calculator": "Age in years",
    "days-between-dates": "30 days",
    "percentage-of": "12.5%",
    "percentage-increase": "138",
    "percentage-decrease": "102",
    discount: "80",
    "sales-tax": "108",
    tip: "98.90",
    "loan-payment": "Monthly payment",
    "simple-interest": "600",
    "compound-interest": "Growth over time",
    "unit-price": "4 per unit",
    markup: "65",
    "character-counter": "Character total",
    "line-counter": "Line total",
    "sentence-counter": "Sentence total",
    "reading-time": "Estimated reading time",
    "keyword-density": "Keyword density percent",
    "case-converter": "UPPER / lower / Title / Sentence",
    "slug-generator": "best-seo-tool-page-title",
    "text-reverser": "sloot ytilitu",
    "remove-extra-spaces": "text with extra spaces",
    "json-minifier": '{"name":"tool","value":1}',
    "json-validator": "Valid JSON",
    "base64-encoder": "aGVsbG8gd29ybGQ=",
    "base64-decoder": "hello world",
    "url-encoder": "hello%20world%3Fx%3D1%26y%3D2",
    "url-decoder": "hello world?x=1&y=2",
    "password-generator": "Random strong password",
    "uuid-generator": "UUID v4",
    "sha256-generator": "SHA256 hash"
  };
  return map[seed.variant];
}

function content(seed: Seed, locale: Locale) {
  const copy = localeCopy[locale];
  const localizedShortDescription = {
    en: `${seed.description} with fast results, simple inputs and practical examples.`,
    pl: `${seed.title} to darmowe narzedzie online z szybkim wynikiem, prostym formularzem i praktycznymi przykladami.`,
    es: `${seed.title} es una herramienta online gratuita con resultados inmediatos, campos simples y ejemplos practicos.`,
    de: `${seed.title} ist ein kostenloses Online Tool mit schnellem Ergebnis, einfachem Formular und praktischen Beispielen.`,
    fr: `${seed.title} est un outil en ligne gratuit avec un resultat rapide, un formulaire simple et des exemples pratiques.`
  } as const;
  const localizedOverview = {
    en: `${seed.description}. ${copy.overview} This page targets users who want a free online answer, fast browser-based results and practical long-tail utility content.`,
    pl: `${seed.title} pomaga szybko rozwiazac konkretny problem bez instalacji i bez logowania. ${copy.overview} Strona jest przygotowana pod ruch organiczny, zapytania long tail i praktyczne zastosowania na komputerze oraz telefonie.`,
    es: `${seed.title} ayuda a resolver una tarea concreta sin registro ni instalacion. ${copy.overview} La pagina esta pensada para trafico organico, consultas long tail y resultados rapidos en ordenador y movil.`,
    de: `${seed.title} loest eine konkrete Aufgabe ohne Registrierung und ohne Installation. ${copy.overview} Die Seite ist fuer organische Suche, Long Tail Suchanfragen und schnelle Ergebnisse auf Desktop und Mobilgeraeten optimiert.`,
    fr: `${seed.title} permet de resoudre un besoin precis sans inscription ni installation. ${copy.overview} La page est pensee pour le SEO organique, les requetes longue traine et des resultats rapides sur ordinateur et mobile.`
  } as const;
  const localizedExampleOne = {
    en: `A realistic ${seed.title.toLowerCase()} example for an everyday search query.`,
    pl: "Praktyczny przyklad pokazujacy typowe uzycie narzedzia przy codziennym problemie.",
    es: "Ejemplo practico para una consulta habitual con intencion clara de uso.",
    de: "Praktisches Beispiel fuer eine typische Suchanfrage mit klarer Nutzungsabsicht.",
    fr: "Exemple pratique pour une recherche courante avec une intention d usage concrete."
  } as const;
  const localizedExampleTwo = {
    en: "Another practical use case for organic long-tail traffic.",
    pl: "Drugi scenariusz uzycia dopasowany do zapytan long tail i ruchu organicznego.",
    es: "Otro caso de uso util para trafico organico y consultas long tail.",
    de: "Weiterer Anwendungsfall fuer organischen Traffic und Long Tail Suchanfragen.",
    fr: "Autre cas d usage utile pour le trafic organique et les requetes longue traine."
  } as const;
  const localizedSeoDescription = {
    en: `${seed.description}. Free online ${seed.title.toLowerCase()} with instant results.`,
    pl: `${seed.title} online za darmo z natychmiastowym wynikiem i prostym formularzem.`,
    es: `${seed.title} online gratis con resultados inmediatos y uso sencillo.`,
    de: `${seed.title} kostenlos online mit sofortigem Ergebnis und einfacher Bedienung.`,
    fr: `${seed.title} gratuit en ligne avec resultat instantane et utilisation simple.`
  } as const;
  return {
    toolId: seed.id,
    locale,
    slug: slugify(seed.title),
    h1: seed.title,
    title: seed.title,
    shortDescription: localizedShortDescription[locale],
    overview: localizedOverview[locale],
    howItWorks: [copy.step1, copy.step2, copy.step3],
    examples: [
      { title: copy.ex1, input: exampleInput(seed), output: exampleOutput(seed), description: localizedExampleOne[locale] },
      { title: copy.ex2, input: exampleInput(seed), output: exampleOutput(seed), description: localizedExampleTwo[locale] }
    ],
    faq: [
      { question: copy.q1, answer: copy.a1 },
      { question: copy.q2, answer: copy.a2 }
    ],
    seo: {
      title: seed.title,
      description: localizedSeoDescription[locale],
      keywords: [seed.title.toLowerCase(), seed.id.replace(/-/g, " "), `${seed.category} tool`]
    }
  };
}
function fileParts(seed: Seed) {
  const p = pascal(seed.id);
  const c = camel(seed.id);

  if (seed.family === "converter") {
    const logicLine = seed.id === "celsius-to-fahrenheit-converter" ? "const result = parsed.value * (9 / 5) + 32;" : seed.id === "fahrenheit-to-celsius-converter" ? "const result = (parsed.value - 32) * (5 / 9);" : `const result = parsed.value * ${seed.factor};`;
    const labels = {
      en: { input: unitUi[seed.inputLabel as keyof typeof unitUi].en, output: unitUi[seed.outputLabel as keyof typeof unitUi].en },
      pl: { input: unitUi[seed.inputLabel as keyof typeof unitUi].pl, output: unitUi[seed.outputLabel as keyof typeof unitUi].pl },
      es: { input: unitUi[seed.inputLabel as keyof typeof unitUi].es, output: unitUi[seed.outputLabel as keyof typeof unitUi].es },
      de: { input: unitUi[seed.inputLabel as keyof typeof unitUi].de, output: unitUi[seed.outputLabel as keyof typeof unitUi].de },
      fr: { input: unitUi[seed.inputLabel as keyof typeof unitUi].fr, output: unitUi[seed.outputLabel as keyof typeof unitUi].fr }
    };
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid ${seed.inputLabel?.toLowerCase()} value.") });\nexport const ${c}OutputSchema = z.object({ result: z.number(), formatted: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  ${logicLine}\n  return ${c}OutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\\.$/, "") });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [value, setValue] = useState("${seed.exampleInput}");\n  const result = useMemo(() => run${p}({ value: Number(value || 0) }), [value]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-value">{t.input}</label>\n        <input id="${seed.id}-value" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" min="0" step="any" type="number" value={value} onChange={(event) => setValue(event.target.value)} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.output}</p>\n        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("converts the input value", () => {\n    const result = run${p}({ value: ${seed.exampleInput} });\n    expect(result.result).toBeGreaterThan(0);\n  });\n});\n`
    };
  }

  if (seed.family === "calculator") {
    const cfg: Record<string, { fields: [string, string, string][], compute: string, test: string }> = {
      bmi: { fields: [["weightKg", "Weight (kg)", "70"], ["heightCm", "Height (cm)", "175"]], compute: "const result = parsed.weightKg / Math.pow(parsed.heightCm / 100, 2);", test: "{ weightKg: 70, heightCm: 175 }" },
      "percentage-of": { fields: [["value", "Value", "25"], ["total", "Total", "200"]], compute: "const result = parsed.total === 0 ? 0 : (parsed.value / parsed.total) * 100;", test: "{ value: 25, total: 200 }" },
      "percentage-increase": { fields: [["value", "Value", "120"], ["percent", "Percent", "15"]], compute: "const result = parsed.value * (1 + parsed.percent / 100);", test: "{ value: 120, percent: 15 }" },
      "percentage-decrease": { fields: [["value", "Value", "120"], ["percent", "Percent", "15"]], compute: "const result = parsed.value * (1 - parsed.percent / 100);", test: "{ value: 120, percent: 15 }" },
      discount: { fields: [["amount", "Original price", "100"], ["percent", "Discount (%)", "20"]], compute: "const result = parsed.amount * (1 - parsed.percent / 100);", test: "{ amount: 100, percent: 20 }" },
      "sales-tax": { fields: [["amount", "Amount", "100"], ["percent", "Tax (%)", "8"]], compute: "const result = parsed.amount * (1 + parsed.percent / 100);", test: "{ amount: 100, percent: 8 }" },
      tip: { fields: [["amount", "Bill amount", "86"], ["percent", "Tip (%)", "15"]], compute: "const result = parsed.amount * (1 + parsed.percent / 100);", test: "{ amount: 86, percent: 15 }" },
      "loan-payment": { fields: [["principal", "Loan amount", "25000"], ["annualRate", "Annual rate (%)", "6"], ["termMonths", "Term (months)", "60"]], compute: "const monthlyRate = parsed.annualRate / 100 / 12; const result = monthlyRate === 0 ? parsed.principal / parsed.termMonths : (parsed.principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -parsed.termMonths));", test: "{ principal: 25000, annualRate: 6, termMonths: 60 }" },
      "simple-interest": { fields: [["principal", "Principal", "5000"], ["annualRate", "Annual rate (%)", "4"], ["years", "Years", "3"]], compute: "const result = parsed.principal * (parsed.annualRate / 100) * parsed.years;", test: "{ principal: 5000, annualRate: 4, years: 3 }" },
      "compound-interest": { fields: [["principal", "Principal", "5000"], ["annualRate", "Annual rate (%)", "5"], ["years", "Years", "10"], ["compoundsPerYear", "Compounds per year", "12"]], compute: "const result = parsed.principal * Math.pow(1 + parsed.annualRate / 100 / parsed.compoundsPerYear, parsed.compoundsPerYear * parsed.years);", test: "{ principal: 5000, annualRate: 5, years: 10, compoundsPerYear: 12 }" },
      "unit-price": { fields: [["totalPrice", "Total price", "12"], ["quantity", "Quantity", "3"]], compute: "const result = parsed.quantity === 0 ? 0 : parsed.totalPrice / parsed.quantity;", test: "{ totalPrice: 12, quantity: 3 }" },
      markup: { fields: [["cost", "Cost", "50"], ["markupPercent", "Markup (%)", "30"]], compute: "const result = parsed.cost * (1 + parsed.markupPercent / 100);", test: "{ cost: 50, markupPercent: 30 }" }
    };
    const config = cfg[seed.variant];
    const fieldsShape = config.fields.map(([key]) => `  ${key}: z.coerce.number().finite().min(0)`).join(",\n");
    const init = config.fields.map(([key, , value]) => `    ${key}: "${value}"`).join(",\n");
    const payload = config.fields.map(([key]) => `      ${key}: Number(form.${key} || 0)`).join(",\n");
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          result: commonUi.result[locale],
          detail: commonUi.detailCalculated[locale],
          ...Object.fromEntries(
            config.fields.map(([key]) => [key, fieldUi[key as keyof typeof fieldUi][locale]])
          )
        }
      ])
    );
    const inputs = config.fields.map(([key]) => `        <div>\n          <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-${key}">{t.${key}}</label>\n          <input id="${seed.id}-${key}" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" step="any" value={form.${key}} onChange={(event) => update("${key}", event.target.value)} />\n        </div>`).join("\n");
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({\n${fieldsShape}\n});\nexport const ${c}OutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  ${config.compute}\n  return ${c}OutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [form, setForm] = useState({\n${init}\n  });\n  const result = useMemo(() => run${p}({\n${payload}\n  }), [form]);\n  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }\n  return (\n    <div className="space-y-5">\n${inputs}\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>\n        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>\n        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("returns a numeric result", () => {\n    const result = run${p}(${config.test});\n    expect(Number.isFinite(result.result)).toBe(true);\n  });\n});\n`
    };
  }

  if (seed.family === "date") {
    const age = seed.variant === "age-calculator";
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        age
          ? {
              birthDate: fieldUi.birthDate[locale],
              result: commonUi.result[locale],
              detail: commonUi.detailAge[locale]
            }
          : {
              startDate: fieldUi.startDate[locale],
              endDate: fieldUi.endDate[locale],
              result: commonUi.result[locale],
              detail: commonUi.detailDays[locale]
            }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ ${age ? 'birthDate: z.string().min(10)' : 'startDate: z.string().min(10), endDate: z.string().min(10)'} });\nexport const ${c}OutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  ${age ? 'const birthDate = new Date(parsed.birthDate); const today = new Date(); let result = today.getFullYear() - birthDate.getFullYear(); const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate()); if (!hasBirthdayPassed) result -= 1; return ' + c + 'OutputSchema.parse({ result, formatted: String(result), detail: "Exact age in years" });' : 'const startDate = new Date(parsed.startDate); const endDate = new Date(parsed.endDate); const result = Math.round((endDate.getTime() - startDate.getTime()) / 86400000); return ' + c + 'OutputSchema.parse({ result, formatted: String(result), detail: "Difference in days" });'}\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [form, setForm] = useState({ ${age ? 'birthDate: "1990-05-15"' : 'startDate: "2025-01-01", endDate: "2025-01-31"'} });\n  const result = useMemo(() => run${p}({ ${age ? 'birthDate: form.birthDate' : 'startDate: form.startDate, endDate: form.endDate'} }), [form]);\n  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }\n  return (\n    <div className="space-y-5">\n${age ? `      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-birthDate">{t.birthDate}</label>\n        <input id="${seed.id}-birthDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.birthDate} onChange={(event) => update("birthDate", event.target.value)} />\n      </div>` : `      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-startDate">{t.startDate}</label>\n        <input id="${seed.id}-startDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />\n      </div>\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-endDate">{t.endDate}</label>\n        <input id="${seed.id}-endDate" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} />\n      </div>`}\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>\n        <p className="mt-3 text-3xl font-semibold tracking-tight">{result.formatted}</p>\n        <p className="mt-2 text-sm text-cyan-50/80">{t.detail}</p>\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("returns a valid result", () => {\n    const result = run${p}(${age ? '{ birthDate: "1990-05-15" }' : '{ startDate: "2025-01-01", endDate: "2025-01-31" }'});\n    expect(Number.isFinite(result.result)).toBe(true);\n  });\n});\n`
    };
  }

  if (seed.family === "text-metric") {
    const keywordDensity = seed.variant === "keyword-density";
    const config = {
      "character-counter": {
        cards: ["Characters", "No spaces", "Words"],
        logic:
          'const characters = parsed.text.length; const secondary = parsed.text.replace(/\\s+/g, "").length; const tertiary = parsed.text.trim() ? parsed.text.trim().split(/\\s+/).length : 0; const primary = characters;',
        test: '{ text: "One two" }',
        expect: "expect(result.primary).toBe(7);"
      },
      "line-counter": {
        cards: ["Lines", "Non-empty", "Characters"],
        logic:
          'const lines = parsed.text.split(/\\r?\\n/); const primary = lines.length; const secondary = lines.filter((line) => line.trim().length > 0).length; const tertiary = parsed.text.length;',
        test: '{ text: "one\\ntwo\\nthree" }',
        expect: "expect(result.primary).toBe(3);"
      },
      "sentence-counter": {
        cards: ["Sentences", "Words", "Characters"],
        logic:
          'const primary = parsed.text.split(/[.!?]+/).map((segment) => segment.trim()).filter(Boolean).length; const secondary = parsed.text.trim() ? parsed.text.trim().split(/\\s+/).length : 0; const tertiary = parsed.text.length;',
        test: '{ text: "One. Two! Three?" }',
        expect: "expect(result.primary).toBe(3);"
      },
      "reading-time": {
        cards: ["Minutes", "Words", "Characters"],
        logic:
          'const words = parsed.text.trim() ? parsed.text.trim().split(/\\s+/).length : 0; const primary = Number((words / 200).toFixed(2)); const secondary = words; const tertiary = parsed.text.length;',
        test: '{ text: "one two three four five six seven eight nine ten" }',
        expect: "expect(result.secondary).toBe(10);"
      }
    } as const;

    if (keywordDensity) {
      const labels = Object.fromEntries(
        locales.map((locale) => [
          locale,
          {
            text: commonUi.text[locale],
            keyword: commonUi.keyword[locale],
            density: commonUi.density[locale],
            occurrences: commonUi.occurrences[locale],
            totalWords: commonUi.totalWords[locale]
          }
        ])
      );
      return {
        schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({\n  text: z.string().min(1, "Enter text to analyze."),\n  keyword: z.string().min(1, "Enter a keyword.")\n});\nexport const ${c}OutputSchema = z.object({\n  primary: z.number(),\n  secondary: z.number(),\n  tertiary: z.number(),\n  formatted: z.string()\n});\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
        logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  const words = parsed.text.trim().toLowerCase().split(/\\s+/).filter(Boolean);\n  const keyword = parsed.keyword.trim().toLowerCase();\n  const secondary = keyword ? words.filter((word) => word === keyword).length : 0;\n  const tertiary = words.length;\n  const primary = tertiary === 0 ? 0 : Number(((secondary / tertiary) * 100).toFixed(2));\n  return ${c}OutputSchema.parse({ primary, secondary, tertiary, formatted: primary.toFixed(2) + "%" });\n}\n\nexport const toolLogic = run${p};\n`,
        component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [text, setText] = useState("SEO tools improve organic traffic when each keyword appears naturally in the text. SEO content should stay readable.");\n  const [keyword, setKeyword] = useState("seo");\n  const result = useMemo(() => run${p}({ text, keyword }), [text, keyword]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-text">{t.text}</label>\n        <textarea id="${seed.id}-text" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />\n      </div>\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-keyword">{t.keyword}</label>\n        <input id="${seed.id}-keyword" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={keyword} onChange={(event) => setKeyword(event.target.value)} />\n      </div>\n      <div className="grid gap-3 sm:grid-cols-3">\n        <MetricCard label={t.density} value={result.formatted} />\n        <MetricCard label={t.occurrences} value={String(result.secondary)} />\n        <MetricCard label={t.totalWords} value={String(result.tertiary)} />\n      </div>\n    </div>\n  );\n}\n\nfunction MetricCard({ label, value }: { label: string; value: string }) {\n  return (\n    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">\n      <p className="text-sm text-white/60">{label}</p>\n      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>\n    </div>\n  );\n}\n`,
        test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("calculates keyword density", () => {\n    const result = run${p}({ text: "seo tools and more seo content", keyword: "seo" });\n    expect(result.secondary).toBe(2);\n    expect(result.tertiary).toBe(6);\n  });\n});\n`
      };
    }

    const metricConfig = config[seed.variant as keyof typeof config];
    const [labelOne, labelTwo, labelThree] = metricConfig.cards;
    const cardTranslations = {
      Characters: { en: "Characters", pl: "Znaki", es: "Caracteres", de: "Zeichen", fr: "Caracteres" },
      "No spaces": { en: "No spaces", pl: "Bez spacji", es: "Sin espacios", de: "Ohne Leerzeichen", fr: "Sans espaces" },
      Words: { en: "Words", pl: "Slowa", es: "Palabras", de: "Woerter", fr: "Mots" },
      Lines: { en: "Lines", pl: "Linie", es: "Lineas", de: "Zeilen", fr: "Lignes" },
      "Non-empty": { en: "Non-empty", pl: "Niepuste", es: "No vacias", de: "Nicht leer", fr: "Non vides" },
      Sentences: { en: "Sentences", pl: "Zdania", es: "Frases", de: "Saetze", fr: "Phrases" },
      Minutes: { en: "Minutes", pl: "Minuty", es: "Minutos", de: "Minuten", fr: "Minutes" }
    } as const;
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          text: commonUi.text[locale],
          labelOne: cardTranslations[labelOne as keyof typeof cardTranslations][locale],
          labelTwo: cardTranslations[labelTwo as keyof typeof cardTranslations][locale],
          labelThree: cardTranslations[labelThree as keyof typeof cardTranslations][locale]
        }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ text: z.string().min(1, "Enter text to analyze.") });\nexport const ${c}OutputSchema = z.object({ primary: z.number(), secondary: z.number(), tertiary: z.number(), formatted: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  ${metricConfig.logic}\n  return ${c}OutputSchema.parse({ primary, secondary, tertiary, formatted: String(primary) });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [text, setText] = useState("Write or paste text here to analyze the content instantly.");\n  const result = useMemo(() => run${p}({ text }), [text]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-text">{t.text}</label>\n        <textarea id="${seed.id}-text" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />\n      </div>\n      <div className="grid gap-3 sm:grid-cols-3">\n        <MetricCard label={t.labelOne} value={String(result.primary)} />\n        <MetricCard label={t.labelTwo} value={String(result.secondary)} />\n        <MetricCard label={t.labelThree} value={String(result.tertiary)} />\n      </div>\n    </div>\n  );\n}\n\nfunction MetricCard({ label, value }: { label: string; value: string }) {\n  return (\n    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">\n      <p className="text-sm text-white/60">{label}</p>\n      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("returns the expected metric", () => {\n    const result = run${p}(${metricConfig.test});\n    ${metricConfig.expect}\n  });\n});\n`
    };
  }

  if (seed.family === "text-transform") {
    if (seed.variant === "case-converter") {
      const labels = Object.fromEntries(
        locales.map((locale) => [
          locale,
          {
            text: commonUi.text[locale],
            upper: commonUi.upperCaseResult[locale],
            lower: commonUi.lowerCaseResult[locale],
            title: commonUi.titleCaseResult[locale],
            sentence: commonUi.sentenceCaseResult[locale]
          }
        ])
      );
      return {
        schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ text: z.string().min(1, "Enter text to convert.") });\nexport const ${c}OutputSchema = z.object({ upper: z.string(), lower: z.string(), title: z.string(), sentence: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
        logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nfunction toTitleCase(value: string) {\n  return value.toLowerCase().replace(/\\b\\w/g, (char) => char.toUpperCase());\n}\n\nfunction toSentenceCase(value: string) {\n  const lower = value.toLowerCase();\n  return lower.charAt(0).toUpperCase() + lower.slice(1);\n}\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  return ${c}OutputSchema.parse({\n    upper: parsed.text.toUpperCase(),\n    lower: parsed.text.toLowerCase(),\n    title: toTitleCase(parsed.text),\n    sentence: toSentenceCase(parsed.text)\n  });\n}\n\nexport const toolLogic = run${p};\n`,
        component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [text, setText] = useState("best seo tool page title");\n  const result = useMemo(() => run${p}({ text }), [text]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-text">{t.text}</label>\n        <textarea id="${seed.id}-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />\n      </div>\n      <div className="grid gap-3 sm:grid-cols-2">\n        <ResultCard label={t.upper} value={result.upper} />\n        <ResultCard label={t.lower} value={result.lower} />\n        <ResultCard label={t.title} value={result.title} />\n        <ResultCard label={t.sentence} value={result.sentence} />\n      </div>\n    </div>\n  );\n}\n\nfunction ResultCard({ label, value }: { label: string; value: string }) {\n  return (\n    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">\n      <p className="text-sm text-white/60">{label}</p>\n      <p className="mt-2 break-words text-base font-medium text-white">{value}</p>\n    </div>\n  );\n}\n`,
        test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("returns multiple case variants", () => {\n    const result = run${p}({ text: "hello world" });\n    expect(result.upper).toBe("HELLO WORLD");\n    expect(result.title).toBe("Hello World");\n  });\n});\n`
      };
    }

    const transformMap: Record<string, { expression: string; testInput: string; expected: string }> = {
      "slug-generator": {
        expression:
          'const result = parsed.text.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");',
        testInput: "Best SEO Tool Page Title",
        expected: "best-seo-tool-page-title"
      },
      "text-reverser": {
        expression: "const result = parsed.text.split(\"\").reverse().join(\"\");",
        testInput: "utility",
        expected: "ytilitu"
      },
      "remove-extra-spaces": {
        expression: 'const result = parsed.text.replace(/\\s+/g, " ").trim();',
        testInput: "text   with   spaces",
        expected: "text with spaces"
      },
      "base64-encoder": {
        expression:
          'const bytes = new TextEncoder().encode(parsed.text); let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); const result = btoa(binary);',
        testInput: "hello world",
        expected: "aGVsbG8gd29ybGQ="
      },
      "base64-decoder": {
        expression:
          'let result = ""; try { const binary = atob(parsed.text); const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0)); result = new TextDecoder().decode(bytes); } catch { result = ""; }',
        testInput: "aGVsbG8gd29ybGQ=",
        expected: "hello world"
      },
      "url-encoder": {
        expression: "const result = encodeURIComponent(parsed.text);",
        testInput: "hello world?x=1&y=2",
        expected: "hello%20world%3Fx%3D1%26y%3D2"
      },
      "url-decoder": {
        expression: 'let result = ""; try { result = decodeURIComponent(parsed.text); } catch { result = ""; }',
        testInput: "hello%20world%3Fx%3D1%26y%3D2",
        expected: "hello world?x=1&y=2"
      }
    };

    const transform = transformMap[seed.variant];
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          input: commonUi.input[locale],
          result: commonUi.result[locale]
        }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });\nexport const ${c}OutputSchema = z.object({ result: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  ${transform.expression}\n  return ${c}OutputSchema.parse({ result });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [text, setText] = useState(${JSON.stringify(transform.testInput)});\n  const result = useMemo(() => run${p}({ text }), [text]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-text">{t.input}</label>\n        <textarea id="${seed.id}-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.result}</p>\n        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-sm text-white/90">{result.result}</pre>\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("transforms text", () => {\n    const result = run${p}({ text: ${JSON.stringify(transform.testInput)} });\n    expect(result.result).toBe(${JSON.stringify(transform.expected)});\n  });\n});\n`
    };
  }

  if (seed.family === "json") {
    const validator = seed.variant === "json-validator";
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          json: commonUi.json[locale],
          statusValid: commonUi.statusValid[locale],
          statusInvalid: commonUi.statusInvalid[locale],
          validMessage: validator ? commonUi.validJson[locale] : commonUi.jsonMinified[locale]
        }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ source: z.string().min(1, "Enter JSON to process.") });\nexport const ${c}OutputSchema = z.object({ valid: z.boolean(), result: z.string(), message: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  try {\n    const data = JSON.parse(parsed.source);\n    return ${c}OutputSchema.parse({\n      valid: true,\n      result: ${validator ? "JSON.stringify(data, null, 2)" : "JSON.stringify(data)"},\n      message: ${validator ? '"Valid JSON"' : '"JSON minified successfully"'}\n    });\n  } catch (error) {\n    const message = error instanceof Error ? error.message : "Invalid JSON";\n    return ${c}OutputSchema.parse({ valid: false, result: "", message });\n  }\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [source, setSource] = useState(\`{\n  "name": "tool",\n  "value": 1,\n  "items": [1, 2, 3]\n}\`);\n  const result = useMemo(() => run${p}({ source }), [source]);\n  const message = result.valid ? t.validMessage : result.message;\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-source">{t.json}</label>\n        <textarea id="${seed.id}-source" className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-300/50" value={source} onChange={(event) => setSource(event.target.value)} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{result.valid ? t.statusValid : t.statusInvalid}</p>\n        <p className="mt-3 text-sm text-white/80">{message}</p>\n        {result.result ? <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-sm text-white/90">{result.result}</pre> : null}\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("processes valid JSON", () => {\n    const result = run${p}({ source: '{"name":"tool","value":1}' });\n    expect(result.valid).toBe(true);\n  });\n});\n`
    };
  }

  if (seed.variant === "password-generator") {
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          length: commonUi.length[locale],
          uppercase: commonUi.uppercase[locale],
          lowercase: commonUi.lowercase[locale],
          numbers: commonUi.numbers[locale],
          symbols: commonUi.symbols[locale],
          generatedPassword: commonUi.generatedPassword[locale]
        }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({\n  length: z.coerce.number().int().min(4).max(64),\n  uppercase: z.boolean().default(true),\n  lowercase: z.boolean().default(true),\n  numbers: z.boolean().default(true),\n  symbols: z.boolean().default(false)\n});\nexport const ${c}OutputSchema = z.object({ password: z.string(), length: z.number() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nconst groups = {\n  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",\n  lowercase: "abcdefghijkmnopqrstuvwxyz",\n  numbers: "23456789",\n  symbols: "!@#$%^&*()-_=+?"\n} as const;\n\nfunction randomIndex(limit: number) {\n  if (globalThis.crypto?.getRandomValues) {\n    const values = new Uint32Array(1);\n    globalThis.crypto.getRandomValues(values);\n    return values[0] % limit;\n  }\n  return Math.floor(Math.random() * limit);\n}\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  const charset = [parsed.uppercase ? groups.uppercase : "", parsed.lowercase ? groups.lowercase : "", parsed.numbers ? groups.numbers : "", parsed.symbols ? groups.symbols : ""].join("") || groups.lowercase;\n  let password = "";\n  for (let index = 0; index < parsed.length; index += 1) {\n    password += charset[randomIndex(charset.length)];\n  }\n  return ${c}OutputSchema.parse({ password, length: password.length });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [length, setLength] = useState("16");\n  const [uppercase, setUppercase] = useState(true);\n  const [lowercase, setLowercase] = useState(true);\n  const [numbers, setNumbers] = useState(true);\n  const [symbols, setSymbols] = useState(false);\n  const result = useMemo(() => run${p}({ length: Number(length || 16), uppercase, lowercase, numbers, symbols }), [length, uppercase, lowercase, numbers, symbols]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-length">{t.length}</label>\n        <input id="${seed.id}-length" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" min="4" max="64" value={length} onChange={(event) => setLength(event.target.value)} />\n      </div>\n      <div className="grid gap-3 sm:grid-cols-2">\n        <Toggle checked={uppercase} label={t.uppercase} onChange={setUppercase} />\n        <Toggle checked={lowercase} label={t.lowercase} onChange={setLowercase} />\n        <Toggle checked={numbers} label={t.numbers} onChange={setNumbers} />\n        <Toggle checked={symbols} label={t.symbols} onChange={setSymbols} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.generatedPassword}</p>\n        <p className="mt-3 break-all font-mono text-lg text-white">{result.password}</p>\n      </div>\n    </div>\n  );\n}\n\nfunction Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {\n  return (\n    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">\n      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />\n      <span>{label}</span>\n    </label>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("creates a password with the requested length", () => {\n    const result = run${p}({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false });\n    expect(result.password).toHaveLength(20);\n  });\n});\n`
    };
  }

  if (seed.variant === "uuid-generator") {
    const labels = Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          count: commonUi.count[locale],
          uuidValues: commonUi.uuidValues[locale]
        }
      ])
    );
    return {
      schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ count: z.coerce.number().int().min(1).max(10).default(1) });\nexport const ${c}OutputSchema = z.object({ values: z.array(z.string()), formatted: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
      logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nfunction fallbackUuid() {\n  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {\n    const random = Math.floor(Math.random() * 16);\n    const value = char === "x" ? random : (random & 0x3) | 0x8;\n    return value.toString(16);\n  });\n}\n\nexport function run${p}(input: ${p}Input): ${p}Output {\n  const parsed = ${c}InputSchema.parse(input);\n  const values = Array.from({ length: parsed.count }, () => globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : fallbackUuid());\n  return ${c}OutputSchema.parse({ values, formatted: values.join("\\n") });\n}\n\nexport const toolLogic = run${p};\n`,
      component: `"use client";\n\nimport { useMemo, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [count, setCount] = useState("1");\n  const result = useMemo(() => run${p}({ count: Number(count || 1) }), [count]);\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-count">{t.count}</label>\n        <input id="${seed.id}-count" className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" type="number" min="1" max="10" value={count} onChange={(event) => setCount(event.target.value)} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.uuidValues}</p>\n        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-white/90">{result.formatted}</pre>\n      </div>\n    </div>\n  );\n}\n`,
      test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("creates the requested number of UUIDs", () => {\n    const result = run${p}({ count: 2 });\n    expect(result.values).toHaveLength(2);\n  });\n});\n`
    };
  }

  const labels = Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        text: commonUi.text[locale],
        sha256Hash: commonUi.sha256Hash[locale]
      }
    ])
  );
  return {
    schema: `import { z } from "zod";\n\nexport const ${c}InputSchema = z.object({ text: z.string().min(1, "Enter text to hash.") });\nexport const ${c}OutputSchema = z.object({ hash: z.string() });\nexport const toolInputSchema = ${c}InputSchema;\nexport const toolOutputSchema = ${c}OutputSchema;\nexport type ${p}Input = z.infer<typeof ${c}InputSchema>;\nexport type ${p}Output = z.infer<typeof ${c}OutputSchema>;\n`,
    logic: `import { ${c}InputSchema, ${c}OutputSchema, type ${p}Input, type ${p}Output } from "@/tools/schema/${seed.id}";\n\nexport async function run${p}(input: ${p}Input): Promise<${p}Output> {\n  const parsed = ${c}InputSchema.parse(input);\n  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(parsed.text));\n  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");\n  return ${c}OutputSchema.parse({ hash });\n}\n\nexport const toolLogic = run${p};\n`,
    component: `"use client";\n\nimport { useEffect, useState } from "react";\nimport { useLocale } from "next-intl";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\nconst labels = ${jsonLiteral(labels)} as const;\n\nexport default function ${p}Tool() {\n  const locale = useLocale() as keyof typeof labels;\n  const t = labels[locale] ?? labels.en;\n  const [text, setText] = useState("hash this text");\n  const [hash, setHash] = useState("");\n\n  useEffect(() => {\n    let active = true;\n    async function compute() {\n      const result = await run${p}({ text });\n      if (active) {\n        setHash(result.hash);\n      }\n    }\n    void compute();\n    return () => {\n      active = false;\n    };\n  }, [text]);\n\n  return (\n    <div className="space-y-5">\n      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${seed.id}-text">{t.text}</label>\n        <textarea id="${seed.id}-text" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50" value={text} onChange={(event) => setText(event.target.value)} />\n      </div>\n      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">\n        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{t.sha256Hash}</p>\n        <p className="mt-3 break-all font-mono text-sm text-white/90">{hash}</p>\n      </div>\n    </div>\n  );\n}\n`,
    test: `import { describe, expect, it } from "vitest";\nimport { run${p} } from "@/tools/logic/${seed.id}";\n\ndescribe("${seed.id}", () => {\n  it("generates a SHA256 hash", async () => {\n    const result = await run${p}({ text: "hello world" });\n    expect(result.hash).toHaveLength(64);\n  });\n});\n`
  };
}

async function writeSeed(seed: Seed) {
  const cwd = process.cwd();
  const files = fileParts(seed);

  await writeJson(
    path.join(cwd, "src", "data", "tools", "definitions", `${seed.id}.json`),
    record(seed)
  );

  await Promise.all(
    locales.map((locale) =>
      writeJson(
        path.join(cwd, "src", "data", "tools", "content", locale, `${seed.id}.json`),
        content(seed, locale)
      )
    )
  );

  await Promise.all([
    writeFileSafe(path.join(cwd, "src", "tools", "schema", `${seed.id}.ts`), files.schema),
    writeFileSafe(path.join(cwd, "src", "tools", "logic", `${seed.id}.ts`), files.logic),
    writeFileSafe(
      path.join(cwd, "src", "components", "tools", `${seed.id}-tool.tsx`),
      files.component
    ),
    writeFileSafe(
      path.join(cwd, "src", "tools", "tests", `${seed.id}.test.ts`),
      files.test
    )
  ]);
}

async function main() {
  for (const seed of seeds) {
    await writeSeed(seed);
  }

  await syncGeneratedArtifacts();
  console.log(`Seeded ${seeds.length} tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
