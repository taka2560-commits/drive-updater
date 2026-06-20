/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getDefaultPaths: () => Promise<{ desktop: string, documents: string, downloads: string }>;
    selectFolder: () => Promise<{ path: string, name: string } | null>;
    scanDirectory: (dir: string, recursive: boolean, excludeTerms: string[]) => Promise<any[]>;
    readImage: (filePath: string) => Promise<string | null>;
    openFile: (filePath: string) => Promise<string>;
    openFolder: (filePath: string) => Promise<void>;
    startWatch: (dir: string) => void;
    onFileChanged: (callback: (event: any, data: any) => void) => () => void;
  }
}
