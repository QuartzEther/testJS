class DoubleLinkedList {
    #next = null;
    #prev = null;

    constructor(value, prev = null, next = null) {
        this.value = value;
        if (prev instanceof DoubleLinkedList) {
            prev.next = this;
            this.prev = prev;
        }
        if (next instanceof DoubleLinkedList) {
            next.prev = this;
            this.next = next;

        }
    }

    set next(next) {
        this.#next = next;
        if (next instanceof DoubleLinkedList) next.prev = this;
    }

    get next() {
        return this.#next;
    }

    set prev(prev) {
        this.#prev = prev;
    }

    get prev() {
        return this.#prev;
    }

    //--------------BASE----------------
    // length, pop, push, shift, unshift

    //Длинна массива
    length() {
        let elem = this;
        let count = (!this.value && !this.next) ? 0 : 1;
        while (elem.next) {
            count++;
            elem = elem.next;
        }
        return count;
    }

    //Удаление элемента с конца
    pop() {
        return this.cut(this.lastElement());
    }

    //Вставка элемента или нескольких элементов в конец
    push(...listOfValues) {
        for (let i of listOfValues) {
            if (!this.value && !this.next) {
                this.value = i;
                continue;
            }
            const elem = new DoubleLinkedList(i, this.lastElement());
        }
        return this.length();
    }

    //Удаление элемента с начала
    shift() {
        return this.cut(this);
    }

    //Вставка элемента или нескольких элементов в начало
    unshift(...listOfValues) {
        for (let i = listOfValues.length - 1; i >= 0; i--) {
            const newElem = new DoubleLinkedList(listOfValues[i]);
            this.setElementToZero(newElem);
        }
        return this.length();
    }

    //-------------INSIDE---------------
    // insert, remove (index or node)

    //Вставка элемента со значением value на место index
    insert(value, index = 0) {
        const newElem = new DoubleLinkedList(value);

        if (index < 0) {
            throw new RangeError('Index must be non-negative');
        } else if (index == 0) {
            this.setElementToZero(newElem);
        } else {
            let elem = this;
            if (index >= this.length()) index = this.length();
            for (let i = 0; i < index; i++) {
                //index-1 это проходка ровно до того элемента после которого нужно вставить новый
                if (i == index - 1) {
                    this.insertAfter(elem, newElem);
                }
                elem = elem.next;
            }
        }

        return this.length();
    }

    //Удаление элемента по index
    removeByIndex(index) {
        let value = null;
        if (index < 0) {
            throw new RangeError('Index must be non-negative');
        } else if (index<=this.length()) {
            let elem = this;
            let i = 0;
            while (i < index) {
                elem = elem.next;
                i++;
            }
            value = this.cut(elem)
        }
        return value
    }

    //Удаление элемента по значению
    removeByNode(node) {
        let index = null;
        let elem = this;

        for (let i = 0; i < this.length(); i++) {
            if (elem.value == node){
                this.cut(elem);
                index = i;
                break;
            }
            elem = elem.next;
        }

        return index;
    }

    //-------------ORDER---------------
    // reverse, clone, Insertion & Bubble sort

    //Изменение порядка элементов на противоположный
    reverse() {
        const newQueue = new DoubleLinkedList(null);
        const len = this.length();

        for (let i = 0; i < len; i++) {
            newQueue.push(this.pop());
        }

        this.value = newQueue.value;
        this.next = newQueue.next;

        return null;
    }


    //Клонирование массива
    clone() {
        const newQueue = new DoubleLinkedList(null);
        let elem = this;

        for (let i = 0; i < this.length(); i++) {
            newQueue.push(elem.value);
            elem = elem.next;
        }

        return newQueue;
    }


    //Сортировка вставками
    insertionSort() {
        if (this.length() > 1) {
            let lastElem = this.next;

            for (let i = 1; i < this.length(); i++) {
                let sortElem = this;

                for (let j = 0; j < i; j++) {
                    if (lastElem.value < sortElem.value) {
                        this.insert(this.removeByIndex(i), j);
                        break;
                    }
                    sortElem = sortElem.next;
                }
                lastElem = lastElem.next;
            }
        }
        return null;
    }

    //Сортировка пузырьком
    bubbleSort() {
        let isSort = true;
        let counter = this.length()-1;
        while (isSort && counter){
            isSort = false;
            let elem = this;
            for (let i = 0; i < counter; i++) {
                if (elem.value > elem.next.value) {
                    let tempValue = elem.value;
                    elem.value = elem.next.value;
                    elem.next.value = tempValue;

                    if (!isSort) isSort = true;
                }
                elem = elem.next;
            }
            counter--;

            // this.run()
            // console.log("================================")
        }

        return null;
    }

    //-------------TAKE A PART---------------
    //concat, split

    //Склейка нескольких массивов или элементов
    concat(...listOfValuesOrQueues) {
        const newQueue = this.clone();
        for (let i of listOfValuesOrQueues) {
            //Использование clone() обеспечивает то, что при передаче нескольких массивов, в них не будут происходить изменения
            // и работа (те склейка) будет происходить только с их копиями
            if (!this.value && !this.next) {
                newQueue.value = i instanceof DoubleLinkedList ? (i.value, newQueue.next = i.clone().next) : i;
                continue;
            }
            newQueue.lastElement().next = i instanceof DoubleLinkedList ? i.clone() : new DoubleLinkedList(i);
        }
        return newQueue;
    }

    //Обрезка до index
    split(index = this.length()) {

        let newQueue = this.clone();

        if (index < 0) {
            throw new RangeError('Index must be non-negative');
        }
        while (newQueue.length()>index) {
            newQueue.pop();
        }

        return newQueue;
    }


    //-----------------HELP-----------------
    //Вывод в консоль элементов построчно
    run() {
        let elem = this;
        while (elem) {
            console.log(`prev element: ${elem.prev ? elem.prev.value : null}, value: ${elem.value}, next element: ${elem.next ? elem.next.value : null}`);
            elem = elem.next;
        }

        return null;
    }

    //Возврат последнего элемента в массиве без его удаления
    lastElement() {
        let elem = this;
        while (elem.next) {
            elem = elem.next;
        }
        return elem
    }

    //Вставка переданного элемента на нулевой индекс
    setElementToZero(newElem) {
        if (newElem && newElem instanceof DoubleLinkedList) {
            let elem = new DoubleLinkedList(this.value)
            elem.next = this.next

            this.value = newElem.value
            this.next = elem
        }
    }

    //Вставка элемента после определенного элемента
    insertAfter(elem, newElem) {
        const next = elem.next;
        elem.next = newElem;
        newElem.next = next;
    }

    //Вырезка элемента из цепочки
    cut(elem){
        let value = null;

        if (elem && elem instanceof DoubleLinkedList){
            value = elem.value;

            if(elem.prev && elem.next){
                elem.prev.next = elem.next
            }
            else if (!elem.next && elem.prev){
                elem.prev.next = null;
            }
            else if (!elem.prev && elem.next){
                elem.value = elem.next.value;
                elem.next = elem.next.next;
                elem.prev = null;
            }else {
                elem.value = null
            }
        }

        return value;
    }

}

const el1 = new DoubleLinkedList(2);
const el2 = new DoubleLinkedList(4, el1);
const el3 = new DoubleLinkedList(43, el2);
const el4 = new DoubleLinkedList(6, el3);

console.log(el1.length());