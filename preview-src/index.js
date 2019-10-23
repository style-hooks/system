import React from 'react'
import {css, Global} from '@emotion/core'
import {useTheme} from '@style-hooks/core'
import cleanCss from 'minify-css.macro'
import {SystemProvider, resets} from '../'

const previewContainer = ({system}) => cleanCss`
  ${system.font()}
  ${system.pad()}
  width: 100%;
  max-width: 994px;
  margin: 0 auto;
`

const section = ({system}) => cleanCss`
  display: flex;
  flex-wrap: wrap;
  ${system.padX()}
  ${system.gapY()}
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  ${system.radius()}
`

const color = ({system}) => cleanCss`
  ${system.gap()}
  min-width: 180px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const colorText = ({system}) => cleanCss`
  ${system.pad()}
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 700;
  
  & > div:last-of-type {
    font-size: 0.7em;
    font-weight: initial;
  }
`

const colorBox = color => ({system}) => cleanCss`
  width: 100%;
  height: 124px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  ${system.radius()};
  background-color: ${color};
`

const fontBox = font => ({system}) => cleanCss`
  ${system.pad()}
  width: 100%;
  
  div:first-child {
    ${system.pad(null, null, 0)}
    width: 100%;
    overflow-x auto;
    letter-spacing: -0.025em;
    margin: 0;
  }
  
  div:last-child {
    ${system.pad(0, null, null)}
    ${system.font(font)}
  }
`

const heading = ({system}) => css`
  font-weight: 700;
  font-size: 2.667rem;
  width: 100%;
  ${system.pad()}
  ${system.gapTop()}
`

// eslint-disable-next-line react/prop-types
const Section = ({title, className, children}) => (
  <div className={className} css={section}>
    {title && <div css={heading}>{title}</div>}
    {children}
  </div>
)

const Previews = () => {
  const theme = useTheme()

  return (
    <div css={previewContainer}>
      <Global styles={[resets]} />

      {Object.keys(theme.fonts).map(label => (
        <Section key={label} css={fontBox(label)}>
          <div>"{label}"</div>
          <div>Sphinx of black quartz, judge my vow</div>
        </Section>
      ))}

      <Section title="Colors">
        {Object.entries(theme.colors).map(([label, hex]) => (
          <div key={label} css={color}>
            <div css={colorBox(hex)} />
            <div css={colorText}>
              <div>"{label}"</div>
              <div>{hex}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Pad scale">
        {Object.keys(theme.padScale).map(label => (
          <div key={label} css={fontBox(label)}>
            <div>"{label}"</div>
            <div>Sphinx of black quartz, judge my vow</div>
          </div>
        ))}
      </Section>

      <Section title="Gap scale">
        {Object.keys(theme.gapScale).map(label => (
          <div key={label} css={fontBox(label)}>
            <div>"{label}"</div>
            <div>Sphinx of black quartz, judge my vow</div>
          </div>
        ))}
      </Section>

      <Section title="Shadows">
        {Object.keys(theme.shadows).map(label => (
          <div key={label} css={fontBox(label)}>
            <div>"{label}"</div>
            <div>Sphinx of black quartz, judge my vow</div>
          </div>
        ))}
      </Section>


      <Section title="Radius scale">
        {Object.keys(theme.radiusScale).map(label => (
          <div key={label} css={fontBox(label)}>
            <div>"{label}"</div>
            <div>Sphinx of black quartz, judge my vow</div>
          </div>
        ))}
      </Section>

      <Section title="Shadows">
        {Object.keys(theme.shadows).map(label => (
          <div key={label} css={fontBox(label)}>
            <div>"{label}"</div>
            <div>Sphinx of black quartz, judge my vow</div>
          </div>
        ))}
      </Section>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
const Preview = ({theme: systemTheme}) => (
  <SystemProvider theme={systemTheme}>
    <Previews />
  </SystemProvider>
)

export default Preview
