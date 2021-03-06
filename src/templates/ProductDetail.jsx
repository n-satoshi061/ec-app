import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {db, firebaseTimestamp} from '../firebase/index';
import {makeStyles} from '@material-ui/styles';
import HTMLReactParser from 'html-react-parser';
import {ImageSwiper, SizeTable} from '../components/Products/index'
import {addProductToCart, addProductToLike} from '../reducks/users/operations'
import {getUserId} from '../reducks/users/selectors';

const useStyles = makeStyles((theme) => ({
  // smサイズの幅をブレイクポイントとして、適用するスタイルを変更しています。
  sliderBox: {
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 24px auto',
      height: 320,
      width: 320
    },
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
      width: 400,
      height: 400
    }
  },
  detail: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 24px auto',
      height: 'auto',
      width: 320
    },
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
      height: 'auto',
      width: 400,
    }
  },
  price: {
    fontSize: 36
  }
}));

// 改行コード\nを、改行のHTMLタグ<br />に変換しています。この関数に用いているhtml-react-parserは、この時点ではインストールしていないはずなので、npm からインストールします。
const returnCodeToBr = (text) => {
  if (text === "") {
    return text
  } else {
    return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
  }
};

const ProductDetail = () => {
  const classes = useStyles();
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const uid = getUserId(selector);
  const path = selector.router.location.pathname;
  const id = path.split('/product/')[1];

  const [product, setProduct] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false)

  // 初期レンダー時に、DBから該当するidの情報を取得します。
  useEffect(() => {
    db.collection('products').doc(id).get()
      .then(doc => {
        const data = doc.data();
        setProduct(data)
      })
  }, []);

  // productsコレクションから該当する商品情報を取り出してcartサブコレクションへ保存するための配列として整形する、addProduct()関数を定義します。
  const addProduct = useCallback((selectedSize) => {
    const timestamp = firebaseTimestamp.now();
    // ここで作られたcart用の配列は、5.src/reducks/users/operations.js内で定義するaddProductToCart()に渡り、Cloud Firestoreへ送信され、cartサブコレクションに保存されます。
    dispatch(addProductToCart({
      added_at: timestamp,
      description: product.description,
      images: product.images,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      size: selectedSize
    }))
  }, [product])

  const toggleLike =  useCallback((selectedSize) => {
    console.log(isFavorited)
    // 現在がお気に入りされていない状態なら追加
    if(!isFavorited) {
      setIsFavorited((isFavorited) => !isFavorited)
      const timestamp = firebaseTimestamp.now();
      dispatch(addProductToLike({
        added_at: timestamp,
        description: product.description,
        images: product.images,
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        size: selectedSize
      }))
      // 現在がお気に入りされている状態なら削除
    } else {
      setIsFavorited((isFavorited) => !isFavorited)
      return db.collection('users').doc(uid)
              .collection('like').doc(id)
              .delete()
    }
  }, [product, isFavorited])



  return(
    <section className="c-section-wrapin">
      {product && (
        <div className="p-grid__row">
          <div className={classes.sliderBox}>
            <ImageSwiper images={product.images}/>
          </div>
          <div className={classes.detail}>
            <h2 className="u-text__headline">{product.name}</h2>
            <p className={classes.price}>{product.price.toLocaleString()}円</p>
            <div className="module-spacer--small" />
            <SizeTable addProduct={addProduct} toggleLike={toggleLike} isFavorited={isFavorited} product={product} sizes={product.sizes} />
            <div className="module-spacer--small" />
            <p>{returnCodeToBr(product.description)}</p>
          </div>
        </div>
      )}
    </section>
  );
};
export default ProductDetail;