import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { containers, text, buttons } from './Styles';

const Confirmer = props => {
  const {
    confirming,
    confirmation,
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={confirming} >
      <View style={containers.modalBackground}>
        <View style={containers.confirmerWrapper}>
          <Text style={text.confirmation}>You have unsaved changes.</Text>
          <View style={containers.buttons}>
            <TouchableOpacity
              onPress={() => confirmation(null)}
              style={buttons.cancelButton} >
              <Text style={text.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmation("discard")}
              style={buttons.discardButton} >
                <Text style={text.discard}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmation("save")}
              style={buttons.saveButton} >
                <Text style={text.save}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
};

export default Confirmer;