# expo-media-picker

A complete media file selector for React Native Expo.

<!-- ![Fade example gif](https://user-images.githubusercontent.com/6455018/71566445-b0982780-2a85-11ea-96f9-2519dc33930d.gif) -->

## Installation

```bash
# yarn
yarn add expo-media-picker

# npm
npm install expo-media-picker --save
```

Then, import with:

```js
import Fade from "expo-media-picker";
```

Note:
You may also need to install `@expo/vector-icons`.

## Usage

Example:

```js
import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import MediaPicker from "expo-media-picker";

export default function App() {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <MediaPicker value={null} onChange={(e) => null} title="Select a file" />
    </View>
  );
}
```

You can see a full example app inside the /example folder!

## Props

| Prop        | Required? | Type                         | Description                                                                                                                                     |
| ----------- | --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `visible`   | false     | boolean                      | Show the children of `<MediaPicker>`.                                                                                                           |
| `direction` | false     | string                       | Can be `"up"` or `"down"`. When the child component fades in there's an optional subtle translation that you can apply with `"up"` or `"down"`. |
| `duration`  | false     | number                       | The amount of time in milliseconds the fade transition should take.                                                                             |
| `style`     | false     | React Native Style or Object | Applies style a view around the faded child components                                                                                          |
