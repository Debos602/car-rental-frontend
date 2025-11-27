// Ant Design v5 theme configuration using a Chocolate palette
// Ready to import into ConfigProvider: `import antdTheme from './theme/antdTheme'`

const antdTheme = {
    token: {
        // Core palette
        colorPrimary: '#7B3F00', // Chocolate
        colorPrimaryHover: '#A0522D', // Soft Chocolate
        colorBgBase: '#FFFFFF', // Background
        colorBgContainer: '#FFFFFF',
        colorTextBase: '#000000', // Text

        // Radius
        borderRadius: 8,
    },

    components: {
        Button: {
            colorPrimary: '#7B3F00',
            colorPrimaryHover: '#A0522D',
            borderRadius: 8,
        },

        Layout: {
            // Header, sider, and body backgrounds
            colorBgHeader: '#000000',
            colorBgSider: '#7B3F00',
            colorBgLayout: '#FFFFFF',
        },

        Menu: {
            // Menu container and item tokens
            colorBgContainer: '#7B3F00',
            colorText: '#FFFFFF',
            colorItemBgHover: '#A0522D',
            colorItemTextHover: '#FFFFFF',
            colorItemBgSelected: '#A0522D',
            colorItemTextSelected: '#FFFFFF',
        },

        Input: {
            // Input borders for default/hover/focus states
            colorBorder: '#7B3F00',
            colorBorderHover: '#A0522D',
            colorBorderFocus: '#A0522D',
        },

        Card: {
            // Card border and header
            colorBorder: '#7B3F00',
            colorBgContainer: '#FFFFFF',
        },
    },
};

export default antdTheme as any;
