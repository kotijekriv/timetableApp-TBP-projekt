import React from 'react';
import { TextField, Grid } from '@mui/material'

function Input({ name, handleChange, label, autoFocus, type, required, value, shrink }) {
  return (
    <Grid item xs={12} sm={12}>
      <TextField
        name={name}
        onChange={handleChange}
        variant="outlined"
        required={required}
        fullWidth
        label={label}
        autoFocus={autoFocus}
        type={type}
        value={value}
        InputLabelProps={{
          shrink: shrink,
        }}
        InputProps={name === 'duration' || name === 'repeatNum' ? { inputProps: { min: 1 } } : null}
      />
    </Grid>
  );
};

export default Input;