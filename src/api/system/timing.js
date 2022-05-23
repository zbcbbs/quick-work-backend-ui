import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jobs',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/jobs/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/jobs',
    method: 'put',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'put'
  })
}

export function execute(id) {
  return request({
    url: 'api/jobs/exec/' + id,
    method: 'put'
  })
}

// 查询 spring bean 名称列表
export function getBeanNames(){
  return request({
    url: 'api/jobs/beans',
    method: 'get'
  })
}

// 获取指定 bean 的方法列表
export function getMethodNames(beanName){
  return request({
    url: 'api/jobs/beans/' + beanName,
    method: 'get'
  })
}

export default { del, updateIsPause, execute, add, edit, getBeanNames, getMethodNames }
