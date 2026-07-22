import { useFonts } from "expo-font";
import { Text as RNText } from "react-native";
const Text = ({ children, styles,bold, ...props  }) => {
  const [fontsLoaded] = useFonts({
      nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
      nunitoBold: require("../assets/fonts/static/Nunito-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <RNText {...props} style={[ styles]}>
      {children}
    </RNText>
  );
};

export default Text;
