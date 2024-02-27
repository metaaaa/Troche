export async function AudioFileSelect(): Promise<string> {
    const filePath = await window.myAPI.openFileDialog();
    return filePath;
}

export async function AudioFilesSelect(): Promise<Array<string>> {
    const filePaths = await window.myAPI.openFilesDialog();
    return filePaths;
}

export function getFileNameFromPath(filePath: string): string {
    return filePath.split('\\').pop() || '';
}
