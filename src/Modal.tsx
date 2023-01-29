import React, { useState, useEffect } from "react";
import { Modal as DefaultModal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  FontAwesome,
  Feather,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";

interface IProps {
  animation?: "fade" | "none" | "slide" | undefined;
  transparent?: boolean;
  show?: boolean;
  style?: string;
  showClose?: boolean;
  children?: React.ReactNode | JSX.Element | JSX.Element[];
  [x: string]: any; // => all other props (...rest)
}

export default function Modal(props: IProps) {
  // const [modalVisible, setModalVisible] = useState(visible);

  // useEffect(() => {
  //     setModalVisible(visible)
  // },[visible])

  const {
    animation = "slide",
    transparent = true,
    show = true,
    style,
    showClose,
    children,
    ...rest
  } = props;

  return (
    <DefaultModal
      animationType={animation}
      // transparent={transparent}
      visible={show}
      onRequestClose={props.hide}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <SafeAreaView style={[shona("flex-1"), shona(`bg-${bg}`)]}> */}
        <View {...rest}>
          {/* <View style={[shona(design), style]}> */}
          {showClose && (
            <TouchableOpacity
              onPress={props.hide}
              // design="%:w-8 center-center self-end m-10"
              style={{ width: 12, margin: 10 }}
            >
              <AntDesign name="close" />
              {/* <AntDesign name="close" style={shona("%:ts-8 tc-primary")} /> */}
            </TouchableOpacity>
          )}
          {children}
        </View>
      </SafeAreaView>
    </DefaultModal>
  );
}
