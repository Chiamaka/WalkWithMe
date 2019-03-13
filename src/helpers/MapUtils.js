import { Linking } from 'react-native';

export function openGoogleMaps(startLocation, destination) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destination}&travelmode=walking&dir_action=navigate`;

  Linking.canOpenURL(url)
    .then(Linking.openURL(url))
    .catch(err => console.log(err));
}
