import React, {useCallback, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import {useDispatch, useSelector } from 'react-redux';
import { getIsSignedIn } from '../../reducks/users/selectors';
import {push} from 'connected-react-router';
import {HeaderMenus, ClosableDrawer} from './index'
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  headerLogo: {
    color: 'red',
    fontSize: 25,
    cursor: 'pointer',
  },
  headerLogoNext: {
    color: 'black'
  },
  menuBar: {
    backgroundColor: '#CCFF99',
    color: '#444',
  },
  toolBar: {
    margin: '0 auto',
    maxWidth: 1024,
    width: '100%'
  },
  iconButtons: {
    margin: '0 0 0 auto'
  }
});


const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const isSignedIn = getIsSignedIn(selector);

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback((event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.type === 'Shift')) {
      return;
    }
    setOpen(!open)
  }, [setOpen, open]);


  return(
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.menuBar}>
        <ToolBar className={classes.toolBar}>
          <h1 
            className={classes.headerLogo}
            onClick={() => dispatch(push('/'))}
          >
            Yasa!!!<span className={classes.headerLogoNext}>ショッピング</span>
          </h1>
          {isSignedIn 
            ? <div className={classes.iconButtons}>
                <HeaderMenus handleDrawerToggle={handleDrawerToggle} />
              </div>
            : <div className={classes.iconButtons}>
                <button onClick={() => dispatch(push('/signin'))}>ログインページへ</button>
              </div>
          }
        </ToolBar>
      </AppBar>
      <ClosableDrawer open={open} onClose={handleDrawerToggle} />
    </div>
  );
};
export default Header;