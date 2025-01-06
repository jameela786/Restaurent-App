import {Component} from 'react'
import './index.css'
import {AiOutlineShoppingCart} from 'react-icons/ai'

class Home extends Component {
  state = {
    cartCount: 0,
    RestaurentItemsList: [],
    activeBtn: null,
  }

  componentDidMount() {
    this.getAppDetailsApi()
  }

  getAppDetailsApi = async () => {
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
    })
  }

  onItemBtnSelect = BtnId => {
    console.log('check BtnId=', BtnId)
    this.setState({activeBtn: BtnId})
  }

  onDecrementBtn = targetDishId => {
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
  }

  onIncrementBtn = targetDishId => {
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
  }

  render() {
    const {cartCount, RestaurentItemsList, activeBtn} = this.state
    const {menuCategory} = RestaurentItemsList
    const activeCategory =
      RestaurentItemsList.find(item => item.menuCategoryId === activeBtn) || {} // Default to an empty object if no active category

    const {categoryDishes = []} = activeCategory // Safely access categoryDishes

    return (
      <div>
        <div className="HeaderNavbar">
          <h1 className="HomeIconHeader">UNI Resto Cafe</h1>
          <div className="cartIcon">
            <p className="myordersHeader">My Orders</p>
            <AiOutlineShoppingCart size={28} />
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
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
                    {eachDishDisplay.dishCurrency} {eachDishDisplay.dishPrice}
                  </p>
                  <p>{eachDishDisplay.dishDescription}</p>
                  {eachDishDisplay.dishAvailability ? (
                    <div className="itemBtnContainer">
                      <button
                        className="decrementBtn"
                        onClick={() =>
                          this.onDecrementBtn(eachDishDisplay.dishId)
                        }
                      >
                        -
                      </button>
                      <p className="itemCartCount">{eachDishDisplay.count}</p>
                      <button
                        className="incrementBtn"
                        onClick={() =>
                          this.onIncrementBtn(eachDishDisplay.dishId)
                        }
                      >
                        +
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
      </div>
    )
  }
}
export default Home
