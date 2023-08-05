// Write your code here
import './index.css'

import Cookies from 'js-cookie'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import {Link} from 'react-router-dom'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

const productDetailApiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apistatus: productDetailApiStatusConstants.initial,
    productDetails: {},
    productCount: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apistatus: productDetailApiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const productApiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachItem => ({
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          style: eachItem.style,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        })),
      }
      this.setState({
        productDetails: updatedData,
        apistatus: productDetailApiStatusConstants.success,
      })
    } else {
      this.setState({apistatus: productDetailApiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickIncrementButton = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  onClickDecrementButton = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  renderSuccesView = () => {
    const {productDetails, productCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
      similarProducts,
    } = productDetails
    return (
      <div className="success-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-detail-image" />
          <div className="product-details">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price} /-</p>
            <div className="rating-and-reviews-container">
              <p className="ratings-container">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </p>
              <p className="product-review">{totalReviews} reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="product-available">
              <p>Available : </p>
              <p className="availability">{availability}</p>
            </div>
            <div className="product-available">
              <p>Brand : </p>
              <p className="availability">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="no-of-products-container">
              <button
                type="button"
                className="increase-decrease-button"
                onClick={this.onClickDecrementButton}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="product-count">{productCount}</p>
              <button
                type="button"
                className="increase-decrease-button"
                onClick={this.onClickIncrementButton}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similiar-products-heading">Similar Products</h1>
          <ul className="similar-products-display-container">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                productItem={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-product-details-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductItems = () => {
    const {apistatus} = this.state
    switch (apistatus) {
      case productDetailApiStatusConstants.loading:
        return this.renderLoading()
      case productDetailApiStatusConstants.success:
        return this.renderSuccesView()

      case productDetailApiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItems()}
      </>
    )
  }
}

export default ProductItemDetails
