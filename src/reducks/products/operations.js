import {firebaseTimestamp, db} from '../../firebase'
import {push} from 'connected-react-router'
import {fetchProductsAction, deleteProductsAction} from './actions'

const productsRef = db.collection('products')

export const deleteProduct = (id) => {
  return async(dispatch, getState) => {
    // 該当するidの商品情報を、Cloud Firestore上から削除します。
    productsRef.doc(id).delete()
      .then(() => {
        // 現時点でのprosuctsを取得します。その後、filterメソッドで該当する商品情報を配列から削除し、deleteProductAction ()に渡します。
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(product => product.id !== id)
        dispatch(deleteProductsAction(nextProducts))
      })
  }
}


export const fetchProducts = (category) => {
  return async (dispatch) => {
    // DBから取得した結果を更新日時に対する昇順に整理
      let query = productsRef.orderBy('updated_at', 'desc');
      query = (category !== "") ? query.where('category', '==', category) : query;
      query.get()
          .then(snapshots => {
          const productList = []
          snapshots.forEach(snapshot => {
              const product = snapshot.data()
              productList.push(product)
          })
          // fetchProductsActionへ渡します。
          dispatch(fetchProductsAction(productList))
      })
  }
}

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection('users').doc(uid);
    const timestamp = firebaseTimestamp.now();
    let products = [],
        soldOutProducts = [];

        // バッチ(実行処理を事前にひとまとめにしておけるもの)を定義
    const batch = db.batch()

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get()
      const sizes = snapshot.data().sizes;

      const updatedSizes = sizes.map(size => {
        if (size.size === product.size) {
          if(size.quantity === 0) {
            soldOutProducts.push(product.name)
            return size
          }
          return {
            size: size.size,
            quantity: size.quantity -1
          }
        } else {
          return size
        }
      })
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      })
      // ordersに保存したい購入商品の情報をバッチに追加。
      batch.update(
        productsRef.doc(product.productId),
        {sizes: updatedSizes}
      )
      // cartsから購入商品を削除する処理をバッチに追加。
      batch.delete(
        userRef.collection('cart').doc(product.cartId)
      )
    }
    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ?
                            soldOutProducts.join('と') :
                            soldOutProducts[0];
      alert('大変申し訳ありません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しまｓた。')
      return false
    } else {
      // batchに追加した処理を実行し、
      batch.commit()
        .then(() => {
          const orderRef = userRef.collection('orders').doc();
          const date = timestamp.toDate()
          const shippingDate = firebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)))

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp
          }

          orderRef.set(history)

          dispatch(push('/order/complete'))
        }).catch(() => {
          alert('注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。')
          return false
        })
    }
  }
}

export const saveProduct = (id, name, description, category, price, images,sizes) => {
  // 外部DBと通信を行う処理のため、非同期処理
  return async (dispatch) => {
    const timestamp = firebaseTimestamp.now()

    const data = {
      category: category,
      description: description,
      images: images,
      name: name,
      // 引数は文字列として渡ってくるため、parseInt(price, 10),で十進数のint型数値へ変換。
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp
    }
    if (id === "") {
      const ref = productsRef.doc();
      id = ref.id;
      data.id = id
      data.created_at = timestamp
    }
    // set()メソッドを使うことで、Cloud firestore にデータを保存。
    // 最後のreturnで.set(data, {merge: true})とすることで、　既存のフィールド値はそのまま変更箇所のみを更新する、という操作が可能になります。
    return productsRef.doc(id).set(data, {merge: true})
    .then(() => {
      dispatch(push('/'))
    })
    .catch((error) => {
      throw new Error(error)
    })
  }
}