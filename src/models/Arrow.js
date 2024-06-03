export class Arrow {
    constructor(id, from, to) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.intermediateData = []; // Промежуточные данные
    }

    setEndpoints(from, to) {
        this.from = from;
        this.to = to;
    }

    static setIntermediateData(arrow, data) {
        arrow.intermediateData = data;
    }

    static transferData(arrow, fromTab) {
        const fromData = fromTab.data;
        const intermediateData = fromData.map(row => ({
            col1: row.col1,
            col2: row.col3, // Переносим данные из третьего столбца
        }));
        Arrow.setIntermediateData(arrow, intermediateData);
        return intermediateData;
    }
}
