/* @flow weak */
import isUnitlessProperty from 'css-in-js-utils/lib/isUnitlessProperty'

import isObject from '../utils/isObject'
import warning from '../utils/warning'

function addUnitIfNeeded(property, value, unit) {
  const valueType = typeof value
  /* eslint-disable eqeqeq */
  if (valueType === 'number' || valueType === 'string' && value == parseFloat(value)) {
    value += unit
  }
  /* eslint-enable */
  return value
}

function addUnit(style, unit, propertyMap) {
  for (const property in style) {
    if (!isUnitlessProperty(property)) {
      const cssValue = style[property]
      const propertyUnit = propertyMap[property] || unit

      if (isObject(cssValue)) {
        style[property] = addUnit(cssValue, unit, propertyMap)
      } else if (Array.isArray(cssValue)) {
        style[property] = cssValue.map(val => addUnitIfNeeded(property, val, propertyUnit))
      } else {
        style[property] = addUnitIfNeeded(property, cssValue, propertyUnit)
      }
    }
  }

  return style
}

export default (unit = 'px', propertyMap = {}) => {
  warning(
    unit.match(/ch|em|ex|rem|vh|vw|vmin|vmax|px|cm|mm|in|pc|pt|mozmm|%/) !== null,
    `You are using an invalid unit "${unit}".
Consider using one of the following ch, em, ex, rem, vh, vw, vmin, vmax, px, cm, mm, in, pc, pt, mozmm or %.`
  )

  return style => addUnit(style, unit, propertyMap)
}
