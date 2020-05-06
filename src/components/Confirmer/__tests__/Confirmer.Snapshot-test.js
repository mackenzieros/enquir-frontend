import React from 'react';
import renderer from 'react-test-renderer';

import Confirmer from '../Confirmer';

test('renders a Confirmer using Snapshots', () => {
    expect(renderer.create(
        <Confirmer
            confirming={false}
            confirmation={jest.fn()}
        />
    )).toMatchSnapshot();
});