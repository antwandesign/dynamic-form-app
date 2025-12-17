import { render, screen } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';
import { describe, it, expect, vi } from 'vitest';

describe('RadioGroup Primitive', () => {
  it('should render options', () => {
    const options = [
      { label: 'Opt 1', value: '1' },
      { label: 'Opt 2', value: '2' },
    ];
    render(
      <RadioGroup
        id="rg"
        label="Choices"
        options={options}
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Opt 1')).toBeTruthy();
    expect(screen.getByLabelText('Opt 2')).toBeTruthy();
  });
});
