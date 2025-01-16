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
  state = {
    cartCount: 0,
    RestaurentItemsList: [],
    activeBtn: null,
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getAppDetailsApi()
  }

  getAppDetailsApi = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

    const response = await fetch(url)
    const data = await response.json()
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
        dishAvailability: eachDish.dish_Availability,
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
    console.log('data=', UpdatedData)
    this.setState({
      RestaurentItemsList: UpdatedData,
      activeBtn: UpdatedData[0].menuCategoryId,
      apiStatus: apiStatusConstants.success,
    })
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
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
        const {menuCategory} = RestaurentItemsList
        const activeCategory =
          RestaurentItemsList.find(item => item.menuCategoryId === activeBtn) ||
          {}

        const {categoryDishes = []} = activeCategory

        const {addCartItem} = value
        const onClickAddToCart = dish => {
          addCartItem({...dish, quantity})
        }

        return (
          <>
            <ul className="ItemBar">
              {RestaurentItemsList.map(eachBtn => (
                <li className="EachItemDisplay" key={eachBtn.menuCategoryId}>
                  <button
                    className={
                      activeBtn === eachBtn.menuCategoryId
                        ? 'itemBtn activeBtnStyle'
                        : 'itemBtn InactiveBtnStyle'
                    }
                    type="button"
                    onClick={() => this.onItemBtnSelect(eachBtn.menuCategoryId)}
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
                      <p className="cardTitle">{eachDishDisplay.dishName}</p>
                      <p className="cardDishPrice">
                        {eachDishDisplay.dishCurrency}{' '}
                        {eachDishDisplay.dishPrice}
                      </p>
                      <p>{eachDishDisplay.dishDescription}</p>
                      {eachDishDisplay.dishAvailability ? (
                        <div className="itemBtnContainer">
                          <button
                            className="onAddtocartBtn"
                            onClick={() => onClickAddToCart(eachDishDisplay)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      ) : (
                        <p className="dishNotavailable">Not Available</p>
                      )}
                      {eachDishDisplay.addonCat.length > 0 && (
                        <p className="customizationStyle">
                          Customization Available
                        </p>
                      )}
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

  onItemBtnSelect = BtnId => {
    console.log('check BtnId=', BtnId)
    this.setState({activeBtn: BtnId})
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}
export default Home
