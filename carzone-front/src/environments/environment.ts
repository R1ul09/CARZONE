export interface Environment {
    production: boolean;
    apiUrl: string;
}

export const environment = {
    production: false,
    apiUrl: '/api'
} as const;