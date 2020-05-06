import React from 'react';
import { Modal, Text } from 'react-native';
import { mount } from 'enzyme';

import Loader from '../Loader';

test('renders a Loader using Enzyme 1', () => {
  const wrapper = mount(
    <Loader
      loading={false}
      loadText={'test'}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(Modal).props().visible).toBe(false);
  expect(wrapper.contains(Text)).toBe(true);
});

test('renders a Loader using Enzyme 2', () => {
  const wrapper = mount(
    <Loader
      loading={true}
      loadText={'test'}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(Modal).props().visible).toBe(true);
  expect(wrapper.contains(Text)).toBe(true);
});