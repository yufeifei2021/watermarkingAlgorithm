import { useState } from 'react';

export default function CheckboxWithLabel({
  labelOn,
  labelOff,
}: {
  labelOn: string;
  labelOff: string;
}) {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <input
        id={'test'}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor="test">{isChecked ? labelOn : labelOff}</label>
    </div>
  );
}
