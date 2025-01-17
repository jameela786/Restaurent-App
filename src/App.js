import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './Components/Home'
import LoginForm from './Components/LoginForm'
import Cart from './Components/Cart'
import ProtectedRoute from './Components/ProtectedRoute'
import CartContext from './context/CartContext'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = product => {
    console.log('product in app = ', product)
    this.setState(prevState => {
      const {cartList} = prevState
      const itemExists = cartList.find(item => item.dishId === product.dishId)

      // If item exists in cart, increment its quantity
      if (itemExists) {
        const updatedCartList = cartList.map(item =>
          item.menuCategoryId === product.menuCategoryId
            ? {...item, quantity: item.quantity + product.quantity}
            : item,
        )
        return {cartList: updatedCartList}
      }

      // If item doesn't exist, add it to cartList
      return {cartList: [...cartList, product]}
    })

    //   TODO: Update the code here to implement addCartItem
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(each => each.dishId !== id)
    this.setState({cartList: updatedCartList})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const itemToUpdate = prevState.cartList.find(item => item.dishId === id)
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        const updatedItem = {
          ...itemToUpdate,
          quantity: itemToUpdate.quantity - 1,
        }

        const updatedCartList = prevState.cartList.map(item =>
          item.dishId === id ? updatedItem : item,
        )

        return {cartList: updatedCartList}
      }

      const updatedCartList = prevState.cartList.filter(
        item => item.dishId !== id,
      )
      return {cartList: updatedCartList}
    })
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => {
      const itemToUpdate = prevState.cartList.find(item => item.dishId === id)
      if (itemToUpdate) {
        const updatedItem = {
          ...itemToUpdate,
          quantity: itemToUpdate.quantity + 1,
        }

        const updatedCartList = prevState.cartList.map(item =>
          item.dishId === id ? updatedItem : item,
        )

        return {cartList: updatedCartList}
      }

      return null
    })
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
