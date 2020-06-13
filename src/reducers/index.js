import { combineReducers } from 'redux'
import * as actionTypes from '../actions/types'

const initialUserState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}

const initialChannelState = {
    currentChannel: null
}

const channel_reducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        default:
            return state;
    }
}

const rootreducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer //All of the channel data will exist in this property, in the global state
})

export default rootreducer;
