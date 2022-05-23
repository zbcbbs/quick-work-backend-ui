const req = require.context('../../../assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const regex = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  return i.match(regex)[1]
})

export default svgIcons
