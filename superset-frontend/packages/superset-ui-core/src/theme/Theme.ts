/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { theme as antdThemeImport } from 'antd-v5';
import tinycolor from 'tinycolor2';
import type { ThemeConfig } from 'antd-v5';

/* eslint-disable theme-colors/no-literal-colors */

interface SystemColors {
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  alert: string;
  success: string;
  info: string;
  grayscale: string;
}

interface ThemeColors {
  base: string;
  light1: string;
  light2: string;
  light3: string;
  light4: string;
  light5: string;
  dark1: string;
  dark2: string;
  dark3: string;
  dark4: string;
  dark5: string;
}

interface LegacySupersetTheme {
  borderRadius: number;
  body: {
    backgroundColor: string;
    color: string;
  };
  colors: {
    darkest: string;
    lightest: string;
    text: {
      label: string;
      help: string;
    };
    primary: ThemeColors;
    secondary: ThemeColors;
    error: ThemeColors;
    warning: ThemeColors;
    alert: ThemeColors;
    success: ThemeColors;
    info: ThemeColors;
    grayscale: ThemeColors;
  };
  opacity: {
    light: string;
    mediumLight: string;
    mediumHeavy: string;
    heavy: string;
  };
  typography: {
    families: {
      sansSerif: string;
      serif: string;
      monospace: string;
    };
    weights: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    sizes: {
      xxs: number;
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
  };
  zIndex: {
    aboveDashboardCharts: number;
    dropdown: number;
    max: number;
  };
  transitionTiming: number;
  gridUnit: number;
  brandIconMaxWidth: number;
}

// Augmenting the LegacySupersetTheme with the antd tokens
// goal is to fully move to antd tokens and remove the LegacySupersetTheme
export interface SupersetTheme extends LegacySupersetTheme {
  antd: Record<string, any>;
}

export class Theme {
  private readonly systemColors: SystemColors;

  private readonly isDarkMode: boolean;

  private theme: LegacySupersetTheme | null = null;

  private antdTheme: Record<string, any> | null = null;

  public antdConfig: ThemeConfig | undefined = undefined;

  private static readonly denyList: RegExp[] = [
    /purple.*/,
    /dragon.*/,
    /geekblue.*/,
    /magenta.*/,
    /volcano.*/,
    /gold.*/,
    /lime.*/,
    /cyan.*/,
    /blue.*/,
    /green.*/,
    /red.*/,
    /yellow.*/,
    /pink.*/,
    /orange.*/,
  ];

  constructor(systemColors?: Partial<SystemColors>, isDarkMode = false) {
    this.isDarkMode = isDarkMode;
    this.systemColors = {
      primary: '#20a7c9',
      secondary: '#444e7c',
      error: '#e04355',
      warning: '#fcc700',
      alert: '#fcc700',
      success: '#5ac189',
      info: '#66bcfe',
      grayscale: '#666666',
      ...systemColors,
    };

    this.setThemeWithSystemColors(this.systemColors, this.isDarkMode);
    this.setAntdThemeFromTheme();
  }

  getTheme(): SupersetTheme {
    if (!this.theme) {
      throw new Error('Theme is not initialized.');
    }
    return {
      ...this.theme,
      antd: this.getFilteredAntdTheme(),
    };
  }

  private adjustColor(
    color: string,
    percentage: number,
    target = 'white',
  ): string {
    return tinycolor.mix(color, target, percentage).toHexString();
  }

  private generateColorVariations(color: string): ThemeColors {
    return {
      base: color,
      light1: this.adjustColor(color, 20, 'white'),
      light2: this.adjustColor(color, 45, 'white'),
      light3: this.adjustColor(color, 70, 'white'),
      light4: this.adjustColor(color, 90, 'white'),
      light5: this.adjustColor(color, 95, 'white'),
      dark1: this.adjustColor(color, 10, 'black'),
      dark2: this.adjustColor(color, 20, 'black'),
      dark3: this.adjustColor(color, 40, 'black'),
      dark4: this.adjustColor(color, 60, 'black'),
      dark5: this.adjustColor(color, 80, 'black'),
    };
  }

