import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Loading = ({ size = 40, stroke = 5, speed = 0.9, color = 'black' }) => {
  const htmlContent = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/ldrs@latest/dist/ldrs.min.js"></script>
      </head>
      <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh; background-color:transparent;">
        <l-tailspin
          size="${size}"
          stroke="${stroke}"
          speed="${speed}"
          color="${color}"
        ></l-tailspin>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: 100, // Adjust based on the size of the loader
    height: 100, // Adjust based on the size of the loader
    backgroundColor: 'transparent',
  },
});

export default Loading;