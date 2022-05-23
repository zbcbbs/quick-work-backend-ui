import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    url: 'api/permissions/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    url: 'api/permissions',
    method: 'get',
    params
  })
}

export function getMenuSuperior(ids) {
  const data = Array.isArray(ids) || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/permissions/superior',
    method: 'post',
    data
  })
}

// 获取子节点 包含自身
export function getChild(id) {
  return request({
    url: 'api/permissions/child?id=' + id,
    method: 'get'
  })
}

// 获取父节点 包含自身
export function getParent(id) {
  return request({
    url: 'api/permissions/parent?id=' + id,
    method: 'get'
  })
}

// 获取所有选中的关联节点
export function getCheckedNodes(id) {
  return request({
    url: 'api/permissions/checked?id=' + id,
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: 'api/permissions/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/permissions',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/permissions/' + ids,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/permissions',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus, getChild, getParent, getCheckedNodes }
