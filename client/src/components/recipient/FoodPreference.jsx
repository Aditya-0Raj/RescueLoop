import { useState } from 'react';

export default function FoodPreference({ selected = [], onChange = undefined }) {
  const items = [
    'Cooked meal',
    'Bakery',
    'Packaged food',
    'Fruits & vegetables',
  ];

  const [localSelected, setLocalSelected] = useState(selected);
  const values = onChange ? selected : localSelected;

  const toggle = (item) => {
    const next = values.includes(item)
      ? values.filter((value) => value !== item)
      : [...values, item];

    if (onChange) onChange(next);
    else setLocalSelected(next);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <label
          key={item}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm hover:bg-stone-50"
        >
          <input
            type="checkbox"
            checked={values.includes(item)}
            onChange={() => toggle(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
