import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { API_URI, POSTFIX } from "../../const";
import { sumCount, sumPrice } from "../../utils/calcCountAndPrice";
import { orderApi, } from './orderApi';


const orderList = JSON.parse(localStorage.getItem('order') || '[]')

const initialState = {
  orderList,
  prepareQuery: '',
  orderGoods: [],
  totalPrice: 0,
  totalCount: 0,
  error: [],
};

// export const localStorageMiddleware = store => next => action => {
//   const nextAction = next(action)
//   if (nextAction.type.startsWith('order/')) {
//     const orderList = store.getState().order.orderList
//     localStorage.setItem('order', JSON.stringify(orderList))
//   }
//   return nextAction
// }


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    loadFromLocalStorage(state) {
      const storageData = localStorage.getItem('order')
      if (!!storageData) {
        state.orderGoods = JSON.parse(storageData)
      }
    },
    addProduct: (state, action) => {
      const itemInOrderList = state.orderList.find(
        item => item.id === action.payload.id
      )

      if (itemInOrderList) {
        itemInOrderList.count++
      }
      else {
        state.orderList.push({ id: action.payload.id, count: 1 })
        state.orderGoods.push(action.payload)
        state.prepareQuery = state.orderList.map(order => order.id).join(',')
      }
      state.totalCount = sumCount(state.orderList)
    },
    removeProduct: (state, action) => {
      const itemInOrderList = state.orderList.find(
        item => item.id === action.payload.id
      )
      if (itemInOrderList) {
        if (itemInOrderList.count > 1) {
          itemInOrderList.count--
        }
        else {
          state.orderList = state.orderList.filter(
            item => item.id !== action.payload.id
          )
          state.orderGoods = state.orderGoods.filter(
            item => item.id !== action.payload.id
          )
          state.prepareQuery = state.orderList.map(order => order.id).join(',')
        }
      }
    state.totalCount = sumCount(state.orderList)
    },
    clearOrder: (state) => {
      state.orderList = []
      state.orderGoods = []
    }
  },
})

export const { addProduct, loadFromLocalStorage, removeProduct, clearOrder } = orderSlice.actions;
export default orderSlice.reducer