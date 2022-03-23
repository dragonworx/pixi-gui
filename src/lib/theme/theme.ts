import { Stroke, Fill, Appearance } from 'src/lib/display/style';

export default interface Theme {
  fill: Fill;
  textField: Appearance & {
    color: string;
    padding: number;
  };
  button: Appearance & {
    padding: number;
  };
}

export const defaultTheme: Partial<Theme> = {};

// todo: themes are Partial but default should be Required
const themes: Record<string, Partial<Theme>> = {
  default: defaultTheme,
};

export function getTheme(name: string) {
  if (!themes[name]) {
    throw new Error(`Theme "${name}" not found`);
  }
  return themes[name];
}
