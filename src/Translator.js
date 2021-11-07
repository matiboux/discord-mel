'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class Translator
{
	/**
	 * @type {Object<string, Object<string, Object>>}
	 */
	translations = {}

	/**
	 * @type {string}
	 */
	defaultLanguage = undefined

	/**
	 * @type {string}
	 */
	currentLanguage = undefined

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	constructor(dirpath, defaultLanguage = undefined)
	{
		this.addTranslations(dirpath, defaultLanguage)
	}

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	addTranslations(dirpath, defaultLanguage = undefined)
	{
		if (dirpath)
			fs.readdirSync(dirpath)
				.filter(file => file.match(/\.ya?ml$/))
				.forEach(file =>
					{
						try
						{
							const translationsYaml = yaml.load(fs.readFileSync(`${dirpath}/${file}`, 'utf8'))
							const translations = {}
							const flattenTranslations = (obj, keyPrefix) =>
								{
									if (!obj) return
									for (const [key, value] of Object.entries(obj))
									{
										const flatKey = `${keyPrefix}.${key}`
										if (typeof value === 'object')
											flattenTranslations(value, flatKey)
										else
											translations[flatKey.slice(1)] = value
									}
								}
							flattenTranslations(translationsYaml, '');

							const language = path.parse(`${file}`).name
							if (!this.defaultLanguage)
								this.defaultLanguage = language

							if (typeof this.translations[language] !== 'object')
								this.translations[language] = {}
							Object.assign(this.translations[language], translations)
						}
						catch (e)
						{
							console.log(e);
						}
					})

		if (defaultLanguage)
			this.setDefaultLanguage(defaultLanguage)
	}

	/**
	 * @return {string}
	 */
	getDefaultLanguage()
	{
		return this.defaultLanguage
	}

	/**
	 * @param {string} defaultLanguage
	 * @returns {boolean}
	 */
	setDefaultLanguage(defaultLanguage)
	{
		// if (defaultLanguage && typeof this.translations[defaultLanguage] !== 'undefined')
		// {
			this.defaultLanguage = defaultLanguage
			return true
		// }

		// return false
	}

	/**
	 * @return {string}
	 */
	getCurrentLanguage()
	{
		return this.currentLanguage
	}

	/**
	 * @param {string} currentLanguage
	 * @returns {boolean}
	 */
	setCurrentLanguage(currentLanguage)
	{
		// if (currentLanguage && typeof this.translations[currentLanguage] !== 'undefined')
		// {
			this.currentLanguage = currentLanguage
			return true
		// }

		// return false
	}

	resetCurrentLanguage()
	{
		this.currentLanguage = undefined
	}

	/**
	 * @param {string} key
	 * @param {string} language
	 * @param {Object<string, string>} arguments
	 * @return {string}
	 */
	translate(key, language = undefined, args = undefined)
	{
		if (typeof language === 'object')
		{
			args = language
			language = undefined
		}

		/** @type {string} */
		let translation = this.translations?.[language]?.[key]
		if (!translation) translation = this.translations?.[this.currentLanguage]?.[key]
		if (!translation) translation = this.translations?.[this.defaultLanguage]?.[key]
		if (!translation)
		{
			translation = key
			console.error(this.translate('translator.missing_key', {
					'%key%': key
				}))
		}

		if (typeof args === 'object')
			for (const [key, value] of Object.entries(args))
				translation = translation.replaceAll(key, value)

		return translation
	}
}

module.exports = Translator
