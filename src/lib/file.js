function getExtension(filename){
    return (/[.]/.exec(filename)) ? "." + /[^.]+$/.exec(filename) : undefined;
}

export { getExtension }