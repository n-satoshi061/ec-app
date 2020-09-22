import React, {useState, useCallback} from 'react'
import {TextInput, PrimaryButton} from '../components/UIkit/index'
import {signIn} from '../reducks/users/operations'
import {useDispatch} from 'react-redux'
import {push} from 'connected-react-router';

// SignInコンポーネント
const SignIn = () => {
  const dispatch = useDispatch()
  // stateの定義。サインインに必要な情報はメールアドレスとパスワードのみ
  const [email, setEmail] = useState(""),
        [password, setPassword] = useState("")

  // useCallbackで関数をpropsとして渡せるようにする
  const inputEmail = useCallback((event) => {
    setEmail(event.target.value)
  }, [setEmail]);

  const inputPassword = useCallback((event) => {
    setPassword(event.target.value)
  }, [setPassword]);

  return(
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">サインイン</h2>
      <div className="module-spacer--medium" />

      <TextInput
        fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
        rows={1} value={email} type={"email"} onChange={inputEmail}
      />
      <TextInput
        fullWidth={true} label={"パスワード"} multiline={false} required={true}
        rows={1} value={password} type={"password"} onChange={inputPassword}
      />
      <div className="module-spacer--medium" />
      <div className="center">
      <PrimaryButton
        label={"Sign In"}
        // operations.jsのsignIn関数に飛ばす
        onClick={() => dispatch(signIn(email, password))}
      />
      <p onClick={() => dispatch(push('/signup'))}>アカウントをお持ちでない方はこちら</p>
      <p onClick={() => dispatch(push('/signin/reset'))}>パスワードを忘れた方はこちら</p>
      </div>
    </div>
  );
};
export default SignIn;