import dayjs from 'dayjs'
import { store } from '@/store'
const { global_config } = window as any

export function animateCSS(node: any, animation: any, prefix = 'animate__') {
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`

    node.classList.add(`${prefix}animated`, animationName)

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event: any) {
      event.stopPropagation()
      node.classList.remove(`${prefix}animated`, animationName)
      resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}

export function getDate(val: any) {
  return dayjs(val).format('YYYY-MM-DD') + ' ' + dayjs(val).format('HH:mm:ss')
}
export function resetUrl(data: string) {
  let newData = ''
  if (data) {
    if (data.indexOf('<') === -1) {
      newData = '/images' + data.split('images')[1]
    } else {
      newData = data.replace(/src=".*?\/images\/.*?.(jpg|png|PNG|GIF|JPG|JPEG|gif|jpeg)/g, function (val) {
        let temp = val.split('"')
        return temp[0] + '"/images' + temp[1].split('images')[1]
      })
    }
  }
  return newData
}

export function getUrl(data: string) {
  let newData = ''
  if (data) {
    data = resetUrl(data)
    if (data.indexOf('<') === -1) {
      newData = global_config.BASE_URL + data
    } else {
      newData = data.replace(/src="\/images\/.*?.(jpg|gif|png|GIF|PNG|JPG|JPEG|jpeg)/g, function (val) {
        let temp = val.split('"')
        return temp[0] + '"' + global_config.BASE_URL + '/' + temp[1]
      })
    }
  }
  return newData
}

export function getText(data: string) {
  let newData = ''
  if (data) {
    data = data.replace(/<[^>]+>/g, '')
    newData = data.substring(0, 100)
  }
  return newData
}

export function resetSort(data: any) {
  let list: any = data
  list.map((item: any) => {
    if (item.children != null && item.children.length != 0) {
      item.children = resetSort(item.children)
    }
  })
  list.sort((a: any, b: any) => (a.sortOrder ? a.sortOrder : 0) - (b.sortOrder ? b.sortOrder : 0))
  return list
}
function getChildren(list: any, source: any, type: number) {
  list.forEach((item: any) => {
    let children = source.filter((data: any) => String(data.parentId) === String(item.id))
    if (type === 1) {
      children = children.filter((item: any) => item.enabled)
    }
    item.key = item.code
    if (children.length) {
      item.children = children
      getChildren(children, source, type)
    }
  })
}

export function getList(data: any, type = 1) {
  const list: any = []
  let parent: any = []
  data.forEach((item: any) => {
    let temp = {
      ...item,
      path: item.path,
      icon: item.icon,
      name: item.menuName
    }
    if (!temp.parentId) {
      parent.push({
        ...temp
      })
    } else {
      list.push(temp)
    }
  })
  getChildren(parent, list, type)
  parent = resetSort(parent)
  parent.map((item: any) => {
    if (item.children && item.children.length != 1) {
      item.redirect = item.children[0].path
    }
  })
  return parent
}
