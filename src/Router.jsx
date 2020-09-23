import React from 'react'
import {Switch, Route} from 'react-router';
import {
  SignUp, SignIn, Reset, ProductEdit, ProductList, 
  ProductDetail, CartList, OrderConfirm, OrderHistory, 
  LikeList, UserMyPage, CheckoutWrapper
} from './templates'
import Auth from './Auth'

// ルーティングの設定
const Router = () => {
  return(
    <Switch>
      <Route exact path={"/signup"} component={SignUp} />
      <Route exact path={"/signin"} component={SignIn} />
      <Route exact path={"/signin/reset"} component={Reset} />

{/* 認証のリッスンが必要なためAuthコンポーネントでラッピング */}
      <Auth>
        <Route exact path={"(/)?"} component={ProductList} />
        <Route exact path={"/product/:id"} component={ProductDetail} />
        {/* exact path -> pathとすることで、ルーティングの条件が完全一致から部分一致に切り替わります。 */}
        <Route path={"/product/edit(/:id)?"} component={ProductEdit} />
        <Route exact path={"/cart"} component={CartList} />
        <Route exact path={"/like"} component={LikeList} />

        <Route exact path={"/order/confirm"} component={OrderConfirm} />
        <Route exact path={"/order/history"} component={OrderHistory} />
        <Route exact path={"/user/mypage"} component={UserMyPage} />
        <Route exact path={"/user/payment/edit"} component={CheckoutWrapper} />
      </Auth>
    </Switch>

  );
};
export default Router;