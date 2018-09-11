/* eslint-disable react/prop-types */
import React from 'react';
import { css } from 'emotion';

const buttonStyles = css`
  color: hotpink;
`;

const Button = props => <div className={buttonStyles}>{props.children}</div>;

test('Button renders correctly', () => {
  const wrapper = shallow(<Button>This is hotpink.</Button>);

  expect(wrapper).toMatchSnapshot();
});
