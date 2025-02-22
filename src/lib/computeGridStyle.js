function computeGridStyle (gridElement) {
    
    if (!gridElement) {
        return;
    }

    gridElement.style.gridTemplateRows = null;
    gridElement.style.gridTemplateColumns = null;

    const computedStyle = window.getComputedStyle(gridElement);
    const gridTemplateRows = computedStyle.getPropertyValue('grid-template-rows').trim();
    const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns').trim();

    const rows = gridTemplateRows.split(' ');
    const columns = gridTemplateColumns.split(' ');

    function replaceFr(units, property) {
        const totalFr = units.filter(unit => unit.endsWith('fr'))
            .reduce((sum, fr) => sum + parseFloat(fr), 0);

        const totalSize = property === 'rows'
            ? gridElement.clientHeight
            : gridElement.clientWidth;

        const pixelPerFr = totalSize / totalFr;

        return units.map(unit => {
            if (unit.endsWith('fr')) {
                return `${parseFloat(unit) * pixelPerFr}px`;
            }
            return unit; // Return non-fr units unchanged
        }).join(' ');
    }

    const newGridTemplateRows = replaceFr(rows, 'rows');
    const newGridTemplateColumns = replaceFr(columns, 'columns');

    gridElement.style.gridTemplateRows = newGridTemplateRows;
    gridElement.style.gridTemplateColumns = newGridTemplateColumns;
}

export { computeGridStyle }