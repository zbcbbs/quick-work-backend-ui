import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/depts/tree',
    method: 'get',
    params
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/depts/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/depts',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/depts/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/depts',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
