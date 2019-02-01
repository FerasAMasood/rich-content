import React from 'react';
import { renderToString } from 'react-dom/server';
import Editor from '../shared/components/Editor';
import Viewer from '../shared/components/Viewer';

const COMPONENTS = {
  rce: {
    Component: Editor,
    bundleName: 'editor',
  },
  rcv: {
    Component: Viewer,
    bundleName: 'viewer',
  },
};

export default function renderer() {
  return (req, res) => {
    const [componentId, fixtureName] = req.path.replace(/^\//, '').split('/');
    const { Component, bundleName } = COMPONENTS[componentId] || {};
    const props = { initialState: null };

    if (!Component) {
      return res.status(404).send(`Component for ${componentId} not found`);
    }

    if (fixtureName) {
      try {
        props.initialState = require(`./fixtures/${fixtureName}.json`);
      } catch (error) {
        console.log(error);
        return res.status(404).send(`Fixture ${fixtureName} not found`);
      }
    }

    res.render('index', {
      html: renderToString(<Component {...props}/>),
      initialState: props.initialState,
      bundleName,
    });
  };
};
