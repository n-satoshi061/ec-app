import React, {useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';
import {getProductsInCart, getProductsInLike, getUserId} from '../../reducks/users/selectors';
import {useSelector, useDispatch} from 'react-redux';
import {db} from '../../firebase/index';
import {fetchProductsInCart, fetchProductsInLike} from "../../reducks/users/operations";
import {push} from 'connected-react-router';

const HeaderMenus = (props) => {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const userId = getUserId(selector);
  let productsInCart = getProductsInCart(selector);
  let productsInLike = getProductsInLike(selector);

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).collection('cart')
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          const product = change.doc.data();
          const changeType = change.type
          switch (changeType) {
            case 'added':
              productsInCart.push(product);
              break;
            case 'modified':
              const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
              productsInCart[index] = product;
              break;
            case 'removed':
              productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
              break;
            default:
              break;
          }
        })
        dispatch(fetchProductsInCart(productsInCart))
      })
      return () => unsubscribe();
  }, []);

  useEffect(() => {
    let list = [];
    const unsubscribe = db.collection('users').doc(userId).collection('like')
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          const product = change.doc.data();
          const id = change.doc.id
          const changeType = change.type
          console.log(changeType)

          switch (changeType) {
            case 'added':
              list.push(product);
              break;
            case 'modified':
              const index = list.findIndex(product => product.id === id)
              list[index] = product;
              break;
            case 'removed':
              list = list.filter(product => product.likeId !== id)
              break;
            default:
              break;
          }
        })
        dispatch(fetchProductsInLike(list))
      })
      return () => unsubscribe();
  }, []);


  return(
    <>
      <IconButton onClick={() => dispatch(push('/cart'))}>
        <Badge badgeContent={productsInCart.length} color="secondary">
        <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton onClick={() => dispatch(push('/like'))}>
        <Badge badgeContent={productsInLike.length} color="secondary">
          <FavoriteBorderIcon />
        </Badge>
      </IconButton>
      <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
        <MenuIcon />
      </IconButton>
    </>
  );
};
export default HeaderMenus;