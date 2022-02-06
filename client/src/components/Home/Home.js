import React, { useEffect } from 'react';
import Calendar from 'react-awesome-calendar';
import useStyles from './styles';
import { Paper, Box, SpeedDial, SpeedDialAction, Grid } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import { useDispatch } from 'react-redux';
import { getEvents, getEventsByTime } from '../../actions/events';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter/Filter';

function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const events = useSelector((state) => state.events);
  const navigate = useNavigate();

  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  }));

  const actions = [
    { icon: <EventIcon />, name: 'Add new event' }
  ];

  useEffect(() => {
    if (user) {
      dispatch(getEvents());
    }
  }, [dispatch]);

  const handleFilter = (e, form) => {
    e.preventDefault();

    dispatch(getEventsByTime(form));
  }

  return (
    <Paper className={classes.paper} elevation={3}>
      <Grid container justifyContent="center">
        <Grid item xs={9}>
          <Filter user={user} handleFilter={handleFilter} />
        </Grid>
        <Grid item xs={3}>
          {user ? (
            <Box sx={{ position: 'relative', mt: 3, height: 80 }}>
              <StyledSpeedDial
                ariaLabel="SpeedDial"
                icon={<SpeedDialIcon />}
                direction='left'
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => navigate('/add-event')}
                  />
                ))}
              </StyledSpeedDial>
            </Box>
          ) : (
            <>&nbsp;&nbsp;</>
          )}
        </Grid>
      </Grid>


      <Calendar events={events}
        onClickEvent={(event) => navigate(`/edit-event/${event}`)}
      />
    </Paper>
  );
}

export default Home;
