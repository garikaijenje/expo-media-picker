import React, { useState, useEffect, useRef } from "react";

import {
  Ionicons,
  FontAwesome,
  Feather,
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import {
  Platform,
  View,
  Text,
  TouchableOpacity as Touchable,
  ImageBackground,
} from "react-native";

import { Camera, CameraType } from "expo-camera";
let camera: any = Camera;
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import Modal from "./Modal";

import RBSheet from "react-native-raw-bottom-sheet";

interface IProps {
  onChange: any;
  title: string;
  value: any;
}

export default function MediaPicker({ onChange, title, value }: IProps) {
  const refRBSheet: any = useRef<any>();

  const [pickerType, setPickerType] = useState<string | null>(null);

  const [file, setFile] = useState<any>(null);
  const [fileValue, setFileValue] = useState(value);

  useEffect(() => {
    // console.warn(file)
    onChange(file);
  }, [file]);

  useEffect(() => {
    // console.warn('VALUE: ',value)
    // setFileValue(value)
  }, [value]);

  // Camera
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [cameraType, setCameraType] = React.useState<any>(
    // Camera.Constants.Type.back
    CameraType.back
  );

  const [capturedImage, setCapturedImage] = React.useState(null);
  const [flashMode, setFlashMode] = React.useState<any>("off");
  const [hasPermission, setHasPermission] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.warn("Camera:",startCamera)
    // if(startCamera) refRBSheet.current.close()
  }, [startCamera]);

  const formattedFileEXT = (ext: string) => {
    if (ext === "png") return "png";
    else if (
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "jpg" ||
      ext === "jfif" ||
      ext === "pjpeg" ||
      ext === "pjp"
    )
      return "jpeg";
    else {
      return ext;
    }
  };

  const __startCamera = async () => {
    await refRBSheet.current.close();

    setTimeout(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status === "granted") {
        setStartCamera(true);
      } else {
        alert("Access denied");
      }
    }, 1000);
  };

  const __takePicture = async () => {
    const photo = await camera.takePictureAsync({
      skipProcessing: false,
      quality: 0.3,
    });
    // console.warn(photo)
    setPreviewVisible(true);
    //setStartCamera(false)
    setCapturedImage(photo);

    const ext = photo.uri.substring(photo.uri.length - 3);
    const typeEXT = formattedFileEXT(ext);
    const iName = Math.random().toString(20).substr(2, 6);

    // console.warn('__takePicture',photo)

    setFile({
      // uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      uri:
        Platform.OS === "ios"
          ? photo.uri.replace("file://", "/private")
          : photo.uri,
      type: `image/${typeEXT}`,
      name: `image_${iName}.${ext}`,
    });
  };

  const __savePhoto = () => {
    setStartCamera(false);
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __switchCamera = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front);
    } else {
      setCameraType(CameraType.back);
    }
  };

  // useEffect(() => {
  //     (async () => {
  //       if (pickerType === 'gallery') {
  //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //         if (status !== 'granted') {
  //           alert('Sorry, we need camera roll permissions to make this work!');
  //         }
  //       }
  //     })();
  //   }, [pickerType]);

  const pickImage = async () => {
    // setPickerType(prev => prev !== 'gallery' ? 'gallery' : null)
    // setPickerType('gallery')
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      // let result = await ImagePicker.launchImageLibraryAsync({
      await ImagePicker.launchImageLibraryAsync({
        // presentationStyle: 0,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: false,
        // aspect: [16, 9],
        // quality: 1,
        allowsEditing: false,
        // aspect: [4, 3],
        quality: 0.2,
      })
        .then((result: any) => {
          // console.warn("RESULT",result);

          if (!result.canceled) {
            const ext = result.assets[0].uri.substring(
              result.assets[0].uri.length - 3
            );
            const typeEXT = formattedFileEXT(ext);
            const iName = Math.random().toString(20).substr(2, 6);
            setFile({
              // uri: Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri,
              uri:
                Platform.OS === "ios"
                  ? result.assets[0].uri.replace("file://", "")
                  : result.assets[0].uri,
              type: `image/${typeEXT}`,
              name: `image_${iName}.${ext}`,
            });
          }
        })
        .catch((err) => console.log(err));

      // if (!result.cancelled) {
      //   const ext =  (result.uri).substring((result.uri).length - 3);
      //   setFile(
      //     Platform.OS === 'ios' ?
      //     {
      //       uri: result.uri.replace('file://', ''),
      //       name: result.name,
      //       type: result.type
      //     }
      //     :
      //     {
      //       uri: result.uri,
      //       name: `image.${ext}`,
      //       type: `${result.type}/${ext}`
      //     }
      //   );
      // }
    } else {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    setLoading(false);
    refRBSheet.current.close();
  };

  const pickDocument = async () => {
    setPickerType("document");
    setLoading(true);
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.type === "success") {
      setFile({
        uri: result.uri,
        name: result.name,
        type: result.mimeType,
      });
    }
    setLoading(false);
    refRBSheet.current.close();

    // type [success, cancel]
    // uri
    // mimeType
    // name
    // size

    // result.type === 'success' ?
    // console.warn(
    //     result.type,
    //     result.uri,
    //     result.mimeType,
    //     result.name,
    //     result.size,
    // ) : null

    // console.warn(result.uri);
    // console.warn(result);
  };

  return (
    <View>
      <Modal
        show={startCamera}
        hide={() => setStartCamera(false)}
        showClose={false}
      >
        <View
          style={
            {
              // flex: 1,
              // width: "100%",
            }
          }
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={() => __savePhoto()}
              retakePicture={() => __retakePicture()}
            />
          ) : (
            <>
              <Camera
                type={cameraType}
                // ratio="16:9"
                flashMode={flashMode}
                style={{ flex: 1 }}
                ref={(r) => {
                  camera = r;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      left: "2%",
                      top: "2%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Touchable
                      onPress={() => setStartCamera(false)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        // alignSelf: "self-end",
                        margin: 10,
                      }}
                    >
                      <AntDesign
                        name="close"
                        style={{ fontSize: 10, color: "#000" }}
                      />
                    </Touchable>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      flexDirection: "row",
                      flex: 1,
                      width: "100%",
                      padding: 20,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      // style={{
                      //   alignSelf: 'center',
                      //   flex: 1,
                      //   alignItems: 'center'
                      // }}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Touchable
                        onPress={() => __handleFlashMode()}
                        // style={{
                        //   backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                        // }}
                      >
                        <MaterialIcons
                          // @ts-ignore
                          name={`flash-${flashMode}`}
                          size={30}
                          color={"#fff"}
                        />
                      </Touchable>
                      <Touchable
                        onPress={() => __takePicture()}
                        style={{
                          width: 70,
                          height: 70,
                          bottom: 0,
                          borderRadius: 50,
                          backgroundColor: "#fff",
                          // borderWidth: 5,
                          // borderColor: handleColors('white')
                        }}
                      />

                      <Touchable
                        onPress={() => __switchCamera()}
                        // style={{
                        //   marginTop: 20,
                        //   borderRadius: 50,
                        //   height: 25,
                        //   width: 25
                        // }}
                      >
                        <Ionicons
                          name="ios-camera-reverse"
                          size={30}
                          color={"#000"}
                        />
                      </Touchable>
                    </View>
                  </View>
                </View>
              </Camera>
            </>
          )}
        </View>
      </Modal>

      {/* onPress={() => pickDocument()} */}
      <Touchable
        onPress={() => {
          setStartCamera(false);
          setLoading(false);
          refRBSheet.current.open();
        }}
        // design={`flex-row justify-between items-center full p-10 rounding-5 mb-10 bs-dashed bw-1 bc-${
        //   file ? "primary" : "gray"
        // }`}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: file ? "primary" : "gray",
        }}
      >
        {/* <Touchable onPress={() => {setStartCamera(true);setLoading(false);refRBSheet.current.open()}} design={`flex-row justify-between items-center full p-10 rounding-5 mb-10 bs-dashed bw-1 bc-${file ? 'primary' : 'gray'}`}> */}

        {/* {IDScan ? <>
                        <Text design='tc-primary %:ts-4'>{IDScan.name}</Text>
                        <MaterialCommunityIcons name="file-document-edit-outline" style={shona('%:ts-5 tc-primary')} /> 
                    </> : 
                    <>
                    <Text design='tc-primary %:ts-4'>Select ID Document Scan</Text>
                    <AntDesign name="addfile" style={shona('%:ts-5 tc-gray')} /> 
                    </>
                    } */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {file || fileValue ? (
            <Ionicons
              name="checkmark-done-circle"
              style={{ fontSize: 20, color: "#888" }}
            />
          ) : null}
          {fileValue ? (
            <Text style={{ color: "#000", fontSize: 12 }}>
              {"..." + fileValue.substring(fileValue.length - 20)}
            </Text>
          ) : (
            <Text style={{ color: file ? "#000" : "gray", fontSize: 12 }}>
              {!file
                ? title ?? "Click to Upload"
                : "..." + file.uri.substring(file.uri.length - 20)}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {file || fileValue ? (
            <>
              <View
                style={{
                  backgroundColor: "#def",
                  padding: 4,
                  marginLeft: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#000", fontSize: 12 }}>Change</Text>
              </View>
              <Touchable
                onPress={() => setFile(null)}
                style={{ marginLeft: 5 }}
              >
                <Ionicons
                  name="md-close-circle-sharp"
                  style={{ color: "#888", fontSize: 20 }}
                />
              </Touchable>
            </>
          ) : (
            <AntDesign name="addfile" style={{ fontSize: 12, color: "gray" }} />
          )}
        </View>
      </Touchable>
      {/* @ts-ignore */}
      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(59, 54, 111, 0.5)",
          },
          // wrapper: shona("bg-primary-0.5"),
          draggableIcon: { backgroundColor: "#000" },
          // container: shona('h-450')
        }}
      >
        {loading ? (
          <Text style={{ textAlign: "center", margin: 20 }}>Loading...</Text>
        ) : (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ textAlign: "center", margin: 20, color: "#000" }}>
              Choose how you want to upload
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Touchable
                onPress={() => __startCamera()}
                // design="center-center p-5 w-80 h-80 bg-secondary rounding-100"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                  width: 80,
                  height: 80,
                  backgroundColor: "#def",
                  borderRadius: 100,
                }}
              >
                <FontAwesome name="camera" size={24} color={"#000"} />
                <Text style={{ color: "#000" }}>Camera</Text>
              </Touchable>
              <Touchable
                onPress={() => {
                  pickImage();
                }}
                // design="center-center p-5 w-80 h-80 bg-secondary rounding-100"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                  width: 80,
                  height: 80,
                  backgroundColor: "#def",
                  borderRadius: 100,
                }}
              >
                <FontAwesome5 name="images" size={24} color={"#000"} />
                <Text style={{ color: "#000" }}>Gallery</Text>
              </Touchable>
              <Touchable
                onPress={() => {
                  pickDocument();
                }}
                // design="center-center p-5 w-80 h-80 bg-secondary rounding-100"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                  width: 80,
                  height: 80,
                  backgroundColor: "#def",
                  borderRadius: 100,
                }}
              >
                <Ionicons name="ios-documents" size={24} color={"#000"} />
                <Text style={{ color: "#000" }}>Files</Text>
              </Touchable>
            </View>
          </View>
        )}
      </RBSheet>
    </View>
  );
}

type CameraPreviewType = {
  photo: any;
  retakePicture: any;
  savePhoto: any;
};

const CameraPreview = ({
  photo,
  retakePicture,
  savePhoto,
}: CameraPreviewType) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Touchable
              onPress={retakePicture}
              // design="bg-secondary p-10 rounding-5"
              style={{ backgroundColor: "#000", padding: 10, borderRadius: 5 }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 20,
                }}
              >
                Re-Take
              </Text>
            </Touchable>
            <Touchable
              onPress={savePhoto}
              // design="bg-secondary p-10 rounding-5"
              style={{ backgroundColor: "#000", padding: 10, borderRadius: 5 }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 20,
                }}
              >
                Save Photo
              </Text>
            </Touchable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
