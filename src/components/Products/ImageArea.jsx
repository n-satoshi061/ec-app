import React, {useCallback} from 'react';
import {storage} from "../../firebase/index"
import {makeStyles} from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import {ImagePreview} from "./index";

const useStyles = makeStyles({
    icon: {
        marginRight: 8,
        height: 48,
        width: 48
    }
})

// 画像プレビューおよび画像登録ボタンなどを含んだコンポーネント。ProductEdit.jsxに配置する。
const ImageArea = (props) => {
    const classes = useStyles();
    const images = props.images;

    const deleteImage = useCallback(async (id) => {
        const ret = window.confirm('この画像を削除しますか？')
        if (!ret) {
            return false
        } else {
            // クリックした画像以外の画像ファイル情報(idとpath)を取り出しています。
            const newImages = images.filter(image => image.id !== id)
            // props.setImages()に渡すことで、React側の images state から、該当画像の情報を削除しています。
            props.setImages(newImages);
            // 該当画像を Cloud Storage から削除し、完全に画像登録をする前の状態に戻します。
            return storage.ref('images').child(id).delete()
        }
    }, [props.images])

    // 画像アップロードの関数
    const uploadImage = useCallback((event) => {
        // fileには、登録したい画像データそのものが入っているイメージ。
        const file = event.target.files;
        // 画像データを Blobオブジェクトに変換しています
        let blob = new Blob(file, { type: "image/jpeg" });

        // Generate random 16 digits strings
        const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N=16;
        // アップロードする画像ファイルにユニークなidを付与するために、idとして使用する16文字のランダムな文字列を生成しています。
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('')

        const uploadRef = storage.ref('images').child(fileName);
        const uploadTask = uploadRef.put(blob);

        // アップロードした画像ファイルのdownloadURLを取得し、idとあわせてnewImageに格納します
        uploadTask.then(() => {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                const newImage = {id: fileName, path: downloadURL};
                // newImagesで images state を完全に書き換えるのではなく「既存の値はそのまま新規に値を追加をする」という処理が行えます。
                // 登録画像を2枚目、3枚目と複数枚の画像ファイルの情報をimagesに入れることができるようになります。
                props.setImages((prevState => [...prevState, newImage]))
            });
        }).catch(() => {
        });
    }, [props.setImages])

    return (
        <div>
            <div className="p-grid__list-images">
            {/* React では、&&を用いることで、JSX要素の表示・非表示を条件分岐するさせることができます。 */}
                {images.length > 0 && (
                    images.map(image => <ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id} /> )
                )}
            </div>
            <div className="u-text-right">
                <span>商品画像を登録する</span>
                <IconButton className={classes.icon}>
                    <label>
                        <AddPhotoAlternateIcon />
                        <input className="u-display-none" type="file" id="image" onChange={e => uploadImage(e)}/>
                    </label>
                </IconButton>
            </div>
        </div>
    );
};

export default ImageArea;