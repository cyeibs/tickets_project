import React, { useState } from 'react';
import { TextField } from './TextField';
import { CrossIcon } from '@shared/assets/icons';
import { IconButton } from '../IconButton';

export const TextFieldExamples: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Basic TextField */}
      <TextField
        label="Basic Input"
        placeholder="Enter text here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* TextField with prefix */}
      <TextField
        label="With Prefix"
        placeholder="Enter text"
        prefixElement={<span>$</span>}
      />

      {/* TextField with suffix */}
      <TextField
        label="With Suffix"
        placeholder="Select option"
        suffixElement={
          <IconButton
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <title>Dropdown arrow</title>
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#626974"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            variant="transparent"
            size="small"
          />
        }
      />

      {/* TextField with hint */}
      <TextField
        label="With Hint"
        placeholder="Enter username"
        hint="Username must be at least 3 characters"
      />

      {/* TextField with error */}
      <TextField
        label="With Error"
        placeholder="Enter email"
        value="invalid-email"
        error="Please enter a valid email address"
      />

      {/* Disabled TextField */}
      <TextField
        label="Disabled"
        placeholder="Cannot edit this field"
        disabled
        value="Disabled value"
      />
    </div>
  );
};
