/* global describe it */

import React, { Component } from 'react'

import { convertToObject, convertToJSON } from '../src/converter'

describe('convertToObject', () => {
  const Child = ({ text }) => text

  it('returns undefined children if the child is undefined', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: undefined,
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: undefined,
      },
    })
  })

  it('returns undefined children if the child is null', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: null,
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: undefined,
      },
    })
  })

  it('returns the child as children if the child is a string', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: 'test',
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: 'test',
      },
    })
  })

  it('returns the converted component as children if the child is an object with type', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: {
            type: 'test',
            props: {
              hello: 'world',
            },
            extra: 'whatever',
          },
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: {
          type: 'test',
          props: {
            hello: 'world',
            children: undefined,
          },
        },
      },
    })
  })

  it('returns an array of children if an array is provided', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: ['test', null],
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: ['test', undefined],
      },
    })
  })

  it('accepts as string as type', () => {
    expect(
      convertToObject({
        type: 'Wrapper',
        props: {
          children: <Child text="test" />,
        },
      }),
    ).toEqual({
      type: 'Wrapper',
      props: {
        children: {
          type: 'Child',
          props: {
            text: 'test',
            children: 'test',
          },
        },
      },
    })
  })

  it('accepts a React class as type', () => {
    class Wrapper extends Component {
      render() {
        return <Child text={`wrapped ${this.props.text}`} />
      }
    }
    expect(
      convertToObject({
        type: Wrapper,
        props: {
          text: 'test',
        },
      }),
    ).toEqual({
      type: 'Wrapper',
      props: {
        text: 'test',
        children: {
          type: 'Child',
          props: {
            text: 'wrapped test',
            children: 'wrapped test',
          },
        },
      },
    })
  })

  it('accepts a stateless function as type', () => {
    const Parent = () => <Child text="from parent" />
    expect(
      convertToObject({
        type: Parent,
        props: {},
      }),
    ).toEqual({
      type: 'Parent',
      props: {
        children: {
          type: 'Child',
          props: {
            text: 'from parent',
            children: 'from parent',
          },
        },
      },
    })
  })

  it('returns an unsupported component with empty props if the type is unknow', () => {
    expect(
      convertToObject({
        type: 1,
        props: {
          hello: 'world',
          children: ['hello', 'world'],
        },
      }),
    ).toEqual({
      type: 'Unsupported',
      props: {
        children: [],
      },
    })
  })
})
