import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/mails/getConfig',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/mails/config',
    data,
    method: 'put'
  })
}

export function send(data) {
  return request({
    url: 'api/mails/send',
    data,
    method: 'post'
  })
}
