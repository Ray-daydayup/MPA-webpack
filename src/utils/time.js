export function timestampFormat(timestamp, Delimiter = ' ') {
  const dateTime = new Date(timestamp)
  const y = dateTime.getFullYear()
  let m = dateTime.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = dateTime.getDate()
  d = d < 10 ? '0' + d : d
  let h = dateTime.getHours()
  h = h < 10 ? '0' + h : h
  let min = dateTime.getMinutes() + 1
  min = min < 10 ? '0' + min : min
  return y + '-' + m + '-' + d + Delimiter + h + ':' + min
}

export function toTimestamp(time) {
  const dateTime = new Date(time)
  return dateTime.getTime()
}
