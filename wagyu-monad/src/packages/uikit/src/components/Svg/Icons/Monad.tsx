import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="45" fill="#836EF9" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="white"
        fontSize="32"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        M
      </text>
    </Svg>
  )
}

export default Icon
