import { TOOLBARS } from 'wix-rich-content-common';
import { createSideToolbar } from './SideToolbar';
import { createMobileToolbar, createFooterToolbar, createStaticTextToolbar } from './StaticToolbar';
import { createInlineTextToolbar } from './InlineToolbar';

const defaultInlineToolbarVisibilityFn = editorState => {
  const selection = editorState.getSelection();
  return !selection.isCollapsed() && selection.getHasFocus();
};

const defaultSideToolbarVisibilityFn = editorState => {
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
  return currentBlock.getLength() === 0;
};

export const getDefaultToolbarSettings = ({ pluginButtons, textButtons }) => [
  {
    name: TOOLBARS.SIDE,
    shouldCreate: () => {
      const shouldCreate = pluginButtons.filter(({ buttonSettings }) => buttonSettings.toolbars.includes(TOOLBARS.SIDE)).length > 0;
      return {
        desktop: shouldCreate,
        mobile: {
          ios: shouldCreate,
          android: shouldCreate,
        }
      };
    },
    getPositionOffset: () => ({
      desktop: { x: -40, y: 0 },
      mobile: {
        ios: { x: 0, y: 0 },
        android: { x: 0, y: 50 },
      }
    }),
    getButtons: () => {
      const buttons = pluginButtons.filter(({ buttonSettings }) => buttonSettings.toolbars.includes(TOOLBARS.SIDE))
        .map(({ component }) => component);
      return {
        desktop: buttons,
        mobile: {
          ios: buttons,
          android: buttons,
        }
      };
    },
    getVisibilityFn: () => ({
      desktop: defaultSideToolbarVisibilityFn,
      mobile: {
        ios: defaultSideToolbarVisibilityFn,
        android: defaultSideToolbarVisibilityFn,
      }
    }),
    getInstance: createSideToolbar
  },
  {
    name: TOOLBARS.MOBILE,
    shouldCreate: () => ({
      desktop: false,
      mobile: {
        ios: true,
        android: true,
      }
    }),
    getPositionOffset: () => {},
    getButtons: () => {
      const buttons = { textButtons, pluginButtons };
      return {
        desktop: {},
        mobile: {
          ios: buttons,
          android: buttons,
        }
      };
    },
    getVisibilityFn: () => ({
      desktop: () => false,
      mobile: {
        ios: () => true,
        android: () => true,
      }
    }),
    getInstance: createMobileToolbar
  },
  {
    name: TOOLBARS.FOOTER,
    shouldCreate: () => ({
      desktop: pluginButtons.filter(({ buttonSettings }) => buttonSettings.toolbars.includes(TOOLBARS.FOOTER)).length > 0,
      mobile: {
        ios: false,
        android: false,
      }
    }),
    getPositionOffset: () => {},
    getButtons: () => {
      const buttons = pluginButtons.filter(({ buttonSettings }) => buttonSettings.toolbars.includes(TOOLBARS.FOOTER))
        .map(({ component }) => component);
      return {
        desktop: buttons,
        mobile: {
          ios: [],
          android: [],
        }
      };
    },
    getVisibilityFn: () => ({
      desktop: () => true,
      mobile: {
        ios: () => false,
        android: () => false,
      }
    }),
    getInstance: createFooterToolbar
  },
  {
    name: TOOLBARS.STATIC,
    shouldCreate: () => ({
      desktop: true,
      mobile: {
        ios: true,
        android: false,
      }
    }),
    getPositionOffset: () => {},
    getButtons: () => ({
      desktop: textButtons,
      mobile: {
        ios: textButtons,
        android: [],
      }
    }),
    getVisibilityFn: () => ({
      desktop: () => true,
      mobile: {
        ios: () => true,
        android: () => false,
      }
    }),
    getInstance: createStaticTextToolbar
  },
  {
    name: TOOLBARS.INLINE,
    shouldCreate: () => ({
      desktop: true,
      mobile: {
        ios: true,
        android: false,
      }
    }),
    getPositionOffset: () => {},
    getButtons: () => ({
      desktop: textButtons,
      mobile: {
        ios: textButtons,
        android: [],
      }
    }),
    getVisibilityFn: () => ({
      desktop: defaultInlineToolbarVisibilityFn,
      mobile: {
        ios: defaultInlineToolbarVisibilityFn,
        android: defaultInlineToolbarVisibilityFn,
      }
    }),
    getInstance: createInlineTextToolbar
  }
];