import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
    appBar: {
        borderRadius: 5,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px'
    },
    userName: {
        display: 'flex',
        alignItems: 'center'
    },
    profile: {
        display: 'flex'
    }
}));