import React from 'react';
import {
    View,
    Modal,
    ActivityIndicator,
    Text,
} from 'react-native';
import { containers, text } from './Styles';

// Credit to Kelley Rose (src: https://medium.com/@kelleyannerose/react-native-activityindicator-for-a-quick-easy-loading-animation-593c06c044dc)

const Loader = props => {
    const {
        loading,
        loadText,
        ...attributes
    } = props;
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={containers.modalBackground}>
                <View style={containers.activityIndicatorWrapper}>
                    <Text style={text.loadText}>{loadText}</Text>
                    <ActivityIndicator
                        animating={loading} />
                </View>
            </View>
        </Modal>
    )
};

export default Loader;