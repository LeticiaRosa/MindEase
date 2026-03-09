import { View } from "react-native";
import { SignIn } from "@/presentation/components/SignIn";
import { AppearanceFloatingButton } from "@/presentation/components/AppearanceFloatingButton";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SignIn />
      <AppearanceFloatingButton />
    </View>
  );
}
