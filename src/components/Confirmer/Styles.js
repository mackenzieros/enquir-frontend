import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  confirmerWrapper: {
    backgroundColor: '#FFFFFF',
    height: 140,
    width: 260,
    borderWidth: .5,
    borderColor: 'grey',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

const text = StyleSheet.create({
  confirmation: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    marginHorizontal: 12,
    marginBottom: 20,
  },
  cancel: {
    marginTop: 5,
    color: 'grey',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  discard: {
    marginTop: 5,
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  save: {
    marginTop: 5,
    color: 'blue',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});

const buttons = StyleSheet.create({
  cancelButton: {
    flex: 1,
    borderTopWidth: .75,
    borderColor: 'grey',
    borderBottomLeftRadius: 8,
  },
  discardButton: {
    flex: 1,
    borderTopWidth: .75,
    borderLeftWidth: .65,
    borderRightWidth: .65,
    borderColor: 'grey',
    height: 40,
  },
  saveButton: {
    flex: 1,
    borderTopWidth: .75,
    borderColor: 'grey',
    borderBottomRightRadius: 8,
  },
});

export { containers, text, buttons };