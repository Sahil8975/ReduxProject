import PropTypes from 'prop-types';
import React, { useRef, useImperativeHandle } from 'react';

const StripeInput = ({ component: Component, inputRef, ...props }) => {
  const elementRef = useRef();
  useImperativeHandle(inputRef, () => ({
    focus: () => elementRef.current.focus
  }));
  return <Component onReady={(element) => (elementRef.current = element)} {...props} />;
};

StripeInput.propTypes = {
  component: PropTypes.object,
  inputRef: PropTypes.string
};

export default StripeInput;
