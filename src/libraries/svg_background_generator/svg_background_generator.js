/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:11:59
 * @modify date 2021-07-15 12:54:59
 * @desc [description]
 */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { colourCalculator } = require('$/libraries/colour_calculator');
const allXmlFiles = require('./svg_files_with_holder');

const requireXML = (fileName) => {
  return allXmlFiles[fileName] || allXmlFiles[fileName.replace(/-/g, '_')];
};

const fillColourToSvgHolder = (svgXML, colour, threshold) => {
  threshold = threshold || 100;
  while (svgXML.indexOf('#HOLDER') > -1) {
    const opMark = Math.floor(Math.random() * 2) ? '+' : '-';
    const opValue = Math.random() * threshold;
    // const opPercentage = opValue / 255;
    const opArray = [
      'r' + opMark + opValue,
      'g' + opMark + opValue,
      'b' + opMark + opValue,
    ];
    const newColour = colourCalculator(colour, opArray);
    svgXML = svgXML.replace(/#HOLDER/, newColour);
  }
  return svgXML;
};

const svgBackgroundGenerators = {
  'liquid-cheese': (userThemeColour) => {
    let svgXML = requireXML('liquid-cheese');
    if (!userThemeColour) return svgXML;
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'protruding-squares': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('protruding-squares');
    if (!userThemeColour) return svgXML;
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'wintery-sunburst': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('wintery-sunburst');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'subtle-prism': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('subtle-prism');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour, 80);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'bullseye-gradient': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('bullseye-gradient');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'spectrum-gradient': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('spectrum-gradient');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'wavey-fingerprint': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('wavey-fingerprint');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'radiant-gradient': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('radiant-gradient');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'endless-constellation': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('endless-constellation');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour, 50);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'zig-zag': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('zig-zag');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'repeating-chevrons': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('repeating-chevrons');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'large-triangles': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('large-triangles');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'abstract-envelope': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('abstract-envelope');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'diamond-sunset': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('diamond-sunset');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'square-versatiles': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('square-versatiles');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'geometric-intersection': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('geometric-intersection');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'diagonal-stripes': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('diagonal-stripes');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'hollowed-boxes': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('hollowed-boxes');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'rose-petals': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('rose-petals');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'confetti-doodles': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('confetti-doodles');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'dragon-scales': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('dragon-scales');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'quantum-gradient': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('quantum-gradient');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'cornered-stairs': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('cornered-stairs');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'slanted-gradient': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('slanted-gradient');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour, 50);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'dalmatian-spots': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('dalmatian-spots');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour, 80);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'tortoise-shell': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('tortoise-shell');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'alternating-arrowhead': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('alternating-arrowhead');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'repeating-triangles': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('repeating-triangles');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'bermuda-traingle': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('bermuda-traingle');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'bermuda-square': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('bermuda-square');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'bermuda-diamond': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('bermuda-diamond');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'bermuda-circle': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('bermuda-circle');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'parabolic-rectangle': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('parabolic-rectangle');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'parabolic-pentagon': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('parabolic-pentagon');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'parabolic-ellipse': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('parabolic-ellipse');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'parabolic-triangle': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('parabolic-triangle');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'polka-dots': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('polka-dots');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'colorful-stingrays': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('colorful-stingrays');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'varying-stripes': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('varying-stripes');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'vanishing-stripes': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('vanishing-stripes');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'sun-tornado': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('sun-tornado');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'scattered-forcefields': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('scattered-forcefields');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'page-turner': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('page-turner');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        // backgroundColor: `rgba(${themeColourRGB[0]}, ${themeColourRGB[1]}, ${themeColourRGB[2]}, 0.6)`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'abstract-timekeeper': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('abstract-timekeeper');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
      },
    };
  },
  'rainbow-vortex': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('rainbow-vortex');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'left top',
      },
    };
  },
  'subtle-stripes': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('subtle-stripes');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'pattern-randomized': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('pattern-randomized');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
      },
    };
  },
  'flat-mountains': (userThemeColour) => {
    // userThemeColour = '#ffff00';
    let svgXML = requireXML('flat-mountains');
    if (!userThemeColour) return svgXML;
    // svgXML = svgXML.replace(/#HOLDER/gi, userThemeColour);
    svgXML = fillColourToSvgHolder(svgXML, userThemeColour);
    return {
      svgXML,
      cssStyles: {
        backgroundImage: 'url("data:image/svg+xml;base64,' + btoa(svgXML) + '"',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      },
    };
  },
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const svgBackgroundDescriptions = Object
  .entries(svgBackgroundGenerators)
  .reduce((acc, [genKey, gen]) => {
    acc[genKey] = {
      name: genKey.split('-').map(capitalizeFirstLetter).join(' '),
      gen,
    };
    return acc;
  }, {});
exports.svgBackgroundDescriptions = svgBackgroundDescriptions;

exports.generateSvgBackground = (patternName, primaryColour) => {
  const gen = svgBackgroundGenerators[patternName];
  if (!gen) return null;
  return Object.assign({}, gen(primaryColour), { patternName });
};
