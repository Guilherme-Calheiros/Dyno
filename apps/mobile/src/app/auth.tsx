import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { authClient } from "../../lib/auth-client";

export default function AuthCallback() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/home" />;
} 