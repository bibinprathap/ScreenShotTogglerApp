import React from 'react'
import { AppState, Platform, View } from 'react-native'

const SecurityScreen = () => <View />

const showSecurityScreenFromAppState = appState =>
  ['background', 'inactive'].includes(appState)

const withSecurityScreenIOS = Wrapped => {
  return class WithSecurityScreen extends React.Component {
    state = {
      showSecurityScreen: showSecurityScreenFromAppState(AppState.currentState)
    }

    componentDidMount () {
      AppState.addEventListener('change', this.onChangeAppState)
    }
  
    componentWillUnmount () {
      AppState.removeEventListener('change', this.onChangeAppState)
    }
  
    onChangeAppState = nextAppState => {
      const showSecurityScreen = showSecurityScreenFromAppState(nextAppState)

      this.setState({ showSecurityScreen })
    }  

    render() {
      return this.state.showSecurityScreen
        ? <SecurityScreen />
        : <Wrapped {...this.props} />
    }
  }
}

const withSecurityScreenAndroid = Wrapped => Wrapped

export const withSecurityScreen = Platform.OS === 'ios'
  ? withSecurityScreenAndroid
  : withSecurityScreenIOS