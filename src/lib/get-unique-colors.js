

function getUniqueColors(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const uniqueColors = [];
    
    const colorDistance = (color1, color2) => {
        const dr = color1.r - color2.r;
        const dg = color1.g - color2.g;
        const db = color1.b - color2.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    const getNeighbors = (x, y, radius) => {
        const neighbors = [];
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                        neighbors.push({ x: nx, y: ny });
                    }
                }
            }
        }
        return neighbors;
    };

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            const currentColor = { r, g, b };

            let isUnique = true

            if (isUnique) {
                for (const uniqueColor of uniqueColors) {
                    if (colorDistance(currentColor, uniqueColor) == 0) {
                        isUnique = false;
                        break;
                    }
                }
            }

            if (isUnique) {
            
                for (const { x: nx, y: ny } of getNeighbors(x, y, 5)) {
                    const ni = (ny * canvas.width + nx) * 4;
                    const nr = data[ni];
                    const ng = data[ni + 1];
                    const nb = data[ni + 2];
                    const neighborColor = { r: nr, g: ng, b: nb };

                    if (colorDistance(currentColor, neighborColor) != 0) {
                        isUnique = false;
                        break;
                    }
                }
            }

            if (isUnique) {
                uniqueColors.push(currentColor);
            }
        }
    }

    return uniqueColors.map(({r, g, b}) => [r, g, b]);
}

export { getUniqueColors }