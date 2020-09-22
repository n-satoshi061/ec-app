import React from 'react'
import {getUserId, getUsername} from '../reducks/users/selectors'
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../reducks/users/operations';

const Home = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const uid = getUserId(selector)
  const username = getUsername(selector)

  return(
    <div>
      <h2>ホーム</h2>
      <p>ユーザーID:{uid}</p>
      <p>ユーザー名:{username}</p>
      {/* signOut関数の実行 */}
      <button onClick={() => dispatch(signOut())}>サインアウト</button>
    </div>

  );
};
export default Home;