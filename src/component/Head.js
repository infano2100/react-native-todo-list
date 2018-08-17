import React, { Component } from 'react'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title
} from 'native-base'
export class Head extends Component {
  render() {
    return (
      <Header>
        <Left />
        <Body>
          <Title>Todo List</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this.props.add()}>
            <Icon style={{ fontSize: 35 }} name="add" />
          </Button>
        </Right>
      </Header>
    )
  }
}

export default Head
