/**
 * BetterDiscord Theme Manager Module
 * Copyright (c) 2015-present Jiiks/JsSucks - https://github.com/Jiiks / https://github.com/JsSucks
 * All rights reserved.
 * https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
*/

import ContentManager from './contentmanager';
import Theme from './theme';

export default class ThemeManager extends ContentManager {

    static get localThemes() {
        return this.localContent;
    }

    static get contentType() {
        return 'theme';
    }

    static get moduleName() {
        return 'Theme Manager';
    }

    static get pathId() {
        return 'themes';
    }

    static get loadAllThemes() {
        return this.loadAllContent;
    }

    static get loadContent() { return this.loadTheme }
    static async loadTheme(paths, configs, info, main) {
        try {
            const instance = new Theme({
                configs, info, main,
                paths: {
                    contentPath: paths.contentPath,
                    dirName: paths.dirName,
                    mainPath: paths.mainPath
                }
            });
            if (!instance.css) instance.recompile();
            else if (instance.enabled) instance.enable();
            return instance;
        } catch (err) {
            throw err;
        }
    }

    static enableTheme(theme) {
        theme.enable();
    }

    static disableTheme(theme) {
        theme.disable();
    }

    static reloadTheme(theme) {
        theme.recompile();
    }

    static getConfigAsSCSS(config) {
        const variables = [];

        for (let category of config) {
            for (let setting of category.settings) {
                variables.push(this.parseSetting(setting));
            }
        }
        return variables.join('\n');
    }

    static parseSetting(setting) {
        const { type, id, value } = setting;
        const name = id.replace(/[^a-zA-Z0-9-]/g, '-').replace(/--/g, '-');

        if (type === 'slider') {
            return `$${name}: ${value * setting.multi || 1};`;
        }

        if (type === 'dropdown' || type === 'radio') {
            return `$${name}: ${setting.options.find(opt => opt.id === value).value};`;
        }

        if (typeof value === 'boolean' || typeof value === 'number') {
            return `$${name}: ${value};`;
        }

        if (typeof value === 'string') {
            return `$${name}: ${setting.scss_raw ? value : `'${setting.value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`};`;
        }
    }

}