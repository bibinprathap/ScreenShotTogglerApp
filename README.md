# ScreenShotTogglerApp

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ react-native run-android/react-native ios
```
# Test Implementation
I used react-test-renderer, jest  for  implement Testing 

```sh
$ npm run test
```
# Android Implementation
To implement this behavior in React Native i need to use some Java code for Android.

# iOS Implementation
We can’t prevent users from taking a screenshot in iOS unfortunately. We can adopt something like Snapchat does, which is forcing users to touch the screen to keep seeing the content. When a user tries to take screenshot, the user will stop touchint the screen. However this will be not be a good UX is most cases.
On iOS, i can use a react-native feature called AppState. This provides some event listeners we can use to determine when to show the Security Screen.


