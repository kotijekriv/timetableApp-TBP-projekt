import React, { useState } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Filter({ handleFilter, user }) {
  const initialState = { start: '', end: '' };
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    handleFilter(e, form);
  }

  return (
    user ? (
      <form >
        <Grid container columnSpacing={2} sx={{ marginTop: 5, marginBottom: 7 }}>
          <Grid item >
            <TextField type='datetime-local' onChange={handleChange} name="start" label="Start" variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item>
            <TextField type='datetime-local' onChange={handleChange} name="end" label="End" variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item >
            <Button onClick={handleSubmit} variant='contained' sx={{ height: 55 }}>
              <SearchIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    ) : (<></>)
  );
}

export default Filter;
