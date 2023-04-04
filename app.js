class FIFO {
    #arr = [];

    isEmpty(){
        return this.#arr.length==0;
    }
    enqueue(el){
        this.#arr.push(el);
    }
    dequeue(){
        return !this.isEmpty()? this.#arr.shift() : null;
    }

    front(){
        return !this.isEmpty()? this.#arr[0] : null;
    }

    size(){
        return this.#arr.length;
    }

}

class LIFO {
    #arr = [];

    push(el){
        this.#arr.push(el);
    }
    pop(){
        return this.#arr.length!=0 ? this.#arr.pop() : null;
    }
    peek(){
        return this.#arr.length!=0 ? this.#arr[this.#arr.length - 1] : null;
    }
    length(){
        return this.#arr.length;
    }
}

class SinglyLinked {
    #next = null;
    constructor(value, prev = null) {
        this.value = value;
        if (prev instanceof SinglyLinked){
            prev.next = this;
        }
    }

    set next(next){
        if (next instanceof SinglyLinked){
            this.#next = next;
        }
    }

    get next(){
        return this.#next;
    }

}

class QueueUtil {
    #firstElem = null;
    constructor(list = null) {
        if (list instanceof SinglyLinked){
            this.#firstElem = list;
        }
    }

    //--------------BASE----------------
    // length, pop, push, shift, unshift

    //Длинна массива
    length() {
        let elem = this.#firstElem;
        let count = elem? 1 : 0;
        while (elem.next) {
            count++;
            elem = elem.next;
        }
        return count;
    }

    //Удаление элемента с конца
    pop() {
        let elem = this.#firstElem;
        let value = null;
        if (elem) {
            if (!elem.next) {
                value = elem.value;
                this.#firstElem = null;
                return value;
            }
            while (elem.next) {
                if (!elem.next.next) {
                    value = elem.next.value;
                    elem.next = null;
                    return value;
                }
                elem = elem.next;
            }
        }
        return value;
    }

    //Вставка элемента или нескольких элементов в конец
    push(...listOfValues){
        for (let i of listOfValues) {
            if (!this.#firstElem) {
                this.#firstElem = new SinglyLinked(i);
                continue;
            }
            const elem = new SinglyLinked(i, this.lastElement());
        }

        return this.length();
    }

    //Удаление элемента с начала
    shift() {
        let value = null;
        if (this.#firstElem) {
            value = this.#firstElem.value;
            this.#firstElem.next ? this.#firstElem = this.#firstElem.next : this.#firstElem = null;
        }
        return value;
    }

    //Вставка элемента или нескольких элементов в начало
    unshift(...listOfValues){
        for (let i = listOfValues.length-1; i >= 0; i--) {
            const newElem = new SinglyLinked(listOfValues[i]);
            this.setElementToZero(newElem);
        }

        return this.length();
    }


    //-------------INSIDE---------------
    // insert, remove (index or node)

