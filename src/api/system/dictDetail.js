import request from '@/utils/request'

export function get(code) {
  const params = {
    code,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dicts/items',
    method: 'get',
    params
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dicts/items/map',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dicts/items',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dicts/items/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dicts/items',
    method: 'put',
    data
  })
}

export default { add, edit, del }
