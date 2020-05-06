import React from 'react';
import { Modal } from 'react-native';
import { mount } from 'enzyme';

import Confirmer from '../Confirmer';

test('renders a Confirmer using Enzyme 1', () => {
  const wrapper = mount(
    <Confirmer
      confirming={true}
      confirmation={jest.fn()}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(Modal).props().visible).toBe(true);
});

test('renders a Confirmer using Enzyme 2', () => {
  const wrapper = mount(
    <Confirmer
      confirming={false}
      confirmation={jest.fn()}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(Modal).props().visible).toBe(false);
});