  private makeThemeDark(theme: LegacySupersetTheme): LegacySupersetTheme {
    const darkTheme = { ...theme };
    darkTheme.colors = { ...theme.colors };

    Object.keys(darkTheme.colors).forEach(key => {
      if (key !== 'text') {
        darkTheme.colors[key] = this.swapLightAndDark(theme.colors[key]);
      }
    });

    // Update text-specific colors
    darkTheme.colors.text = {
      ...darkTheme.colors.text,
      label: '#D3D3D3',
      help: '#D3D3D3',
    };
    darkTheme.colors.darkest = '#FFF';
    darkTheme.colors.lightest = '#000';
    return darkTheme;
  }

  private swapLightAndDark(colorVariations: ThemeColors): ThemeColors {
    return {
      ...colorVariations,
      light1: colorVariations.dark1,
      light2: colorVariations.dark2,
      light3: colorVariations.dark3,
      light4: colorVariations.dark4,
      light5: colorVariations.dark5,
      dark1: colorVariations.light1,
      dark2: colorVariations.light2,
      dark3: colorVariations.light3,
      dark4: colorVariations.light4,
      dark5: colorVariations.light5,
    };
  }

  private generateColors(): Record<string, ThemeColors> {
    const colors: Record<string, ThemeColors> = {};
    Object.entries(this.systemColors).forEach(([key, value]) => {
      colors[key] = this.generateColorVariations(value);
    });
    return colors;
  }

  private getLegacySupersetTheme(
    systemColors: SystemColors,
    isDarkTheme = false,
  ): LegacySupersetTheme {
    const colors = this.generateColors();
    let theme: LegacySupersetTheme = {
      borderRadius: 4,
      body: {
        backgroundColor: '#FFF',
        color: '#000',
      },
      colors: {
        darkest: '#000',
        lightest: '#FFF',
        text: {
          label: '#879399',
          help: '#737373',
        },
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        warning: colors.warning,
        alert: colors.alert,
        success: colors.success,
        info: colors.info,
        grayscale: colors.grayscale,
      },
      opacity: {
        light: '10%',
        mediumLight: '35%',
        mediumHeavy: '60%',
        heavy: '80%',
      },
      typography: {
        families: {
          sansSerif: `'Inter', Helvetica, Arial`,
          serif: `Georgia, 'Times New Roman', Times, serif`,
          monospace: `'Fira Code', 'Courier New', monospace`,
        },
        weights: {
          light: 200,
          normal: 400,
          medium: 500,
          bold: 600,
        },
        sizes: {
          xxs: 9,
          xs: 10,
          s: 12,
          m: 14,
          l: 16,
          xl: 21,
          xxl: 28,
        },
      },
      zIndex: {
        aboveDashboardCharts: 10,
        dropdown: 11,
        max: 3000,
      },
      transitionTiming: 0.3,
      gridUnit: 4,
      brandIconMaxWidth: 37,
    };

    if (isDarkTheme) {
      theme = this.makeThemeDark(theme);
    }

    return theme;
  }

