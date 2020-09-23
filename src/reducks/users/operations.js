import {fetchOrdersHistoryAction, fetchProductsInCartAction, fetchProductsInLikeAction, signInAction, signOutAction, fetchFavoritedAction} from './actions';
import {push} from 'connected-react-router';
// src/firebase/indexedDB.jsで定数化したauth、db、FirebaseTimestampをインポート
import { auth, db, firebaseTimestamp } from '../../firebase/index';

const usersRef = db.collection('users')


export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = usersRef.doc(uid).collection('cart').doc();
        addedProduct['cartId'] = cartRef.id;
        await cartRef.set(addedProduct);
    }
}
export const addProductToLike = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const likeRef = usersRef.doc(uid).collection('like').doc();
        addedProduct['likeId'] = likeRef.id;
        await likeRef.set(addedProduct);
    }
}

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = [];

    db.collection('users').doc(uid)
      .collection('orders')
      .orderBy('updated_at', 'desc')
      .get()
      .then((snapshots) => {
        snapshots.forEach(snapshot => {
          const data = snapshot.data()
          list.push(data)
        })
        dispatch(fetchOrdersHistoryAction(list))
      })
  }
}

// この配列を5.src/reducks/users/operations.js内にもう一つ新たに定義したfetchProductsInCart()に渡し、reducers を通じて Redux State の カート情報が更新されます。これを再び3.src/components/Header/HeaderMenus.jsxのセレクターで再取得することで、カートアイコンの右肩の数字が+1される、という流れです。
export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
      dispatch(fetchProductsInCartAction(products))
  }
}
export const fetchProductsInLike = (products) => {
  return async (dispatch) => {
      dispatch(fetchProductsInLikeAction(products))
  }
}

export const listenAuthState = () => {
  // redux-thunkを使用して非同期処理を実行する
  return async (dispatch) => {
    // auth.onAuthStateChanged()というメソッドは、ユーザーの認証状態に応じて、返り値を変える（条件分岐して処理を変えることができる）メソッドです。
    // onAuthStateChanged()メソッドを実行すると、アプリはブラウザ内のindexedDBを見に行き、そこにユーザーに関する情報があれば取ってきて、userという返り値を返します。
    return auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid

        db.collection('users').doc(uid).get()
          .then(snapshot => {
            const data = snapshot.data()

            dispatch(signInAction( {
              isSignedIn: true,
              email: data.email,
              role: data.role,
              uid: uid,
              username: data.username
            }))
          })

      } else {
          dispatch(push('/signin'))
      }
    })
  }
}

// signInの関数
export const signIn = (email, password) => {
  return async (dispatch) => {
    // バリデーション
    if (email === "" || password === "") {
      alert("必須項目が未入力です")
      return false
    }
    // サインイン認証
    auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user
        if (user) {
          const uid = user.uid
          // 上記メソッドの返り値をもとに、DBから具体的なユーザー情報を取り出す。
          db.collection('users').doc(uid).get()
            .then(snapshot => {
              const data = snapshot.data()
              // ユーザー情報をsignInActionに渡すことで、stateの更新を行う。
              dispatch(signInAction( {
                isSignedIn: true,
                email: data.email,
                role: data.role,
                uid: uid,
                username: data.username
              }))

              dispatch(push('/'))
            })
        }
      })
  }
}

// パスワードリセットの関数
export const resetPassword = (email) => {
  return async(dispatch) => {
    if(email === "") {
      alert("必須項目が未入力です")
      return false
    } else {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
          dispatch(push('/signin'))
        })
        .catch(() => {
          alert('パスワードリセットに失敗しました。通信環境の良いところで再度お試しください。')
        })
    }
  }
}

// signUpの関数
export const signUp = (username, email, password, confirmPassword) => {
  // 非同期処理を制御(DB通信時)
  return async (dispatch) => {
    //バリデーション。パスワードが不一致のときはfalseを返す
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です")
      return false
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう一度お試しください。")
      return false
    }
    // メール／パスワード認証によるfirebase側のとの通信を簡単に実装
    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user
        
        if (user) {
          // uidはunique idの略。auth.createUserWithEmailAndPassword()を実行した時点で自動的に生成される(resultの中に含まれる)
          const uid = user.uid
          const timestamp = firebaseTimestamp.now()

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username
          }
          // usersコレクションのうち、上記のuidのところへ、各引数を保存する。保存が完了したら、ルートへリダイレクトする
          db.collection('users').doc(uid).set(userInitialData)
            .then(() => {
              dispatch(push('/'))
            })
            // firestore.rulesで書き込み読み込み権限を許可する
        }
      })
  }
}

// signOut関数
export const signOut = () => {
  return async(dispatch) => {
    // auth.signOut()は、firebase.authとしてのサインアウト処理を行うメソッドです。
    auth.signOut()
      .then(() => {
        // signOutアクションに送る
        dispatch(signOutAction());
        dispatch(push('/signin'));
      })
  }
}