function useFitScreen(options) {
  const {
    // * 画布尺寸（px）
    width = 1920,
    height = 1080,
    el
  } = options

  // * 默认缩放值
  let scale = {
    widthRatio: 1,
    heightRatio: 1,
  }

  // * 需保持的比例
  const baseProportion = parseFloat((width / height).toFixed(5))
  const calcRate = () => {
    if (el) {
      // 当前比例
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      // 比例越大，则越宽，基准值采用高度，计算出宽度
      // 反之，则越高，基准值采用宽度，计算出高度
      scale = currentRate > baseProportion
        ? calcRateByHeight(width, height, baseProportion)
        : calcRateByWidth(width, height, baseProportion)
    }

    el.style.transform = `scale(${scale.widthRatio}, ${scale.heightRatio})`
  }

  // * 改变窗口大小重新绘制
  const resize = () => {
    window.addEventListener('resize', calcRate)
  }

  // * 改变窗口大小重新绘制
  const unResize = () => {
    window.removeEventListener('resize', calcRate)
  }

  return {
    calcRate,
    resize,
    unResize,
  }
}