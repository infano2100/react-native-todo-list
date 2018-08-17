import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ActivityIndicator } from 'react-native'
import {
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button
} from 'native-base'
export class ListShow extends Component {
  render() {
    const { notes, del, edit } = this.props
    return (
      <Content>
        <List>
          {notes.length > 0 ? (
            notes.map((list, index) => (
              <ListItem key={index}>
                <Left>
                  <Text>{list.noteContent}</Text>
                </Left>
                <Right>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ paddingRight: 20 }}>
                      <Icon
                        onPress={() => edit(list.id, list.noteContent)}
                        style={{ color: '#4da6ff' }}
                        type="FontAwesome"
                        name="pencil"
                      />
                    </View>
                    <View>
                      <Icon
                        onPress={() => del(list.id)}
                        style={{ color: 'red' }}
                        name="trash"
                      />
                    </View>
                  </View>
                </Right>
              </ListItem>
            ))
          ) : (
            <ActivityIndicator size="large" color="#4da6ff" />
          )}
        </List>
      </Content>
    )
  }
}

ListShow.propTypes = {
  notes: PropTypes.array.isRequired,
  del: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
}

export default ListShow
