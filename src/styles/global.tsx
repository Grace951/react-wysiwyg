import { createGlobalStyle } from 'styled-components';

const MaterialIconRegular = require('../fonts/MaterialIcons-Regular.ttf');

const GlobalStyle = createGlobalStyle`

  *{
    box-sizing: border-box;
  }
  
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 16px;
  }

  a{
    text-decoration: none;
  }
  a, a:link, a:visited, a:hover, a:active {
    text-decoration: none;
    color: black;
  }

  @font-face {
    font-family: 'Material Icons';
    font-weight: 400;
    font-style: normal;
    src: local('Material Icons'), local('MaterialIcons-Regular'),
      url(${MaterialIconRegular}) format('truetype');
  }

  .material-icons {
    display: inline-block;
    font-family: 'Material Icons';
    font-size: 24px; /* Preferred icon size */
    font-weight: normal;
    line-height: 1;
    font-style: normal;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

    /* Rules for sizing the icon. */
  .material-icons.md-18 { font-size: 18px; }
  .material-icons.md-24 { font-size: 24px; }
  .material-icons.md-36 { font-size: 36px; }
  .material-icons.md-48 { font-size: 48px; }

  /* Rules for using icons as black on a light background. */
  .material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
  .material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

  /* Rules for using icons as white on a dark background. */
  .material-icons.md-light { color: rgba(255, 255, 255, 1); }
  .material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
`;

export default GlobalStyle;
