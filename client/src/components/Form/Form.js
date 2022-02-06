import React, { useEffect, useState } from 'react';
import EventIcon from '@mui/icons-material/Event';
import Input from './Input';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import useStyles from './styles';
import Dropdown from './Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjects } from '../../actions/subjects';
import { getEventTypes } from '../../actions/eventTypes';
import { createEvent, editEvent, deleteEvent, getEvent } from '../../actions/events';

function Form() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isAdd = eventId == null;
  const initialState = { eventId: '', title: '', subject: '', start: '', duration: '', eventType: '', repeatNum: '', repeatTxt: '', repeatEnd: '' };
  const subjects = useSelector((state) => state.subjects);
  const eventTypes = useSelector((state) => state.eventTypes);
  const event = useSelector((state) => state.events);
  const [form, setForm] = useState(initialState);

  if (event.id && form.eventId === '') {
    setForm({
      eventId: event.id, title: event.title, subject: event.subject, start: event.start_time,
      duration: (new Date(event.end_time) - new Date(event.start_time)) / 3600000,
      eventType: event.event_type, repeatNum: 0, repeatTxt: '', repeatEnd: ''
    });
  }

  const repeatText = [
    { id: 'days', name: 'days' },
    { id: 'weeks', name: 'weeks' },
    { id: 'months', name: 'months' }
  ];

  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEventTypes());
  }, [dispatch]);

  useEffect(() => {
    if (!isAdd) {
      dispatch(getEvent({ eventId: parseInt(eventId) }));
    }
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdd) {
      dispatch(createEvent(form, navigate));
    } else {
      dispatch(editEvent(form, navigate));
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();

    console.log(form);

    dispatch(deleteEvent(form, navigate));
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'duration' || name === 'repeatNum') {
      setForm({ ...form, [name]: parseInt(value) });

    } else {
      setForm({ ...form, [name]: value });
    }

  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <EventIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{isAdd ? 'Add event' : 'Edit event'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Input name="title" label="Title"
              handleChange={handleChange} required={true} type={'text'}
              value={form.title}
              shrink={form.title ? true : false}
            />
            <Dropdown
              id="subject-select" idLabel="subject-select-label" name="subject" label="Subject"
              value={form.subject}
              handleChangeForm={handleChange}
              items={subjects} required={true}
            />
            <Input
              name="start" label="Start time"
              handleChange={handleChange} required={true}
              value={form.start?.length >= 17 ? form.start?.substring(0, form.start?.length - 8) : form.start}
              type={'datetime-local'} shrink={true}
            />
            <Input
              name="duration" label="Duration in hours"
              handleChange={handleChange} required={true} type={'number'}
              value={form.duration}
              shrink={event.duration || form.duration ? true : false}
            />
            <Dropdown
              id="eventType-select" idLabel="eventType-select-label" name="eventType" label="Event type"
              handleChangeForm={handleChange} items={eventTypes} required={true} value={form.eventType}
            />
            {isAdd ? (<Input name="repeatNum" label="Repeat num." handleChange={handleChange} type={'number'} />) : <></>}
            {form.repeatNum ? (
              <>
                <Dropdown
                  id="repeat-select" idLabel="repeat-select-label" name="repeatTxt" label="Repeat period"
                  handleChangeForm={handleChange} items={repeatText} required={form.repeat_num ? true : false}
                />
                <Input
                  name="repeatEnd" label="End date" handleChange={handleChange}
                  required={form.repeat_num ? true : false} type={'datetime-local'} shrink={true}
                />
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid container justifyContent="center">
            {!isAdd ? (
              <Grid item xs={8}>
                <Button className={classes.submit} onClick={handleDelete}>Delete</Button>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={isAdd ? 12 : 4}>
              <Button onClick={handleSubmit} fullWidth variant="contained" color="primary" className={classes.submit}>Save</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container >
  )
}

export default Form;
