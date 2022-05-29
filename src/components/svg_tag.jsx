/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-08-18 15:58:03
 * @modify date 2021-08-18 15:58:03
 * @desc [description]
 */

const React = require('react');
const PropTypes = require('prop-types');
const { createElement } = require('$/libraries/html_element_creator');

const SvgTagWithContent = (props) => {
  const { xml } = props;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref && ref.current && ref.current.parentElement) {
      const xmlDom = (new DOMParser()).parseFromString(xml, 'application/xml');
      const svgTags = xmlDom.getElementsByTagName('svg');
      const svg = svgTags[0];
      Object.assign(svg.style, props.style);
      const newSvgTag = createElement(svg.outerHTML);
      ref.current.outerHTML = newSvgTag.outerHTML;
      ref.current = newSvgTag;
    }
  });
  return (
    // eslint-disable-next-line react/self-closing-comp
    <svg ref={ref}>
    </svg>
  );
};
SvgTagWithContent.propTypes = {
  xml: PropTypes.string.isRequired,
  style: PropTypes.shape({}),
};
SvgTagWithContent.defaultProps = {
  style: {},
};

exports.SvgTagWithContent = SvgTagWithContent;
