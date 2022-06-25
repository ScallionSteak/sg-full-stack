/*
 * @Author: dgflash
 * @Date: 2022-05-16 15:31:57
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-16 16:06:20
 */

/** 
 * 集合对象
 * 1、Map与Array集合体
 */
export class Collection<K, V> extends Map<K, V>{
    private _array: V[] = [];

    get array() {
        return this._array;
    }

    set(key: K, value: V) {
        if (!this.has(key)) {
            this._array.push(value);
        }

        return super.set(key, value);
    }

    delete(key: K): boolean {
        var value = this.get(key);
        if (value) {
            this._array.removeOne(v => v === value);
            return super.delete(key);
        }
        return false;
    }
}