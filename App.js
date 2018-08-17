import React from 'react'
import { StyleSheet, View, Alert, Platform, Keyboard } from 'react-native'
import firebase from 'firebase'
import { DB_CONFIG } from './config'
import PopupDialog from 'react-native-popup-dialog'
import { Font, Constants } from 'expo'

import Head from './src/component/Head'
import ListShow from './src/component/ListShow'

import {
  Container,
  Text,
  Button,
  Form,
  Item,
  Input,
  Toast,
  Content,
  Root
} from 'native-base'

export class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: [],
      inputError: true,
      dataNote: '',
      btnDisabled: true,
      btnDisabledColor: false,
      showToast: false,
      dataId: null,
      fontLoaded: false
    }

    this.app = firebase.initializeApp(DB_CONFIG)
    this.database = this.app
      .database()
      .ref()
      .child('notes')

    this.addNote = this.addNote.bind(this)
    this.removeNote = this.removeNote.bind(this)
    this.editNote = this.editNote.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showPopupEdit = this.showPopupEdit.bind(this)
    this.handleClearInput = this.handleClearInput.bind(this)
  }

  showPopup() {
    this.popupDialog.show()
  }

  showPopupEdit(id, val) {
    this.popupDialog.show()

    this.setState({
      dataNote: val,
      inputError: false,
      btnDisabled: false,
      dataId: id
    })
  }

  handleChange(note) {
    if (note === '') {
      this.setState({
        inputError: true,
        btnDisabled: true,
        btnDisabledColor: false
      })
    } else {
      this.setState({
        inputError: false,
        btnDisabled: false,
        btnDisabledColor: true,
        dataNote: note
      })
    }
  }

  async addNote() {
    await this.database.push().set({ noteContent: this.state.dataNote })

    await this.setState({
      dataNote: '',
      inputError: true,
      btnDisabled: true,
      btnDisabledColor: false
    })

    await this.popupDialog.dismiss()
    await Keyboard.dismiss()

    Toast.show({
      text: 'Add Note Success',
      buttonText: 'Okay',
      type: 'success'
    })
  }

  async editNote() {
    var update = firebase.database().ref('notes/' + this.state.dataId)

    update
      .update({ noteContent: this.state.dataNote })
      .then(() => {
        this.setState({
          dataNote: '',
          inputError: true,
          btnDisabled: true,
          dataId: null
        })

        Toast.show({
          text: 'Edit Note Success',
          buttonText: 'Okay',
          type: 'success'
        })
      })
      .then(this.popupDialog.dismiss())
      .then(Keyboard.dismiss())
      .catch(error => {
        console.error(error)
      })
  }

  removeNote(noteId) {
    Alert.alert(
      'Delete Note',
      'Are you sure delete this Note?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () =>
            this.database
              .child(noteId)
              .remove()
              .then(
                Toast.show({
                  text: 'Delete Note Success',
                  buttonText: 'Okay',
                  type: 'danger'
                })
              )
        }
      ],
      { cancelable: false }
    )
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    })
    this.setState({ fontLoaded: true })
  }

  componentWillMount() {
    const previousNotes = this.state.notes

    // DataSnapshot
    this.database.on('child_added', snap => {
      previousNotes.push({
        id: snap.key,
        noteContent: snap.val().noteContent
      })

      this.setState({
        notes: previousNotes
      })
    })

    this.database.on('child_changed', snap => {
      for (var i = 0; i < previousNotes.length; i++) {
        if (previousNotes[i].id === snap.key) {
          previousNotes[i].noteContent = snap.val().noteContent
        }
      }

      this.setState({
        notes: previousNotes
      })
    })

    this.database.on('child_removed', snap => {
      for (var i = 0; i < previousNotes.length; i++) {
        if (previousNotes[i].id === snap.key) {
          previousNotes.splice(i, 1)
        }
      }

      this.setState({
        notes: previousNotes
      })
    })
  }

  handleClearInput() {
    this.setState({
      dataNote: '',
      dataId: null,
      inputError: true,
      btnDisabled: true,
      btnDisabledColor: false
    })
  }

  render() {
    const { notes, dataId } = this.state

    return this.state.fontLoaded ? (
      <Root>
        <Container>
          <View style={styles.statusBar} />
          <PopupDialog
            width={0.9}
            height={Platform.OS === 'ios' ? 0.2 : 0.3}
            ref={popupDialog => {
              this.popupDialog = popupDialog
            }}
            onDismissed={() => this.handleClearInput()}
          >
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Form>
                <Item
                  error={this.state.inputError}
                  regular
                  style={{ marginTop: 20 }}
                >
                  <Input
                    value={this.state.dataNote}
                    placeholder="Note"
                    onChangeText={name => this.handleChange(name)}
                  />
                </Item>
              </Form>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 20
                }}
              >
                <Button
                  disabled={this.state.btnDisabled}
                  primary={this.state.btnDisabledColor}
                  onPress={() =>
                    dataId !== null ? this.editNote() : this.addNote()
                  }
                >
                  <Text> Submit </Text>
                </Button>
              </View>
            </View>
          </PopupDialog>
          <Head add={this.showPopup} />
          <Content padder>
            <ListShow
              del={this.removeNote}
              edit={this.showPopupEdit}
              notes={notes}
            />
          </Content>
        </Container>
      </Root>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBar: {
    height: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
  }
})

export default App
