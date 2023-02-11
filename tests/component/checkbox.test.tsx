import { cleanup, fireEvent, render } from '@testing-library/react';
import CheckboxWithLabel from './Checkbox';

afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const { queryByLabelText, getByLabelText, baseElement } = render(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />,
  );
  expect(baseElement).toMatchSnapshot();
  expect(getByLabelText(/Off/i)).toBeInTheDocument();
  fireEvent.click(getByLabelText(/Off/i));
  expect(queryByLabelText(/On/i)).toBeTruthy();
});
