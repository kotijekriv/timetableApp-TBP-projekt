import React, { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOGOUT } from '../../constants/actionTypes';
import decode from 'jwt-decode';

function Navbar() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        handleClose();
        
        dispatch({ type: LOGOUT });

        navigate('/auth');
        
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <Button href="/">My Calendar</Button>
            <Toolbar>
                {user ? (
                    <div className={classes.profile}>
                        <Typography className={classes.userName}>{user?.result.name} {user?.result.surname}</Typography>
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Button variant="contained" href="/auth">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;
