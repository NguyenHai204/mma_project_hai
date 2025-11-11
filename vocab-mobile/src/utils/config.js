import { Platform } from "react-native";

export const API_BASE_URL = Platform.select({
  web: "http://localhost:9999",        // ✅ Dành cho Expo Web (trình duyệt)
  android: "http://10.0.2.2:9999",     // ✅ Dành cho Android Emulator
  ios: "http://192.168.1.6:9999"    ,
  default: "http://192.168.1.6:9999"     // ✅ Dành cho iOS
});
