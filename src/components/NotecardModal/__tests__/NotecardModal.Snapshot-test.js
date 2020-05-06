import React from 'react';
import renderer from 'react-test-renderer';

import NotecardModal from '../NotecardModal';

test('renders a NotecardModal using Snapshots', () => {
  expect(renderer.create(
    <NotecardModal
      ref={jest.fn()}
      show={false}
      onClose={jest.fn()}
      onSave={jest.fn()}
    />
  )).toMatchSnapshot();
});