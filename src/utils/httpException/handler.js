export const handle200 = function (response, formatRes) {
  if (response.code === 200) {
    formatRes.data = response.data
    return
  }
  formatRes.flag = false
}

export const handle404 = function (response) {
  console.log(response.msg)
}

export const handle500 = function (response) {
  console.log(response)
}

export const handle401 = async function (response) {
  console.log(response.msg)
}
