import React from 'react';
// import { getThemeProps } from '@material-ui/styles';

const ImagePreview = (props) => {
  return(
    <div className="p-media__thumb" onClick={() => props.delete(props.id)}>
      <img src={props.path} alt="プレビュー画像"/>
    </div>

  );
};
export default ImagePreview;