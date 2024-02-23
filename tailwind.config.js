const defaultTheme = require('tailwindcss/defaultTheme');

const SIDE_BAR_WIDTH = 216;
const SIDE_BAR_V2_WIDTH = 300;
const SUB_SIDE_BAR_WIDTH = 320;
const SUB_SIDE_BAR_COLLAPSED_WIDTH = 0;
const TOTAL_SIDE_BAR_WIFTH = 516;
const HEADER_HEIGHT = 50;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [],
  theme: {
    screens: {
      xsm: '375px',
      sm: '640px',
      md: '744px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1440px',
      xxxl: '1720px',
      xxxxl: '1920px',
    },
    fontSize: {
      xs: '9px',
      sm: '11px',
      base: '13px',
      lg: '16px',
      xl: '19px',
      '2xl': '22px',
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      lg: '-1px',
      md: '-0.5px',
      sm: '-0.4px',
      xs: '-0.15px',
    },
    extend: {
      fontFamily: {
        inter: ["'Inter', sans-serif", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        surface: {
          default: 'var(--surface-base)',
          base: 'var(--surface-base)',
          'base-reverse': 'var(--surface-base-reverse)',
          overlay: 'var(--surface-overlay)',
          'overlay-reverse': 'var(--surface-overlay-reverse)',
          alt: 'var(--surface-alt)',
          'alt-2': 'var(--surface-alt-2)',
          'alt-absolute': 'var(--surface-alt-absolute)',
          div: 'var(--surface-div)',
        },
        action: {
          hover: 'var(--action-hover)',
          selected: 'var(--action-selected)',
          focused: 'var(--action-focused)',
        },
        content: {
          default: 'var(--content-primary)',
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
          'primary-reverse': 'var(--content-primary-reverse)',
          'primary-bg': 'var(--content-primary-bg)',
          'secondary-reverse': 'var(--content-secondary-reverse)',
          'tertiary-reverse': 'var(--content-tertiary-reverse)',
          'tertiary-bg-2': 'var(--content-tertiary-bg-2)',
          'tertiary-bg-3': 'var(--content-tertiary-bg-3)',
        },
        accent: {
          default: 'var(--accent-main)',
          main: 'var(--accent-main)',
          hover: 'var(--accent-hover)',
          bg: 'var(--accent-bg)',
          'bg-2': 'var(--accent-bg-2)',
          'bg-2-abs': 'var(--accent-bg-2-abs)',
          'bg-2-abs-2': 'var(--accent-bg-2-abs-2)',
          content: 'var(--accent-content)',
        },
        warning: {
          default: 'var(--warning-main)',
          main: 'var(--warning-main)',
          bg: 'var(--warning-bg)',
          'bg-3': 'var(--warning-bg-3)',
          content: 'var(--warning-content)',
        },
        success: {
          default: 'var(--success-main)',
          main: 'var(--success-main)',
          bg: 'var(--success-bg)',
          'bg-3': 'var(--success-bg-3)',
          content: 'var(--success-content)',
        },
        error: {
          default: 'var(--error-main)',
          main: 'var(--error-main)',
          hover: 'var(--error-hover)',
          bg: 'var(--error-bg)',
          'bg-3': 'var(--error-bg-3)',
          content: 'var(--error-content)',
        },
        issue: {
          story: 'var(--issue-story)',
          bug: 'var(--issue-bug)',
          task: 'var(--issue-task)',
          initiative: 'var(--issue-initiative)',
          custom: 'var(--issue-custom)',
          epic: 'var(--issue-epic)',
          subtask: 'var(--issue-subtask)',
        },
        info: {
          default: 'var(--info-main)',
          main: 'var(--info-main)',
          bg: 'var(--info-bg)',
          content: 'var(--info-content)',
        },
        priority: {
          highest: 'var(--priority-highest)',
          high: 'var(--priority-high)',
          medium: 'var(--priority-medium)',
          low: 'var(--priority-low)',
          lowest: 'var(--priority-lowest)',
        },
        graph: {
          blue: 'var(--graph-blue)',
          pink: 'var(--graph-pink)',
          orange: 'var(--graph-orange)',
          green: 'var(--graph-green)',
        },
      },
      boxShadow: {
        default:
          '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
        base: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
        sm: '0px 1px 2px rgba(0, 0, 0, 0.08)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
        '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      dropShadow: {
        default:
          '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
        base: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
        sm: '0px 1px 2px rgba(0, 0, 0, 0.08)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
        '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      lineHeight: {
        sm: '16px',
        md: '18px',
        lg: '20px',
        xl: '22px',
        '2xl': '24px',
      },
      width: {
        sidebar: `${SIDE_BAR_WIDTH}px`,
        'sidebar-v2': `${SIDE_BAR_V2_WIDTH}px`,
        subSidebar: `${SUB_SIDE_BAR_WIDTH}px`,
        subSidebarCollapsed: `${SUB_SIDE_BAR_COLLAPSED_WIDTH}px`,
        totalSidebar: `${TOTAL_SIDE_BAR_WIFTH}px`,
      },
      height: {
        header: `${HEADER_HEIGHT}px`,
      },
      minHeight: {
        header: `${HEADER_HEIGHT}px`,
      },
      spacing: {
        sidebar: `${SIDE_BAR_WIDTH}px`,
        'sidebar-v2': `${SIDE_BAR_V2_WIDTH}px`,
        subSidebar: `${SUB_SIDE_BAR_WIDTH}px`,
        subSidebarCollapsed: `${SUB_SIDE_BAR_COLLAPSED_WIDTH}px`,
        totalSidebar: `${TOTAL_SIDE_BAR_WIFTH}px`,
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
      },
      zIndex: {
        max: '9999999999',
      },
    },
  },
  variants: {
    scrollbar: ['dark', 'rounded'],
  },
};
