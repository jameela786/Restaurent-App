import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import CartContext from '../../context/CartContext'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderCartItemsCount = () => (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length

        return (
          <>
            {cartItemsCount > 0 ? (
              <span className="cart-count-badge">{cartList.length}</span>
            ) : null}
          </>
        )
      }}
    </CartContext.Consumer>
  )

  return (
    <>
      <nav className="nav-header">
        <div className="nav-content">
          <div className="nav-bar-large-container">
            <Link to="/" className="nav_header_display">
              <h1 className="HomeIconHeader">UNI Resto Cafe</h1>
            </Link>
            <ul className="nav-menu">
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  My Orders
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/cart" className="nav-link-cart" data-testid="cart">
                  <AiOutlineShoppingCart size={28} />
                  {renderCartItemsCount()}
                </Link>
              </li>
              <li className="nav-menu-item">
                <button
                  type="button"
                  className="logout-desktop-btn"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default withRouter(Header)
