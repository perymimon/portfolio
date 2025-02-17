export async function fetchArrayBuffer(filename){
    return fetch(`./${filename}`)
        .then(response => response.arrayBuffer())
}

export function loadBlob(blob) {
    if (blob instanceof File) {
        // Handle file input
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(blob);
        });
    } else if (blob instanceof ArrayBuffer) {
        // Handle ArrayBuffer (e.g., from fetch)
        return Promise.resolve(new Uint8Array(blob));
    } else {
        return Promise.reject(new Error('Unsupported data type'));
    }
}
export function saveBlob(blob, filename){
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    // clean up
    URL.revokeObjectURL(link.href)
}
export function savedArrayBuffer(buffer, filename = 'file.bin') {
    const blob = new Blob([buffer], {type: 'application/octet-stream'})
    return saveBlob(blob, filename)
}

export function saveString(string, filename = 'file.bin') {
    const blob = new Blob([string], { type: 'text/plain' })
    return saveBlob(blob, filename)
}