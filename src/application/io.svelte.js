
import JSZip from "jszip"
import ParseDDS from "parse-dds"


function base64ToArrayBuffer(dataURL) {
    // Remove the Data URL prefix to isolate the Base64 string
    const base64 = dataURL.split(',')[1];
    // Decode the Base64 string into binary data
    const binaryString = atob(base64);
    // Create an ArrayBuffer
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return arrayBuffer;
}
function LoadImage(file) {
    return new Promise((resolve, reject) => {

        if (typeof file === 'string') {
            const image = new Image();
            image.src = file;

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                reject(new Error('Failed to load image from string'+file));
            };
            return
        } 

        if (!(file instanceof File)) {
            reject(new Error("Input must be a File object"));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            load(reader.result)
        };

        function load(blob){
            if (file.name.endsWith('.dds')) {
                const data = base64ToArrayBuffer(blob)
                const container =ParseDDS(data)
                const dds = container.images[0]
                const buffer = new Uint8Array(data, dds.offset, dds.length)
                const format = container.format
                const width = dds.shape[0]
                const height = dds.shape[1]
                resolve({width,height,format, buffer})
            }
            else{
                const image = new Image();
                image.name = file.name
                image.src = blob;
                image.onload = () => {
                    resolve(image);
                };
    
                image.onerror = () => {
                    resolve();
                };
            }
        }

        reader.onerror = () => {
            resolve();
        };

        reader.readAsDataURL(file);
    });
}


export { LoadImage }