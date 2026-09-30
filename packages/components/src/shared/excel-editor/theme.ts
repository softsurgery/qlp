import { greenTheme, type Theme, type ThemeService } from "@univerjs/presets";
import type { ICanvasColorService } from "@univerjs/engine-render";

type Rgb = [number, number, number];
type Hsl = { h: number; s: number; l: number };
type ParsedColor = { rgb: Rgb; alpha: number };

export type ExcelThemeTokens = {
  background: Rgb;
  foreground: Rgb;
  border: Rgb;
  muted: Rgb;
  primary: Rgb;
  accentHue: number;
  neutralHue: number;
};

export type ExcelCellPaint = {
  ink?: string;
  paper?: string;
  inkFollowsTheme: boolean;
};

const DEFAULT_INK = "000000";
const DEFAULT_PAPER = "ffffff";
const NEUTRAL_SATURATION = 0.12;
const ADAPTED_CONTRAST = 4.5;
const RESCUE_CONTRAST = 2.2;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function channelToHex(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

function rgbToHex(rgb: Rgb, alpha = 1) {
  const hex = `#${rgb.map(channelToHex).join("")}`;
  return alpha >= 0.999 ? hex : `${hex}${channelToHex(alpha * 255)}`;
}

function rgbToHsl([r, g, b]: Rgb): Hsl {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === red) h = (green - blue) / d + (green < blue ? 6 : 0);
  else if (max === green) h = (blue - red) / d + 2;
  else h = (red - green) / d + 4;
  return { h: h * 60, s, l };
}

function hueToChannel(p: number, q: number, t: number) {
  let tone = t;
  if (tone < 0) tone += 1;
  if (tone > 1) tone -= 1;
  if (tone < 1 / 6) return p + (q - p) * 6 * tone;
  if (tone < 1 / 2) return q;
  if (tone < 2 / 3) return p + (q - p) * (2 / 3 - tone) * 6;
  return p;
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  if (s <= 0) {
    const channel = l * 255;
    return [channel, channel, channel];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (((h % 360) + 360) % 360) / 360;
  return [
    hueToChannel(p, q, hue + 1 / 3) * 255,
    hueToChannel(p, q, hue) * 255,
    hueToChannel(p, q, hue - 1 / 3) * 255,
  ];
}

function relativeLuminance([r, g, b]: Rgb) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(a: Rgb, b: Rgb) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
  );
}

function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  const t = clamp(amount);
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

