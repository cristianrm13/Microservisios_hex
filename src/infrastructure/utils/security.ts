export const blacklistPatterns = [
    /<script>/i,           // XSS básico
    /SELECT .* FROM/i,     // Inyección SQL básica
    /DROP TABLE/i,
    /--/                   // Comentarios SQL
];

export const checkBlacklist = (input: string): boolean => {
    return blacklistPatterns.some((pattern) => pattern.test(input));
};
