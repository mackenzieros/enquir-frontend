import React from 'react';
import { TextInput } from 'react-native';
import { mount } from 'enzyme';

import Question from '../Question';
import { questions } from '../../../../__mocks__/questions';

const question = questions[0];

test('renders a Question using Enzyme 1', () => {
  const wrapper = mount(
    <Question
      id={question.id}
      question={''}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(TextInput).props().value.length).toEqual(0);
});

test('renders a Question using Enzyme 2', () => {
  const wrapper = mount(
    <Question
      id={question.id}
      question={question.questionInput}
    />
  );
  expect(wrapper).toMatchSnapshot();
  expect((wrapper).find(TextInput).props().value.length).toBeGreaterThan(0);
});