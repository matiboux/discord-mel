import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

interface ITranslations
{
	[s: string]: ITranslationEntry
}

interface ITranslationEntry
{
	[s: string]: any
}

interface ITranslationArgument
{
	[s: string]: any
}

class Translator
{
	/**
	 * @type {Object<string, Object<string, string>>}
	 */
	translations: ITranslations = {}

	/**
	 * @type {string}
	 */
	defaultLanguage: string | undefined = undefined

	/**
	 * @type {string}
	 */
	currentLanguage: string | undefined = undefined

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	constructor(dirpath: string, defaultLanguage: string | undefined = undefined)
	{
		this.addTranslations(dirpath, defaultLanguage)
	}

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	addTranslations(dirpath: string, defaultLanguage: string | undefined = undefined)
	{
		if (dirpath)
			fs.readdirSync(dirpath)
				.filter(file => file.match(/\.ya?ml$/))
				.forEach(file =>
					{
						try
						{
							const translationsYaml = yaml.load(fs.readFileSync(`${dirpath}/${file}`, 'utf8'))
							const translations: ITranslationEntry = {}
							const flattenTranslations = (obj: Object, keyPrefix: string) =>
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
							flattenTranslations(translationsYaml as Object, '');

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
	 * @return {string|undefined}
	 */
	getDefaultLanguage(): string | undefined
	{
		return this.defaultLanguage
	}

	/**
	 * @param {string} defaultLanguage
	 * @returns {boolean}
	 */
	setDefaultLanguage(defaultLanguage: string): boolean
	{
		// if (defaultLanguage && typeof this.translations[defaultLanguage] !== 'undefined')
		// {
			this.defaultLanguage = defaultLanguage
			return true
		// }

		// return false
	}

	/**
	 * @return {string|undefined}
	 */
	getCurrentLanguage(): string | undefined
	{
		return this.currentLanguage
	}

	/**
	 * @param {string} currentLanguage
	 * @returns {boolean}
	 */
	setCurrentLanguage(currentLanguage: string): boolean
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
	translate(key: string, language: string | ITranslationArgument | undefined = undefined, args: ITranslationArgument = {}): string
	{
		if (typeof language === 'object')
		{
			args = language
			language = undefined
		}

		let translation = (() =>
			{
				let translation
				if (language !== undefined)
				{
					translation = this.translations?.[language]?.[key]
					if (translation) return translation
				}

				if (this.currentLanguage !== undefined)
				{
					translation = this.translations?.[this.currentLanguage]?.[key]
					if (translation) return translation
				}

				if (this.defaultLanguage !== undefined)
				{
					translation = this.translations?.[this.defaultLanguage]?.[key]
					if (translation) return translation
				}

				if (this.defaultLanguage !== 'en')
				{
					translation = this.translations?.['en']?.[key]
					if (translation) return translation
				}

				console.error(this.translate('translator.missing_key', { '%key%': key }))
				return key
			})()

		if (typeof args === 'object')
			for (const [key, value] of Object.entries(args))
				translation = translation.replaceAll(key, value)

		return translation
	}
}

export default Translator
