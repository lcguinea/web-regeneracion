export const CATEGORIES = ['Filosofia', 'Historia', 'Simbolismo', 'Arte', 'Sociedad', 'Masoneria'] as const;
export type Category = (typeof CATEGORIES)[number];
