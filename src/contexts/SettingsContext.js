import PropTypes from 'prop-types';
import React, { createContext } from 'react';
import { LANGUAGE_CODES } from '../utils/constants';
// hooks
import useLocalStorage from '../hooks/useLocalStorage';
// theme
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const PRIMARY_COLOR = [
  // DEFAULT
  {
    name: 'default',
    ...palette.light.primary
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#fff'
  },
  // CYAN
  {
    name: 'Cyan',
    lighter: '#D1FFFC',
    light: '#76F2FF',
    main: '#1CCAFF',
    dark: '#0E77B7',
    darker: '#053D7A',
    contrastText: palette.light.grey[800]
  },
  // BLUE
  {
    name: 'blue',
    lighter: '#CCDFFF',
    light: '#6697FF',
    main: '#0045FF',
    dark: '#0027B7',
    darker: '#00137A',
    contrastText: '#fff'
  },
  // ORANGE
  {
    name: 'orange',
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#fda92d',
    dark: '#B66816',
    darker: '#793908',
    contrastText: palette.light.grey[800]
  },
  // RED
  {
    name: 'red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#fff'
  }
];

function SetColor(themeColor) {
  let color;
  const DEFAULT = PRIMARY_COLOR[0];
  const PURPLE = PRIMARY_COLOR[1];
  const CYAN = PRIMARY_COLOR[2];
  const BLUE = PRIMARY_COLOR[3];
  const ORANGE = PRIMARY_COLOR[4];
  const RED = PRIMARY_COLOR[5];

  switch (themeColor) {
    case 'purple':
      color = PURPLE;
      break;
    case 'Cyan':
      color = CYAN;
      break;
    case 'blue':
      color = BLUE;
      break;
    case 'orange':
      color = ORANGE;
      break;
    case 'red':
      color = RED;
      break;
    default:
      color = DEFAULT;
  }
  return color;
}

const initialState = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColor: 'default',
  onChangeMode: () => {},
  onChangeDirection: () => {},
  onChangeColor: () => {},
  onChangeLang: () => {},
  setColor: PRIMARY_COLOR[0],
  colorOption: [],
  lang: LANGUAGE_CODES.EN
};

const SettingsContext = createContext(initialState);

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: 'light',
    themeDirection: 'ltr',
    themeColor: 'default'
  });

  const [lang, setLang] = useLocalStorage('lang', {
    lang: LANGUAGE_CODES.EN
  });

  const onChangeMode = (themeMode) => {
    if (themeMode) {
      setSettings({ ...settings, themeMode });
    }
  };

  const onChangeDirection = (event) => {
    setSettings({
      ...settings,
      themeDirection: event.target.value
    });
  };

  const onChangeColor = (event) => {
    setSettings({
      ...settings,
      themeColor: event.target.value
    });
  };

  const onChangeLang = (lang) => {
    setLang(lang);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        lang,
        // Mode
        onChangeMode,
        // Direction
        onChangeDirection,
        // Color
        onChangeColor,
        // Lang
        onChangeLang,
        setColor: SetColor(settings?.themeColor || 'default'),
        colorOption: PRIMARY_COLOR?.map((color) => ({
          name: color.name,
          value: color.main
        }))
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

SettingsProvider.propTypes = {
  children: PropTypes.node
};

export { SettingsProvider, SettingsContext };
