import http from '@/utils/http'

export const getCount = async function () {
  const res = await http.get('/article/list/count')
  return res
}
