export class Category {
    constructor(category_id, name, parent_id, children = []) {
        this.category_id = category_id;
        this.name = name;
        this.parent_id = parent_id;
        this.children = children;
    }
}
