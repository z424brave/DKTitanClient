export class UpdateFromSelectValue {

    key: string;
    name: string;
    selected: boolean = false;

    constructor(key: string, name: string) {
        this.name = name;
        this.key = key;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }

    setSelected() {
        this.selected = true;
    }

    setDeselected() {
        this.selected = false;
    }

}
