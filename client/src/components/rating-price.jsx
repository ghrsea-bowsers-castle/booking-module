import React from "react";
import Starratings from 'react-star-ratings';

import styles from '../css/style.css';

console.log(styles);


const Price = props => {
  return <div className={styles.funky}>
    <p> ${props.data && props.data.price} a night</p>
    <Starratings 
    rating = {props.rating}
    starDimension = '20px'/>
    
  </div>
}

 
export default Price;