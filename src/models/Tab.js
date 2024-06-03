export class Tab {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.position = { x: 0, y: 0 };
        this.data = []; // Добавляем массив данных для таблицы
        this.incomingData = [];
    }
    setPosition(x, y) {
        this.position = { x, y };
    }
    setName(name) {
        this.name = name;
    }
    setData(data) {
        this.data = data;
    }
}