    //Вставка элемента со значением value на место index
    insert (value, index = 0){
        const newElem = new SinglyLinked(value);

        if(index<0){
            throw new RangeError('Index must be non-negative');
        }else if(index==0){
            this.setElementToZero(newElem);
        }else{
            let elem = this.#firstElem
            if (index>=this.length()) index = this.length();
            for (let i = 0; i<index; i++){
                //index-1 это проходка ровно до того элемента после которого нужно вставить новый
                if( i == index-1){
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

        if(index<0) {
            throw new RangeError('Index must be non-negative');
        }else if(index == 0){
            value = this.shift();
        }else if(index<this.length()){
            let elem = this.#firstElem;
            for (let i = 0; i<index; i++){
                //index-1 это проходка ровно до того элемента который идет перед элементом который нужно удалить
                if( i == index-1){
                    value = elem.next.value;
                    elem.next = elem.next.next;
                    break;
                }
                elem = elem.next;
            }
        }

        return value
    }

    //Удаление элемента по значению
    removeByNode(node) {
        let index = null;
        let elem = this.#firstElem;

        if(elem && elem.value == node){
            this.shift();
            index = 0;
        }else{
            for (let i = 0; i<this.length()-1; i++){
                if(elem.next.value == node){
                    index = ++i;
                    elem.next = elem.next.next;
                    break;
                }
                elem = elem.next;
            }
        }

        return index;
    }

    //-------------ORDER---------------
    // reverse, clone, Insertion & Bubble sort

    //Изменение порядка элементов на противоположный
    reverse(){
        const newQueue = new QueueUtil();
        const len = this.length();

        for (let i = 0; i<len; i++){
            newQueue.push(this.pop());
        }
        this.#firstElem = newQueue.#firstElem;

        return null
    }

    //Клонирование массива
    clone(){
        const newQueue = new QueueUtil();
        let elem = this.#firstElem;

        for (let i = 0; i<this.length(); i++){
            newQueue.push(elem.value);
            elem = elem.next;
        }

        return newQueue;
    }

    //Сортировка вставками
    insertionSort(){
        if (this.length() > 1){
            let lastElem = this.#firstElem.next;

            for (let i = 1; i<this.length(); i++){
                let sortElem = this.#firstElem;
                for (let j = 0; j<i; j++){
                    if (lastElem.value <= sortElem.value){
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
    bubbleSort(){
        if (this.length() > 1){

            for (let i = 0; i<this.length()-1; i++){
                let elem = this.#firstElem;
                let isSort = false;

                for (let j = 0; j<this.length()-1-i; j++){
                    if (elem.value > elem.next.value){
                        let tempValue = elem.value;
                        elem.value = elem.next.value;
                        elem.next.value = tempValue;

                        if (!isSort) isSort = true;
                    }
                    elem = elem.next;
                }

                if(!isSort) break;

                //this.run()
                //console.log("================================")
            }
        }

        return null;
    }

    //-------------TAKE A PART---------------
    //concat, split

    //Склейка нескольких массивов или элементов
    concat (...listOfValuesOrQueues) {
        const newQueue = this.clone();
        for (let i of listOfValuesOrQueues) {
            if (i instanceof QueueUtil || i instanceof SinglyLinked){
                //Использование clone() обеспечивает то, что при передаче нескольких массивов, в них не будут происходить изменения
                // и работа (те склейка) будет происходить только с их копиями
                if (!this.#firstElem) {
                    newQueue.firstElem = i instanceof QueueUtil ? i.clone().firstElem : new QueueUtil(i).clone().firstElem;
                    continue;
                }
                newQueue.lastElement().next = i instanceof QueueUtil ? i.clone().firstElem : new QueueUtil(i).clone().firstElem;
            }
        }
        return newQueue;
    }

    //Обрезка до index
    split (index = this.length()){
        let newQueue = new QueueUtil();
        let elem = this.#firstElem;

        if(index<0) {
            throw new RangeError('Index must be non-negative');
        }else if (index>=this.length()){
            newQueue = this.clone();
        }else{
            for (let i = 0; i<index; i++){
                newQueue.push(elem.value);
                elem = elem.next;
            }
        }
        return newQueue;
    }



    //---------HELP FOR ME--------------

    //Вывод в консоль элементов построчно
    run (){
        let elem = this.#firstElem;
        while (elem) {
            console.log(`value: ${elem.value}, next element: ${elem.next? elem.next.value : null}`);
            elem = elem.next;
        }

        return null;
    }

    //Вывод в консоль элементов в виде object
    print (){
        let elem = this.#firstElem;
        while (elem) {
            console.log(elem);
            elem = elem.next;
        }

        return null;
    }

    //Возврат последнего элемента в массиве без его удаления
    lastElement (){
        let elem = this.#firstElem;
        while (elem.next) {
            elem = elem.next;
        }
        return elem
    }

    //Вставка переданного элемента на нулевой индекс
    setElementToZero(newElem){
        if (newElem && newElem instanceof SinglyLinked){
            let elem = this.#firstElem;
            newElem.next = elem;
            this.#firstElem = newElem;
        }
    }

    //Вставка значения после определенного элемента
    insertAfter(elem, newElem){
        const next = elem.next;
        elem.next = newElem;
        newElem.next = next;
    }

    //get и set для поля firstElem
    get firstElem () {
        return this.#firstElem;
    }

    set firstElem (elem) {
        if (elem instanceof SinglyLinked) {
            this.#firstElem = elem;
        }

        return null;
    }
}

const el1 = new SinglyLinked(2);
const el2 = new SinglyLinked(4, el1);
const el3 = new SinglyLinked(43, el2);
const el4 = new SinglyLinked(6, el3);

const qu = new QueueUtil(el1);
console.log(qu.length());