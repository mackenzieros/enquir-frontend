import React from 'react';
import { TextInput } from 'react-native';
import { mount } from 'enzyme';

import NotecardModal from '../NotecardModal';

test('renders a NotecardModal using Enzyme 1', () => {
  const wrapper = mount(
    <NotecardModal
      ref={jest.fn()}
      show={false}
      onClose={jest.fn()}
      onSave={jest.fn()}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test('renders a NotecardModal using Enzyme 2', () => {
  const wrapper = mount(
    <NotecardModal
      ref={jest.fn()}
      show={false}
      onClose={jest.fn()}
      onSave={jest.fn()}
    />
  );
  expect(wrapper).toMatchSnapshot();
});