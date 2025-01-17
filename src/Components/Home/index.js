import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import CartContext from '../../context/CartContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  isMounted = false // Add this

  state = {
    RestaurentItemsList: [],
    activeBtn: 'Salads_and_Soup',
    quantity: 1,
  }

  componentDidMount() {
    this.isMounted = true
    this.getAppDetailsApi()
  }

  componentWillUnmount() {
    this.isMounted = false
  }

  getAppDetailsApi = async () => {
    console.log('Jameela:: I am calling server now')
    const url =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

    try {
      const response = await fetch(url)
      console.log('after fetch url ', response)

      if (response.ok) {
        // Add check for response.ok
        const data = await response.json()
        console.log('Jameela:: Data length is', data.length)
        const UpdatedData = data[0].table_menu_list.map(each => ({
          menuCategory: each.menu_category,
          menuCategoryId: each.menu_category_id,
          menuCategoryImage: each.menu_category_image,
          nexturl: each.nexturl,
          categoryDishes: each.category_dishes.map(eachDish => ({
            dishId: eachDish.dish_id,
            dishName: eachDish.dish_name,
            dishPrice: eachDish.dish_price,
            dishImage: eachDish.dish_image,
            dishCurrency: eachDish.dish_currency,
            dishCalories: eachDish.dish_calories,
            dishDescription: eachDish.dish_description,
            dishAvailability: eachDish.dish_Availability || false,
            dishType: eachDish.dish_Type,
            count: 0,
            addonCat: eachDish.addonCat.map(addonDish => ({
              addonCategory: addonDish.addon_category,
              addonCategoryId: addonDish.addon_category_id,
              addonSelection: addonDish.addon_selection,
              nexturl: addonDish.nexturl,
            })),
          })),
        }))

        if (this.isMounted) {
          this.setState({
            RestaurentItemsList: UpdatedData,
            activeBtn: UpdatedData[0].menuCategoryId,
          })
        }
      }
    } catch (error) {
      // Only update state if component is still mounted
      console.log('Api error:', error)
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProductDetailsView = () => (
    <CartContext.Consumer>
      {value => {
        const {quantity, RestaurentItemsList, activeBtn} = this.state

        const activeCategory =
          RestaurentItemsList.find(item => item.menuCategoryId === activeBtn) ||
          RestaurentItemsList[0] ||
          {}

        const {categoryDishes = []} = activeCategory

        const {addCartItem} = value
        const onClickAddToCart = dish => {
          if (activeBtn && dish.count > 0) {
            addCartItem({...dish, quantity})
          }
        }

        const onItemBtnSelect = BtnId => {
          console.log('check BtnId=', BtnId)
          this.setState({activeBtn: BtnId})
        }

        const onDecrementBtn = targetDishId => {
          this.setState(prevState => {
            const updatedList = prevState.RestaurentItemsList.map(category => ({
              ...category,
              categoryDishes: category.categoryDishes.map(dish =>
                dish.dishId === targetDishId && dish.count > 0
                  ? {...dish, count: dish.count - 1}
                  : dish,
              ),
            }))

            const updatedCartCount = updatedList
              .flatMap(category => category.categoryDishes)
              .reduce((acc, dish) => acc + dish.count, 0)

            return {
              RestaurentItemsList: updatedList,
              cartCount: updatedCartCount,
            }
          })
          value.decrementCartItemQuantity(targetDishId) // Sync with CartContext
        }
        const onIncrementBtn = targetDishId => {
          this.setState(prevState => {
            const updatedList = prevState.RestaurentItemsList.map(category => ({
              ...category,
              categoryDishes: category.categoryDishes.map(dish =>
                dish.dishId === targetDishId
                  ? {...dish, count: dish.count + 1}
                  : dish,
              ),
            }))

            const updatedCartCount = updatedList
              .flatMap(category => category.categoryDishes)
              .reduce((acc, dish) => acc + dish.count, 0)

            return {
              RestaurentItemsList: updatedList,
              cartCount: updatedCartCount,
            }
          })
          value.incrementCartItemQuantity(targetDishId) // Sync with CartContext
        }

        return (
          <>
            <ul className="ItemBar">
              {RestaurentItemsList.map(eachBtn => (
                <li className="EachItemDisplay" key={eachBtn.menuCategoryId}>
                  <button
                    className={`itemBtn ${
                      activeBtn === eachBtn.menuCategoryId
                        ? 'activeBtnStyle'
                        : ''
                    }`}
                    type="button"
                    onClick={() => onItemBtnSelect(eachBtn.menuCategoryId)}
                  >
                    {eachBtn.menuCategory}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="CardHolderContainer">
              {categoryDishes.map(eachDishDisplay => (
                <li className="cardContainer" key={eachDishDisplay.dishId}>
                  <div className="textContainer">
                    <div
                      className={
                        eachDishDisplay.dishType === 2
                          ? 'VegNonVegIcon vegIconBorder'
                          : 'VegNonVegIcon nonVegIconBorder'
                      }
                    >
                      <div
                        className={
                          eachDishDisplay.dishType === 2
                            ? 'circleInside vegIcon'
                            : 'circleInside nonVegIcon'
                        }
                      />
                    </div>
                    <div className="displayedText">
                      <h1 className="cardTitle">{eachDishDisplay.dishName}</h1>
                      <p className="cardDishPrice">
                        {eachDishDisplay.dishCurrency}{' '}
                        {eachDishDisplay.dishPrice}
                      </p>
                      <p>{eachDishDisplay.dishDescription}</p>
                      {eachDishDisplay.dishAvailability ? (
                        <>
                          <div className="itemBtnContainer">
                            <button
                              type="button"
                              onClick={() =>
                                onDecrementBtn(eachDishDisplay.dishId)
                              }
                            >
                              -
                            </button>
                            <p className="itemCartCount">
                              {eachDishDisplay.count}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                onIncrementBtn(eachDishDisplay.dishId)
                              }
                            >
                              +
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="dishNotavailable">Not Available</p>
                      )}
                      {eachDishDisplay.addonCat.length > 0 && (
                        <p className="customizationStyle">
                          Customization Available
                        </p>
                      )}
                      {eachDishDisplay.dishAvailability &&
                      eachDishDisplay.count > 0 ? (
                        <div>
                          <button
                            type="button"
                            className="onAddtocartBtn"
                            onClick={() => onClickAddToCart(eachDishDisplay)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="ImgCaloryDisplay">
                    <div>
                      <p className="caloriesDish">
                        {eachDishDisplay.dishCalories} calories
                      </p>
                    </div>

                    <img
                      src={eachDishDisplay.dishImage}
                      alt="dishImg"
                      className="DishImg"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )
      }}
    </CartContext.Consumer>
  )

  render() {
    return (
      <div>
        <Header />
        {this.renderProductDetailsView()}
      </div>
    )
  }
}
export default Home
