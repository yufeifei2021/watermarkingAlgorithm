import { sum } from '@/common/utils';

test('test function', () => {
  const result = sum(1, 2);
  expect(result).toEqual(3);
});
