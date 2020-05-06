import React from 'react';
import renderer from 'react-test-renderer';

import Loader from '../Loader';

test('renders a Loader using Snapshots and is not loading', () => {
    expect(renderer.create(
        <Loader
            loading={false}
            loadText={''}
        />
    )).toMatchSnapshot();
});

test('renders a Loader using Snapshots and is loading', () => {
    expect(renderer.create(
        <Loader
            loading={true}
            loadText={''}
        />
    )).toMatchSnapshot();
});