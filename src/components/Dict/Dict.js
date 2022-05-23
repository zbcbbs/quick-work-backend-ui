import Vue from 'vue'
import { get as getDictDetail } from '@/api/system/dictDetail'

/**
 * 字典对象，组装字典数据
 */
export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  /**
   * 组装字典数据
   * @param {Object} names 需要查询的字典集合
   * @param {Object} completeCallback 回调
   */
  async init(names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('Need Dict names')
    }
    const ps = []
    names.forEach(n => {
      // 修改Vue中的数据
      // Vue.set(target，key，value)
      // target：要更改的对象或者数组
      // key：键
      // value：赋值
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(getDictDetail(n).then(data => {
        console.info('==字典==')
        console.info(data.data)
        // splice(位置，元素个数，新元素)：数组添加或删除元素，第二个0表示不删除
        // ...：扩展运算符 ...[1,2,3] => 1 2 3
        this.dict[n].splice(0, 0, ...data.data)
        data.data.forEach(d => {
          Vue.set(this.dict.dict[n], d.itemCode, d)
          Vue.set(this.dict.label[n], d.itemCode, d.itemValue)
        })
        console.info(this.dict)
      }))
    })
    await Promise.all(ps) // 合并执行多个请求
    completeCallback()
  }
}
