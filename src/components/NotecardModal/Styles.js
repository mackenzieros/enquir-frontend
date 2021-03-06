import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    backgroundColor: '#fcfcfc',
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 65,
    height: 30,
    marginTop: 5,
    backgroundColor: '#fcfcfc',
  },
  saveContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  topicContainer: {
    flexDirection: 'row',
    backgroundColor: "#eaeaea",
    marginHorizontal: 25,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 19,
    elevation: 10,
  },
  notesContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: "#eaeaea",
    borderRadius: 4,
    marginHorizontal: 25,
    marginBottom: 35,
    elevation: 10,
  },
  questionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 5,
    backgroundColor: '#35477d',
  },
  emptyBlock: {
    paddingVertical: 36,
    paddingLeft: 18,
    paddingRight: 16,
    marginTop: 0,
    marginBottom: 8,
  },
  questionGenButtonContainer: {
  },
  notifButtonContainer: {
    marginTop: 5,
    marginLeft: 19,
    marginRight: 7,
    color: 'white',
  },
});

const buttons = StyleSheet.create({
  closeButton: {
    marginLeft: 16,
    marginVertical: 7,
  },
  questionTab: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    width: 50,
    height: 45,
    marginTop: 5,
    marginRight: 6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    backgroundColor: '#35477d',
  },
  autoPopButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginLeft: 37,
    marginBottom: 5,
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: '#8ac6d1',
    elevation: 4,
  },
  questionHeaderButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  notifButton: {
    color: 'white',
  },
  addQuestionButton: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    backgroundColor: '#35477d',
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    elevation: 7,
  },
});

const inputs = StyleSheet.create({
  topicInput: {
    flex: 1,
    borderColor: "#ccc",
    margin: 10,
    fontSize: 21,
    fontFamily: 'Roboto-Medium',
  },
  notesInput: {
    flex: 1,
    margin: 10,
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
  },
});

const text = StyleSheet.create({
  saveButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginRight: 18,
  },
  questionHeaderText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: 22,
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
});

export { containers, buttons, inputs, text };