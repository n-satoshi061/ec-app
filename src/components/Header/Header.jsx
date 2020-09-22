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

  // Drawerメニュー開閉の関数
  // openの論理値を反転させるhandleDrawerToggle()を定義します。event.type === "keydown" && ...は、「TabキーとShiftキーをクリックした時はDrawerメニューを閉じない」ことを制御する条件文です。
  const handleDrawerToggle = useCallback((event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.type === 'Shift')) {
      return;
    }
    setOpen(!open)
  }, [setOpen, open]);


  return(
    // <AppBar>の中に <Toolbar>を記述することで、ヘッダーを実装できます。
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.menuBar}>
        <ToolBar className={classes.toolBar}>
          <h1 
            className={classes.headerLogo}
            onClick={() => dispatch(push('/'))}
          >
            Yasa!!!<span className={classes.headerLogoNext}>ショッピング</span>
            {/* メニューアイコンを表示する<HeaderMenus>要素はログイン状態でのみ表示させたいので、条件分岐 */}
          </h1>
          {isSignedIn 
            ? <div className={classes.iconButtons}>
              {/* <HeaderMenus/>へhandleDrawerToggle()を渡します。<HeaderMenus/>をクリックしたときにこの関数が動作する(Drawerメニューが開く)よう実装します。 */}
                <HeaderMenus handleDrawerToggle={handleDrawerToggle} />
              </div>
            : <div className={classes.iconButtons}>
                <button onClick={() => dispatch(push('/signin'))}>ログインページへ</button>
              </div>
          }
        </ToolBar>
      </AppBar>
      {/* これから実装する<ClosableDrawer/>へ、openとhandleDrawerToggleを渡します。これにより、Drawerメニューの開閉自体を制御します。 */}
      <ClosableDrawer open={open} onClose={handleDrawerToggle} />
    </div>
  );
};
export default Header;