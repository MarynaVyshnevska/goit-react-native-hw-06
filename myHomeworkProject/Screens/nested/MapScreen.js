import React from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ route }) => {
  // console.log(route.params);
  const { coordinate } = route.params;
  const { latitude, longitude } = coordinate.coords;
  // console.log(latitude, longitude);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          longitude,
          latitude,
          longitudeDelta: 0.005,
          latitudeDelta: 0.005,
        }}
        mapType="hybrid"
        showsCompass="true"
        rotateEnabled="true"
        scrollEnabled="true"
        loadingEnabled="true"
        loadingIndicatorColor="#FF6C00"
      >
        <Marker
          coordinate={{
            longitude,
            latitude,
          }}
          title="Привіт, я тут"
          pinColor="#FF6C00"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
