import React, { useState } from 'react';
import { Grid, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

function Dropdown({ id, idLabel, name, label, handleChangeForm, items, required, value }) {
    const [item, setItem] = useState('');

    if (value && !item) setItem(value);

    const handleChange = (event) => {
        setItem(event.target.value);
        handleChangeForm(event);
    };

    return (
        <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
                <InputLabel id={idLabel}>{label}</InputLabel>
                <Select
                    name={name}
                    labelId={idLabel}
                    id={id}
                    value={item}
                    label={label}
                    onChange={handleChange}
                    required={required}
                >
                    {items.map((i) => (
                        <MenuItem value={i.id}>{i.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}

export default Dropdown;
