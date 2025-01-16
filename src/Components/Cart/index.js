import Header from '../Header'
import CartListView from '../CartListView'

import CartContext from '../../context/CartContext'

import './index.css'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, removeAllCartItems} = value
      const showEmptyView = cartList.length === 0
      const onClickremoveallItems = () => {
        removeAllCartItems()
      }
      console.log('cartList=', cartList)
      return (
        <>
          <Header />
          <div className="cart-container">
            {showEmptyView ? (
              <>
                <div className="cart-empty-view-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                    className="cart-empty-img"
                    alt="cart empty"
                  />
                  <h1 className="cart-empty-heading">Your Cart Is Empty</h1>
                </div>
              </>
            ) : (
              <div className="cart-content-container">
                <h1 className="cart-heading">My Cart</h1>
                <div className="removeallBtn_container">
                  <button
                    className="removeall_btn"
                    onClick={onClickremoveallItems}
                  >
                    Remove All
                  </button>
                </div>
                <CartListView />
                {/* TODO: Add your code for Cart Summary here */}
              </div>
            )}
          </div>
        </>
      )
    }}
  </CartContext.Consumer>
)
export default Cart
