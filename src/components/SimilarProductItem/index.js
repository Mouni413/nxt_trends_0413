// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productItem} = props
  const {imageUrl, title, brand, price, rating} = productItem
  return (
    <li className="similar-item">
      <img src={imageUrl} alt="similar product" className="similar-thumbnail" />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-product-details">
        <p className="similar-price">Rs {price}/-</p>
        <div className="similar-rating-container">
          <p className="similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
