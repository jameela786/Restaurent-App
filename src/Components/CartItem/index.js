import CartContext from '../../context/CartContext'
import './index.css'

const CartItem = props => (
  <CartContext.Consumer>
    {value => {
      const {
        removeCartItem,
        decrementCartItemQuantity,
        incrementCartItemQuantity,
      } = value

      const {cartItemDetails} = props
      const {dishId, quantity, dishPrice, dishImage, dishName} = cartItemDetails

      const onRemoveCartItem = () => {
        removeCartItem(dishId)
      }

      const onDecrementItem = () => {
        decrementCartItemQuantity(dishId)
      }

      const onIncrementItem = () => {
        incrementCartItemQuantity(dishId)
      }

      return (
        <li className="cart-item">
          <img className="cart-product-image" src={dishImage} alt={dishName} />
          <div className="cart-item-details-container">
            <div className="cart-product-title-brand-container">
              <p className="cart-product-title">{dishName}</p>
            </div>
            <div className="cart-quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onDecrementItem}
                aria-label="-"
              >
                -
              </button>
              <p className="cart-quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onIncrementItem}
                aria-label="+"
              >
                +
              </button>
            </div>
            <div className="total-price-container">
              <p className="cart-total-price">SAR {dishPrice * quantity}</p>
            </div>
          </div>
          <button
            className="delete-button"
            type="button"
            onClick={onRemoveCartItem}
          >
            Remove
          </button>
        </li>
      )
    }}
  </CartContext.Consumer>
)

export default CartItem
