import React, { Component } from "react";
import { ScrollView, StyleSheet, Platform, AsyncStorage } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "react-native-axios";
import { ExpoLinksView } from "@expo/samples";

export default class LinksScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerStyle: { backgroundColor: "#F9F9F9" },
      headerTitle: (
        <Text
          style={{
            flex: 1,
            fontSize: width * 0.05,
            fontWeight: "bold",
            textAlign: "center",
            color: "#707070"
          }}
        >
          LinksScreen
        </Text>
      ),
      headerLeft: <View style={{ flex: 1 }} />,
      headerRight: (
        <TouchableOpacity
          hitSlop={{
            top: width * 0.04,
            bottom: width * 0.04,
            left: width * 0.1,
            right: width * 0.1
          }}
        >
          <Text
            style={{ marginRight: 20, color: "#FA7268", fontWeight: "600" }}
          >
            Done
          </Text>
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      location: null,
      errorMessage: null
    };
  }
  async componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
    // await AsyncStorage.setItem(
    //   "currentUser",
    //   JSON.stringify(this.props.currentUser)
    // );

    await Location.startLocationUpdatesAsync("task1", {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 1000,
      distanceInterval: 0
    });
  }
  // static getCurrentUser = async () => {
  //   const currentUser = await AsyncStorage.getItem("currentUser");
  //   return JSON.parse(currentUser);
  // };
  _getLocationAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    console.warn("Location", this.state.location);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/**
         * Go ahead and delete ExpoLinksView and replace it with your content;
         * we just wanted to provide you with some helpful links.
         */}
        <ExpoLinksView />
      </ScrollView>
    );
  }
}
TaskManager.defineTask("task1", async ({ data, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (data) {
    console.log("You've entered region:", data);
    await AsyncStorage.setItem("location", data);
    const { location } = data;
    axios
      .get(this.state.location)
      .then(function(response) {
        console.warn("response", response);
      })
      .catch(function(error) {
        // handle error
        console.log("error", error);
      });
    const currentUser = await LinksScreen.getCurrentUser();
    console.log("currentUser", currentUser);
  }
});
LinksScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
