import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getIsSignedIn} from './reducks/users/selectors'
import {listenAuthState} from './reducks/users/operations';

// Authコンポーネント
// childrenとは、「子要素全体」を意味する特別なpropsです。
const Auth = ({children}) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const isSignedIn = getIsSignedIn(selector);
  
  useEffect((isSignedIn) => {
    if (!isSignedIn) {
      // operations.jsで定義したlistenAuthStateが実行される
      dispatch(listenAuthState())
    }
  }, [dispatch]);
  if (!isSignedIn) {
    return <></>
  } else {
    return children
  }

};
export default Auth;