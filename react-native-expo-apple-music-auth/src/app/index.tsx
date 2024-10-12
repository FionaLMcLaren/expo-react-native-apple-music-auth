import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

export default function Index() {
  const router = useRouter();

  // This is called when the webview sends the user token 
  // to us. We now have the user token on our app, and can 
  // use this how we please. In this example, we will simply
  // log that we got it, and go to a "success" page!
  const onAuth = async (res: any) => {
    const userToken = res.nativeEvent.data;

    console.log("Successfully obtained the user token", userToken);

    router.replace("/success");
  }

  // If we have the devToken on the app side, and would rather
  // not have it in plain text in our html source, we can 
  // store it as a constant that will inject into the webview.
  // This will be sent to the webview as a JSON object, and the 
  // webview will parse it to obtain the devToken to configure 
  // Musickit JS.
  // This code assumes you have the dev token stored in an .env
  // file under the key "EXPO_PUBLIC_APPLE_DEV_TOKEN".
  const devToken = process.env.EXPO_PUBLIC_APPLE_DEV_TOKEN;

  return (
    <WebView
      // These two options are here so that Android devices 
      // can handle and show the popup that Musickit JS creates
      // when getting a user to sign in as part of the authorization 
      // process
      javaScriptCanOpenWindowsAutomatically = { true }
      setSupportMultipleWindows = { false }

      // Source of our html that runs the Musickit JS connection
      // NOTE: This works with my Expo Go, but the Webview documentation
      // does say there could be issues with using local html as a source
      // (https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#loading-local-html-files)
      // If this is an issue, you can explore the workarounds mentioned in the doc or
      // copy the code from the `MusickitJsScript` html file into a string, and pass
      // it in as inline HTML. 
      source = { require("../res/MusickitJsScript.html") }

      // When the webview obtains the user token, it will
      // send back a message to the app for us to use
      onMessage = { (res) => { onAuth(res) } }

      // Inject our devToken for the Webview to access
      injectedJavaScriptObject = {{ devToken: devToken }}
    />
  );
}
