import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {PrimaryButton, TextDetail} from '../components/UIkit'
import {getUsername} from '../reducks/users/selectors'
import {push} from 'connected-react-router'


const UserMyPage = () => {
  const selector = useSelector(state => state)
  const username = getUsername(selector)
  const dispatch = useDispatch()
  const transition = useCallback((path) => {
    dispatch(push(path))
  }, [dispatch])
  return (
    <section className='c-section-container'>
      <h2 className="u-text__headline u-text-center">マイページ</h2>
      <div className="module-spacer--medium" />
      <TextDetail label={"ユーザー名"} value={username} />
      <div className="center" />
        <PrimaryButton 
            label={"カード情報の編集"} 
            onClick={() => transition('/user/payment/edit')} 
        />
        <PrimaryButton 
            label={"注文履歴の確認"} 
            onClick={() => transition('/order/history')} 
        />
    </section>
  )
}

export default UserMyPage
