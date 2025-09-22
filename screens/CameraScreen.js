import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need camera permissions</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#28a745', marginTop: 12 }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  button: { padding: 12, backgroundColor: '#00000088', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width: '90%', height: '70%', borderRadius: 12 },
});
