export const CSV_FILES = [
    { path: "data/dados_pac001.csv", id: "PAC001" },
    { path: "data/dados_pac002.csv", id: "PAC002" },
    { path: "data/dados_pac003.csv", id: "PAC003" },
] as const

export const CSV_FILE_MAP: Record<string, string> = Object.fromEntries(
    CSV_FILES.map(({ id, path }) => [id, path])
)