  private getAntdSeed(): Record<string, any> {
    const theme = this.theme!;
    return {
      ...antdThemeImport.defaultSeed,

      borderRadius: theme.borderRadius,

      colorPrimary: theme.colors.primary.base,
      colorError: theme.colors.error.base,
      colorInfo: theme.colors.info.base,
      colorSuccess: theme.colors.success.base,
      colorWarning: theme.colors.warning.base,
      colorBgLayout: theme.colors.grayscale.light5,

      colorLink: theme.colors.primary.dark1,

      controlHeight: 32,
      fontFamily: theme.typography.families.sansSerif,
      fontFamilyCode: theme.typography.families.monospace,
      fontSize: theme.typography.sizes.m,
      lineType: 'solid',
      lineWidth: 1,
      sizeStep: theme.gridUnit,
      sizeUnit: theme.gridUnit,
      zIndexBase: 0,
      zIndexPopupBase: theme.zIndex.max,
      /*
      components: {
        Alert: {
          borderRadius: theme.borderRadius,
          fontSize: theme.typography.sizes.m,
          fontSizeLG: theme.typography.sizes.m,
          fontSizeIcon: theme.typography.sizes.l,
          colorText: theme.colors.grayscale.dark4,
          colorTextHeading: theme.colors.grayscale.dark4,
        },
        Avatar: {
          containerSize: 32,
          fontSize: theme.typography.sizes.s,
          lineHeight: 32,
        },
        Badge: {
          paddingXS: theme.gridUnit * 2,
        },
        Card: {
          paddingLG: theme.gridUnit * 6,
          fontWeightStrong: theme.typography.weights.medium,
          colorBgContainer: theme.colors.grayscale.light4,
        },
        Divider: {
          colorSplit: supersetTheme.colors.grayscale.light3,
        },
        Input: {
          colorBorder: theme.colors.secondary.light3,
          colorBgContainer: theme.colors.grayscale.light5,
          activeShadow: `0 0 0 ${theme.gridUnit / 2}px ${
            theme.colors.primary.light3
          }`,
        },
        InputNumber: {
          colorBorder: theme.colors.secondary.light3,
          colorBgContainer: theme.colors.grayscale.light5,
          activeShadow: `0 0 0 ${theme.gridUnit / 2}px ${
            theme.colors.primary.light3
          }`,
        },
        List: {
          itemPadding: `${theme.gridUnit + 2}px ${theme.gridUnit * 3}px`,
          paddingLG: theme.gridUnit * 3,
          colorSplit: theme.colors.grayscale.light3,
          colorText: theme.colors.grayscale.dark1,
        },
        Modal: {
          colorBgMask: `${theme.colors.grayscale.dark2}73`,
          contentBg: theme.colors.grayscale.light5,
          titleFontSize: theme.gridUnit * 4,
          titleColor: `${theme.colors.grayscale.dark2}D9`,
          headerBg: theme.colors.grayscale.light4,
        },
        Tag: {
          borderRadiusSM: 2,
          defaultBg: theme.colors.grayscale.light4,
        },
        Progress: {
          fontSize: theme.typography.sizes.s,
          colorText: theme.colors.text.label,
          remainingColor: theme.colors.grayscale.light4,
        },
        Popover: {
          colorBgElevated: theme.colors.grayscale.light5,
        },
        Slider: {
          trackBgDisabled: theme.colors.grayscale.light1,
          colorBgElevated: theme.colors.grayscale.light5,
          handleSizeHover: 10,
          handleLineWidthHover: 2,
        },
        Switch: {
          colorPrimaryHover: theme.colors.primary.base,
          colorTextTertiary: theme.colors.grayscale.light1,
        },
        Tooltip: {
          fontSize: theme.typography.sizes.s,
          lineHeight: 1.6,
        },
      },
    }
    */
    };
  }

  private getFilteredAntdTheme(): Record<string, any> {
    const theme = this.antdTheme!;
    const filteredTheme: Record<string, any> = {};

    Object.entries(theme).forEach(([key, value]) => {
      if (!Theme.denyList.some(deny => deny.test(key))) {
        filteredTheme[key] = value;
      }
    });

    return filteredTheme;
  }

  private setThemeWithSystemColors(
    systemColors: SystemColors,
    isDarkMode: boolean,
  ): void {
    this.theme = this.getLegacySupersetTheme(systemColors, isDarkMode);
  }

  private setAntdThemeFromTheme(): void {
    const seed = this.getAntdSeed();
    const algorithm = this.isDarkMode
      ? antdThemeImport.darkAlgorithm
      : antdThemeImport.defaultAlgorithm;

    this.antdConfig = {
      token: seed,
      algorithm,
    };

    this.antdTheme = algorithm(seed as any);
  }
}
