import React from "react"
import styled from "styled-components"
import { theme } from "twin.macro"

const levelToElementMap = {
  xxxs: "h6",
  xxs: "h5",
  xs: "h4",
  s: "h3",
  m: "h2",
  lg: "h2",
}

const levelToFontSizeMap = {
  xxxs: "8",
  xxs: "10",
  xs: "12",
  s: "14",
  m: "16",
  lg: "18",
}

const levelToLineHeightMap = {
  xxxs: "150%",
  xxs: "150%",
  xs: ["150%", "13px"],
  s: "150%",
  m: "22px",
  lg: "150%",
}

const weightToFontWeightMap = {
  normal: "normal",
  medium: "500",
  bold: "700",
}

const TextNode = styled.h2`
  ${({ level = "s", weight = "medium", color, heading, lineHeight }) => {
    if (!lineHeight) {
      lineHeight = levelToLineHeightMap[level]
    }

    return `
      font-weight: ${weightToFontWeightMap[weight]};
      color: ${color};
      word-wrap: break-word;
      font-size: ${levelToFontSizeMap[level]}px;
      line-height: ${
        Array.isArray(lineHeight)
          ? heading
            ? lineHeight[0]
            : lineHeight[1]
          : lineHeight
      }
    `
  }}
`

export const Text = ({
  style,
  weight,
  children,
  level = "m",
  heading = false,
  color = "#000",
  ...rest
}) => {
  const as = heading ? levelToElementMap[level] : "p"

  return (
    <TextNode
      weight={weight}
      color={color}
      level={level}
      style={style}
      {...rest}
    >
      {children}
    </TextNode>
  )
}
