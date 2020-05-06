import React from 'react';
import renderer from 'react-test-renderer';

import Question from '../Question';
import { questions } from '../../../../__mocks__/questions';

test('renders a Question using Snapshots', () => {
    expect(renderer.create(
        <Question
            id={questions[0].id}
            questionInput={questions[0].questionInput}
        />
    )).toMatchSnapshot();
});