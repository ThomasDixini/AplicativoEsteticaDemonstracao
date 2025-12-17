export default () => ({
    "expo": {
      "name": "Estetica Android",
      "slug": "EsteticaAndroid",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/images/sem_imagem.png",
      "scheme": "myapp",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": true,
      "notification": {
        "icon": "./assets/images/sem_imagem.png",
        "color": "#ffffff",
        "vapidPublicKey": process.env.EXPO_PUBLIC_FIREBASE_KEY,
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.thomasdixinidev.EsteticaDemonstracao",
        "infoPlist": {
          "ITSAppUsesNonExemptEncryption": false,
          "UIBackgroundModes": ["remote-notification"],
          "NSUserNotificationUsageDescription": "O app precisa enviar notificações para avisar sobre novidades."
        }
      },
      "android": {
        "package": "com.thomasdixini.esteticademonstracao",
        "versionCode": 2,
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/sem_imagem.png",
          "backgroundColor": "#ffffff"
        }
      },
      "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/sem_imagem.png"
      },
      "plugins": [
        "expo-router",
        [
          "expo-splash-screen",
          {
            "image": "./assets/images/sem_imagem.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          }
        ],
        "expo-secure-store",
        [
          "expo-build-properties",
          {
            "android": {
              "compileSdkVersion": 35,
              "targetSdkVersion": 35,
              "manifest": {
                "removePermissions": ["android.permission.READ_PHONE_STATE"]
              }
            }
          }
        ]
      ],
      "experiments": {
        "typedRoutes": true
      },
      "extra": {
        "router": {
          "origin": false
        },
        "serviceWorker": {
          "src": "firebase-messaging-sw.js"
        },
        "eas": {
          "projectId": ""
        },
        "INSTAGRAM_URL": process.env.EXPO_PUBLIC_INSTAGRAM_URL,
        "FACEBOOK_URL": process.env.EXPO_PUBLIC_FACEBOOK_URL,
        "WHATSAPP": process.env.EXPO_PUBLIC_WHATSAPP,
      }
    }
  }
)