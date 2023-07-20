import { StyleSheet, View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function App() {
  return (
    <View style={[styles.container]}>
      <ExpoStatusBar translucent backgroundColor="purple" />
      <WebView
        source={{ uri: "http://192.168.1.242:3000" }}
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
