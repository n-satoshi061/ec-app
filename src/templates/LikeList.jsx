import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from '@material-ui/core/List';
import { getProductsInLike } from '../reducks/users/selectors';
import {LikeListItem} from '../components/Products';
import { GreyButton } from '../components/UIkit';
import {push} from 'connected-react-router';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
    maxWidth: 512,
    width: '100%'
  }
})

const LikeList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const productsInLike = getProductsInLike(selector);

  const backToHome = useCallback(() => {
    dispatch(push('/'))
  }, [])

  return(
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">
        お気に入りリスト
      </h2>
      <List className={classes.root}>
        {productsInLike.length > 0 && (
          productsInLike.map(product => <LikeListItem product={product} key={product.likeId} />)
        )}
      </List>
      <div className="module-spacer--medium" />
      <div className="module-spacer--extra-extra-small" />
      <GreyButton label={"商品一覧に戻る"} onClick={backToHome} />
    </section>
  );
};
export default LikeList;