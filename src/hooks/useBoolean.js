import { useState } from 'react';

const useBoolean = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const updateValue = {
    toggle: () => setValue((oldValue) => !oldValue),
    on: () => setValue(true),
    off: () => setValue(false)
  };

  return [value, updateValue];
};

export default useBoolean;
