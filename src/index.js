import React from 'react'
import {useMemo} from 'use-memo-one'
import memoize from 'trie-memoize'
import {css, Global} from '@emotion/core'
import {
  createStyleHook,
  ThemeProvider,
  useTheme,
  createTheme,
  mergeTheme,
} from '@style-hooks/core'

//
// Utilities
export const nullIfFalsy = fn => (v, t, p) =>
  v === false || v === null ? null : fn(v, t, p)
const memo = fn => memoize([WeakMap], fn)
export const memoTheme = fn => nullIfFalsy(memoize([Map, WeakMap], fn))
export const memoValue = fn => nullIfFalsy(memoize([Map], fn))
export const unit = (value, unit = 'px') =>
  isNaN(value) === true ? value : `${value}${unit}`
export const unitless = value =>
  typeof value === 'string' && value.indexOf('.') > -1
    ? parseFloat(value)
    : parseInt(value)
const defaultScaleValue = memoize([WeakMap, Map], (scale, value) =>
  value === void 0 || value === null || value === true
    ? scale[Object.keys(scale)[0]]
    : scale[value]
)

//
// Design system functions
const system = {
  mq: function() {
    const queries = [].slice.call(arguments)
    return theme =>
      `@media ${queries
        .map(query => theme.breakpoints[query] || query)
        .join(' and ')}`
  },

  cols: num =>
    memo(t => {
      num = isNaN(num) ? num : `${num * t.cols}/${t.cols}`
      const numColumns = t.cols,
        indexOfSlash = num.indexOf('/'),
        x = parseInt(
          indexOfSlash > -1 ? num.substring(0, indexOfSlash).trim() : num
        )

      if (__DEV__) {
        if (x < 1 || x > numColumns)
          throw new Error(
            `Column count for size '${num}' must be between 1 and ${numColumns}`
          )
      }

      const width = `${(x / numColumns) * 100}%`

      return css`
        flex-grow: 1;
        display: inline-block;
        min-width: 0;
        max-width: ${width};
        width: ${width};
        box-sizing: border-box;
      `
    }),

  font: v => (t, p) => {
    const font = defaultScaleValue(t.fonts, v)
    return typeof font === 'function' ? font(t, p) : font
  },

  bg:  v => (t, p) => {
    const bg = defaultScaleValue(t.bgs, v)
    return typeof bg === 'function' ? bg(t, p) : bg
  },

  pad: function() {
    const pads = [].slice.call(arguments)
    return memo(
      t => css`
        padding: ${pads.length === 0
          ? defaultScaleValue(t.padScale)
          : pads
              .map(v =>
                v === 'auto'
                  ? 'auto'
                  : String(v) === '0'
                  ? 0
                  : defaultScaleValue(t.padScale, v)
              )
              .join(' ')};
      `
    )
  },
  padTop: v =>
    memo(
      t => css`
        padding-top: ${defaultScaleValue(t.padScale, v)};
      `
    ),
  padRight: v =>
    memo(
      t => css`
        padding-right: ${defaultScaleValue(t.padScale, v)};
      `
    ),
  padBottom: v =>
    memo(
      t => css`
        padding-bottom: ${defaultScaleValue(t.padScale, v)};
      `
    ),
  padLeft: v =>
    memo(
      t => css`
        padding-left: ${defaultScaleValue(t.padScale, v)};
      `
    ),
  padX: v =>
    memo(
      t => css`
        padding-right: ${defaultScaleValue(t.padScale, v)};
        padding-left: ${defaultScaleValue(t.padScale, v)};
      `
    ),
  padY: v =>
    memo(
      t => css`
        padding-top: ${defaultScaleValue(t.padScale, v)};
        padding-bottom: ${defaultScaleValue(t.padScale, v)};
      `
    ),

  gap: function() {
    const gaps = [].slice.call(arguments)
    return memo(
      t => css`
        margin: ${gaps.length === 0
          ? defaultScaleValue(t.gapScale)
          : gaps
              .map(v =>
                v === 'auto'
                  ? 'auto'
                  : String(v) === '0'
                  ? 0
                  : defaultScaleValue(t.gapScale, v)
              )
              .join(' ')};
      `
    )
  },
  gapTop: v =>
    memo(
      t => css`
        margin-top: ${defaultScaleValue(t.gapScale, v)};
      `
    ),
  gapRight: v =>
    memo(
      t => css`
        margin-right: ${defaultScaleValue(t.gapScale, v)};
      `
    ),
  gapBottom: v =>
    memo(
      t => css`
        margin-bottom: ${defaultScaleValue(t.gapScale, v)};
      `
    ),
  gapLeft: v =>
    memo(
      t => css`
        margin-left: ${defaultScaleValue(t.gapScale, v)};
      `
    ),
  gapX: v =>
    memo(
      t => css`
        margin-right: ${defaultScaleValue(t.gapScale, v)};
        margin-left: ${defaultScaleValue(t.gapScale, v)};
      `
    ),
  gapY: v =>
    memo(
      t => css`
        margin-top: ${defaultScaleValue(t.gapScale, v)};
        margin-bottom: ${defaultScaleValue(t.gapScale, v)};
      `
    ),

  radius: function() {
    const radii = [].slice.call(arguments)
    return memo(
      t =>
        css`
          border-radius: ${radii.length === 0
            ? defaultScaleValue(t.radiusScale)
            : radii
                .map(v =>
                  v === 'auto'
                    ? 'auto'
                    : String(v) === '0'
                    ? 0
                    : defaultScaleValue(t.radiusScale, v)
                )
                .join(' ')};
        `
    )
  },
  radiusTopLeft: v =>
    memo(
      t => css`
        border-top-left-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusTop: v =>
    memo(
      t => css`
        border-top-left-radius: ${defaultScaleValue(t.radiusScale, v)};
        border-top-right-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusTopRight: v =>
    memo(
      t => css`
        border-top-right-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusRight: v =>
    memo(
      t => css`
        border-top-right-radius: ${defaultScaleValue(t.radiusScale, v)};
        border-bottom-right-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusBottomRight: v =>
    memo(
      t => css`
        border-bottom-right-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusBottom: v =>
    memo(
      t => css`
        border-bottom-right-radius: ${defaultScaleValue(t.radiusScale, v)};
        border-bottom-left-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusBottomLeft: v =>
    memo(
      t => css`
        border-bottom-left-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),
  radiusLeft: v =>
    memo(
      t => css`
        border-top-left-radius: ${defaultScaleValue(t.radiusScale, v)};
        border-bottom-left-radius: ${defaultScaleValue(t.radiusScale, v)};
      `
    ),

  shadow: v => (t, p) => {
    const shadow = defaultScaleValue(t.shadows, v)
    return typeof shadow === 'function' ? shadow(t, p) : shadow
  },

  unit: v => memo(t => unit(v, t.defaultUnit)),
  unitless: v => memo(() => unitless(v)),
}

//
// Hooks
const systemKeys = Object.keys(system)
const connectSystem = key =>
  systemKeys
    .filter(k => k.startsWith(key))
    .reduce((p, c) => {
      p[c] = nullIfFalsy((value, theme, props) => {
        const fn = system[c]
        return (Array.isArray(value) ? fn.apply(null, value) : fn(value))(
          theme,
          props
        )
      })
      return p
    }, {})
export const useCols = createStyleHook(connectSystem('cols'))
export const useGap = createStyleHook(connectSystem('gap'))
export const usePad = createStyleHook(connectSystem('pad'))
export const useSpace = props => useGap(usePad(props))
export const useRadius = createStyleHook(connectSystem('radius'))
export const useShadow = createStyleHook(connectSystem('shadow'))
export const useBg = createStyleHook(connectSystem('bg'))
export const useFont = createStyleHook(
  Object.assign(connectSystem('font'), {
    fontColor: memoTheme(
      (value, theme) => css`
        color: ${theme.colors[value] || value};
      `
    ),
    fontWeight: memoValue(
      value => css`
        font-weight: ${value};
      `
    ),
    fontAlign: memoValue(
      value => css`
        text-align: ${value};
      `
    ),
  })
)

//
// Browser resets
export const resets = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    word-wrap: break-word;
    text-size-adjust: 100%;
  }

  ul[class],
  ol[class] {
    padding: 0;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  nav {
    border: 0;
  }

  ul[class],
  ol[class] {
    list-style: none;
  }

  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;

    @media only screen and (-webkit-min-device-pixel-ratio: 1.5),
      only screen and (min--moz-device-pixel-ratio: 1.5),
      only screen and (-o-min-device-pixel-ratio: 1.5/1),
      only screen and (min-resolution: 144dpi),
      only screen and (min-resolution: 1.5dppx) {
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-smoothing: antialiased;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-rendering: optimizeLegibility;
  }

  p {
    line-height: 1.4;
  }

  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  img {
    max-width: 100%;
    display: block;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-play-state: paused !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }

  [hidden] {
    display: none !important;
  }
`

export const BrowserResets = () => <Global styles={resets} />

//
// Theming
export const SystemProvider = ({theme: userTheme, children}) => {
  const higherOrderTheme = useTheme()
  const systemTheme = useMemo(() => {
    const systemTheme = Object.assign(
      {
        defaultUnit: 'px',
        colors: {},
        cols: 12,

        bgs: {
          body: '',
          primary: '',
          accent: '',
        },

        fonts: {
          body: () => css``,
          'body.sm': () => css``,
          title: () => css``,
          'title.sm': () => css``,
          subtitle: () => css``,
          'subtitle.sm': () => css``,
          caption: () => css``,
        },

        gapScale: {
          lg: `${16 / 16}rem`,
          xxs: `${1 / 16}rem`,
          xs: `${2 / 16}rem`,
          sm: `${4 / 16}rem`,
          md: `${8 / 16}rem`,
          xl: `${32 / 16}rem`,
          xxl: `${64 / 16}rem`,
        },

        padScale: {
          md: `${16 / 16}rem`,
          xs: `${4 / 16}rem`,
          sm: `${8 / 16}rem`,
          lg: `${32 / 16}rem`,
          xl: `${64 / 16}rem`,
        },

        radiusScale: {
          md: '8px',
          xs: '2px',
          sm: '4px',
          lg: '16px',
          xl: '32px',
          max: '10000px',
        },

        shadows: {
          xs: css`
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
          `,
          sm: css`
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          `,
          md: css`
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          `,
          lg: css`
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
          `,
          xl: css`
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          `,
          inner: css`
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          `,
        },
      },
      mergeTheme(createTheme(higherOrderTheme), userTheme)
    )

    systemTheme.system = Object.keys(system).reduce((p, k) => {
      const sys = system[k]
      p[k] = function() {
        return sys.apply(this, arguments)(systemTheme)
      }
      return p
    }, {})

    return systemTheme
  }, [userTheme, higherOrderTheme])

  return <ThemeProvider theme={systemTheme} children={children} />
}

if (__DEV__) {
  const PropTypes = require('prop-types')
  SystemProvider.displayName = 'SystemProvider'
  SystemProvider.propTypes = {
    theme: PropTypes.object,
    children: PropTypes.element.isRequired,
  }
}

export default system