function parseExcelColor(value?: string | null): ParsedColor | undefined {
  if (!value) return undefined;
  const raw = value.trim().toLowerCase();
  if (!raw || raw === "transparent" || raw === "none" || raw === "auto") {
    return undefined;
  }
  if (raw === "black") return { rgb: [0, 0, 0], alpha: 1 };
  if (raw === "white") return { rgb: [255, 255, 255], alpha: 1 };

  const functional = raw.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+%?))?\s*\)/i,
  );
  if (functional) {
    const rawAlpha = functional[4];
    const alpha =
      rawAlpha == null
        ? 1
        : rawAlpha.endsWith("%")
          ? Number(rawAlpha.slice(0, -1)) / 100
          : Number(rawAlpha);
    return {
      rgb: [
        Number(functional[1]),
        Number(functional[2]),
        Number(functional[3]),
      ],
      alpha: Number.isFinite(alpha) ? clamp(alpha) : 1,
    };
  }

  const hex = raw.replace(/^#/, "");
  if (/^[0-9a-f]{3}$/.test(hex)) {
    return {
      rgb: [...hex].map((char) => Number.parseInt(char + char, 16)) as Rgb,
      alpha: 1,
    };
  }
  if (/^[0-9a-f]{6}$/.test(hex) || /^[0-9a-f]{8}$/.test(hex)) {
    return {
      rgb: [0, 2, 4].map((offset) =>
        Number.parseInt(hex.slice(offset, offset + 2), 16),
      ) as Rgb,
      alpha:
        hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }
  return undefined;
}

function isNamedDefault(
  color: string,
  hex: string | undefined,
  expected: string,
) {
  if (hex) return hex === expected;
  const raw = color.trim().toLowerCase();
  return !raw || raw === "transparent" || raw === "none" || raw === "auto";
}

function colorHex(value?: string | null) {
  return parseExcelColor(value)?.rgb.map(channelToHex).join("");
}

export function isDefaultExcelInk(color?: string | null) {
  if (!color) return true;
  return isNamedDefault(color, colorHex(color), DEFAULT_INK);
}

export function isDefaultExcelPaper(color?: string | null) {
  if (!color) return true;
  return isNamedDefault(color, colorHex(color), DEFAULT_PAPER);
}

function readCssHsl(name: string): Hsl | undefined {
  if (typeof document === "undefined") return undefined;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return undefined;
  const match = raw
    .replace(/hsla?\(/i, "")
    .replace(/[()]/g, "")
    .match(/^(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?/);
  if (!match) return undefined;
  return {
    h: Number(match[1]),
    s: Number(match[2]) / 100,
    l: Number(match[3]) / 100,
  };
}

const FALLBACK_TOKENS = {
  light: {
    "--background": { h: 0, s: 0, l: 1 },
    "--foreground": { h: 160, s: 0.3, l: 0.1 },
    "--border": { h: 160, s: 0.15, l: 0.9 },
    "--muted": { h: 160, s: 0.1, l: 0.96 },
    "--primary": { h: 158, s: 0.64, l: 0.28 },
  },
  dark: {
    "--background": { h: 160, s: 0.2, l: 0.08 },
    "--foreground": { h: 0, s: 0, l: 0.98 },
    "--border": { h: 160, s: 0.12, l: 0.18 },
    "--muted": { h: 160, s: 0.14, l: 0.16 },
    "--primary": { h: 158, s: 0.64, l: 0.4 },
  },
} satisfies Record<"light" | "dark", Record<string, Hsl>>;

type TokenName = keyof (typeof FALLBACK_TOKENS)["light"];
export type ExcelColorScheme = "light" | "dark";

export function documentExcelColorScheme(): ExcelColorScheme {
  return typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function token(name: TokenName, scheme: ExcelColorScheme): Hsl {
  if (documentExcelColorScheme() === scheme) {
    return readCssHsl(name) ?? FALLBACK_TOKENS[scheme][name];
  }
  return FALLBACK_TOKENS[scheme][name];
}

function hueOf(color: Hsl, fallback: number) {
  return color.s >= 0.05 && Number.isFinite(color.h) ? color.h : fallback;
}

export function readExcelThemeTokens(
  scheme: ExcelColorScheme = documentExcelColorScheme(),
): ExcelThemeTokens {
  const background = token("--background", scheme);
  const foreground = token("--foreground", scheme);
  const border = token("--border", scheme);
  const muted = token("--muted", scheme);
  const primary = token("--primary", scheme);
  const accentHue = hueOf(primary, 158);
  return {
    background: hslToRgb(background),
    foreground: hslToRgb(foreground),
    border: hslToRgb(border),
    muted: hslToRgb(muted),
    primary: hslToRgb(primary),
    accentHue,
    neutralHue: hueOf(background, hueOf(border, accentHue)),
  };
}

function shade(hue: number, sat: number, light: number) {
  return rgbToHex(hslToRgb({ h: hue, s: clamp(sat), l: clamp(light) }));
}

function scale(hue: number, sat: number, lights: number[]) {
  const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  return Object.fromEntries(
    keys.map((key, index) => [key, shade(hue, sat, lights[index]!)]),
  ) as Theme["primary"];
}

export function buildExcelUniverTheme(): Theme {
  const tokens = readExcelThemeTokens();
  const primary = rgbToHsl(tokens.primary);
  const accentHue = tokens.accentHue;
  const neutralHue = tokens.neutralHue;

  return {
    ...greenTheme,
    white: rgbToHex(tokens.background),
    black: rgbToHex(tokens.foreground),
    primary: scale(accentHue, Math.max(primary.s, 0.45), [
      0.97, 0.93, 0.86, 0.74, 0.58, 0.44, 0.34, 0.28, 0.22, 0.16,
    ]),
    gray: scale(neutralHue, 0.1, [
      0.98, 0.96, 0.9, 0.7, 0.55, 0.4, 0.28, 0.2, 0.14, 0.1,
    ]),
    green: scale(accentHue, Math.max(primary.s, 0.4), [
      0.97, 0.93, 0.85, 0.68, 0.5, 0.4, 0.32, 0.26, 0.2, 0.15,
    ]),
    "loop-color": { ...greenTheme["loop-color"], 8: "gray.400" },
  };
}

function adaptForDark(rgb: Rgb, tokens: ExcelThemeTokens): Rgb {
  const { h, s, l } = rgbToHsl(rgb);

  if (s < NEUTRAL_SATURATION) {
    if (l >= 0.92) return tokens.background;
    if (l <= 0.08) return tokens.foreground;
    if (l >= 0.62) return mixRgb(tokens.border, tokens.muted, 0.35);
    return hslToRgb({ h: tokens.neutralHue, s: 0.06, l: 0.28 + l * 0.5 });
  }
  if (l >= 0.72) {
    return hslToRgb({
      h,
      s: clamp(s * 0.85, 0, 0.72),
      l: 0.22 + (l - 0.72) * 0.35,
    });
  }
  if (l <= 0.28) {
    return hslToRgb({ h, s: clamp(s * 1.05, 0, 0.85), l: 0.42 + l * 0.7 });
  }
  return hslToRgb({ h, s, l: clamp(l + 0.06) });
}

function ensureReadable(
  ink: Rgb,
  paper: Rgb,
  tokens: ExcelThemeTokens,
  minimum: number,
): Rgb {
  if (contrastRatio(ink, paper) >= minimum) return ink;
  const { h, s } = rgbToHsl(ink);
  const paperIsDark = relativeLuminance(paper) < 0.4;
  const retoned = hslToRgb({
    h,
    s: Math.max(s, 0.08),
    l: paperIsDark ? 0.86 : 0.16,
  });
  if (contrastRatio(retoned, paper) >= minimum) return retoned;
  return contrastRatio(tokens.foreground, paper) >=
    contrastRatio(tokens.background, paper)
    ? tokens.foreground
    : tokens.background;
}

function resolvePaper(
  color: string | undefined,
  isDark: boolean,
  tokens: ExcelThemeTokens,
): ParsedColor | undefined {
  if (isDefaultExcelPaper(color)) return undefined;
  const parsed = parseExcelColor(color);
  if (!parsed) return undefined;
  if (!isDark) return parsed;
  return { rgb: adaptForDark(parsed.rgb, tokens), alpha: parsed.alpha };
}

export function resolveExcelCellColors(
  cell: { color?: string; background?: string },
  isDark: boolean,
  tokens: ExcelThemeTokens = readExcelThemeTokens(),
): ExcelCellPaint {
  const paper = resolvePaper(cell.background, isDark, tokens);
  const paint = paper ? rgbToHex(paper.rgb, paper.alpha) : undefined;
  const surface = paper?.rgb ?? tokens.background;

  if (isDefaultExcelInk(cell.color)) {
    if (!paper) {
      return { inkFollowsTheme: true };
    }
    return {
      ink: rgbToHex(
        ensureReadable(tokens.foreground, surface, tokens, ADAPTED_CONTRAST),
      ),
      paper: paint,
      inkFollowsTheme: false,
    };
  }

  const authored = parseExcelColor(cell.color);
  if (!authored) {
    if (!paper) return { inkFollowsTheme: true };
    return {
      ink: rgbToHex(
        ensureReadable(tokens.foreground, surface, tokens, ADAPTED_CONTRAST),
      ),
      paper: paint,
      inkFollowsTheme: false,
    };
  }
  const toned = isDark ? adaptForDark(authored.rgb, tokens) : authored.rgb;
  const ink = ensureReadable(
    toned,
    surface,
    tokens,
    isDark ? ADAPTED_CONTRAST : RESCUE_CONTRAST,
  );
  return {
    ink: rgbToHex(ink, authored.alpha),
    paper: paint,
    inkFollowsTheme: false,
  };
}

export function createExcelCanvasColorService(
  themeService: ThemeService,
): ICanvasColorService {
  const cache = new Map<string, string>();
  let palette: { darkMode: boolean; tokens: ExcelThemeTokens } | null = null;

  const currentTokens = () => {
    if (!palette || palette.darkMode !== themeService.darkMode) {
      palette = {
        darkMode: themeService.darkMode,
        tokens: readExcelThemeTokens(
          themeService.darkMode ? "dark" : "light",
        ),
      };
      cache.clear();
    }
    return palette.tokens;
  };

  return {
    getRenderColor(color: string) {
      if (themeService.isValidThemeColor(color)) {
        return themeService.getColorFromTheme(color);
      }
      const tokens = currentTokens();
      if (!themeService.darkMode) return color;
      const cached = cache.get(color);
      if (cached) return cached;
      const parsed = parseExcelColor(color);
      if (!parsed) return color;
      const next = rgbToHex(adaptForDark(parsed.rgb, tokens), parsed.alpha);
      cache.set(color, next);
      return next;
    },
  };
}
