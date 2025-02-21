
function fitSize(image, size){
    const rectWidth = size;
    const rectHeight = size;

    // Get the original image dimensions
    const imgWidth = image.width;
    const imgHeight = image.height;

    // Calculate the aspect ratio of the image
    const imgAspectRatio = imgWidth / imgHeight;
    const rectAspectRatio = rectWidth / rectHeight;

    // Determine the dimensions of the image within the rectangle
    let drawWidth, drawHeight;
    if (imgAspectRatio > rectAspectRatio) {
        // Image is wider than the rectangle
        drawWidth = rectWidth;
        drawHeight = rectWidth / imgAspectRatio;
    } else {
        // Image is taller or fits exactly within the rectangle
        drawWidth = rectHeight * imgAspectRatio;
        drawHeight = rectHeight;
    }


    return [drawWidth, drawHeight]
}

export { fitSize }