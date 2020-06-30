// 动态设置rem的值
// 在设计稿640px 情况 ，设置1rem = 100px
// 推算1rem 在其他屏幕 取值
// 根据媒体查询检测当前屏幕宽度，根据宽取设置rem的值
// 当前值 = 当前屏幕宽度/640*100
// design 设计稿宽
function setRem(design) {
  // 1获取当前屏幕的宽度
  let width = window.innerWidth
  // console.log(width);
  if (width > design) {
    width = design
  }
  if (width < 840) {
    width = 840
  }

  // 动态设置rem的值
  document.querySelector('html').style.fontSize = (width / design) * 100 + 'px'
}

setRem(960)

// 检测屏幕宽度变化，实时动态设置
window.onresize = function () {
  setRem(960)
}
