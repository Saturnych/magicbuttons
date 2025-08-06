export type SharedStore = {
	valueType: string;
	methods?: Record<string, Function>;
};

export type BrowserTheme = 'light' | 'dark' | 'system' | null;
