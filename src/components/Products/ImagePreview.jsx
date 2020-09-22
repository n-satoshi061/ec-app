import React from 'react';

// 画像プレビュー部分のみを担当するコンポーネント。imageArea.jsxに配置する。
const ImagePreview = (props) => {
  return(
    <div className="p-media__thumb" onClick={() => props.delete(props.id)}>
      <img src={props.path} alt="プレビュー画像"/>
    </div>

  );
};
export default ImagePreview;