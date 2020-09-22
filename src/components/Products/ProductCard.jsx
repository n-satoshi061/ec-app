import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import NoImage from '../../assets/img/src/no_image.png'
import {push} from 'connected-react-router';
import {useDispatch} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MOreVertIcon from '@material-ui/icons/MoreVert';
import {deleteProduct} from '../../reducks/products/operations';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      margin: 8,
      width: 'calc(50% - 16px)'
    },
    [theme.breakpoints.up('sm')]: {
      margin: 16,
      width: 'calc(33.3% - 32px)'
    }
  },
  content: {
    display: 'flex',
    padding: '16px 8px',
    textAlign: 'left',
    '&:last-child': {
      paddingBottom: 16
    }
  },
  media: {
    height: 0,
    paddingTop: '100%'
  },
  price: {
    fontSize: 18
  }
}));

const ProductCard = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const images = (props.images.length > 0) ? props.images : [{path: NoImage}];
  const price = props.price.toLocaleString();

  return(
    <Card className={classes.root}>
      <CardMedia 
        className={classes.media}
        image={props.images[0].path}
        title=""
        onClick={() => dispatch(push('/product/' + props.id))}
      />
      <CardContent className={classes.content}>
        <div onClick={() => dispatch(push('/product/' + props.id))}>
          <Typography color="textSecondary" component="p">
            {props.name}
          </Typography>
          <Typography component="p" className={classes.price}>
            ¥{price}
          </Typography>
        </div>
        {/* <IconButton />をクリックすることでhandleClick()が発火し、setAnchorEl()でanchirElに値がセットされることで、モーダルが開きます。 */}
        <IconButton onClick={handleClick}>
          <MOreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {/* 「編集する」をクリックするとdispatch(deleteProduct(props.id))が発火し、該当するProductsの編集ページへ遷移します。 */}
          <MenuItem
            onClick={() => {
              dispatch(push('/product/edit/' + props.id))
              handleClose()
            }}
          >
            編集する
          </MenuItem>
          {/* 「削除する」をクリックすると、dispatch(deleteProduct(props.id))が発火し、該当するProductsの削除処理が行われます */}
          <MenuItem
            onClick={() => {
              dispatch(deleteProduct(props.id));
              handleClose()
            }}
          >
            削除する
          </MenuItem>

        </Menu>
      </CardContent>
    </Card>
  );
};
export default ProductCard;