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
	defaultLanguage?: string

	/**
	 * @type {string}
	 */
	currentLanguage?: string

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	constructor(dirpath: string, defaultLanguage?: string)
	{
		this.addTranslations(dirpath, defaultLanguage)
	}

	/**
	 * @param {string} dirpath
	 * @param {string} defaultLanguage
	 */
	addTranslations(dirpath: string, defaultLanguage?: string)
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
							const flattenTranslations = (obj: object, keyPrefix: string) =>
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
							flattenTranslations(translationsYaml as object, '');

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
	 * @param {string} translationKey
	 * @param {string|ITranslationArgument|undefined} language
	 * @param {ITranslationArgument} args
	 * @return {string}
	 */
	translate(translationKey: string, language?: string | ITranslationArgument, args: ITranslationArgument = {}): string
	{
		if (typeof language === 'object')
		{
			args = language
			language = undefined
		}

		let translation = (() =>
			{
				if (language !== undefined)
				{
					const candidate = this.translations?.[language]?.[translationKey]
					if (candidate) return candidate
				}

				if (this.currentLanguage !== undefined)
				{
					const candidate = this.translations?.[this.currentLanguage]?.[translationKey]
					if (candidate) return candidate
				}

				if (this.defaultLanguage !== undefined)
				{
					const candidate = this.translations?.[this.defaultLanguage]?.[translationKey]
					if (candidate) return candidate
				}

				const fallbackLanguage = 'en'
				if (this.defaultLanguage !== fallbackLanguage)
				{
					const candidate = this.translations?.[fallbackLanguage]?.[translationKey]
					if (candidate) return candidate
				}

				if (translationKey !== 'translator.missing_key')
					console.error(this.translate('translator.missing_key', { '%key%': translationKey }))

				return null
			})()

		const argsEntries = Object.entries(args)
		if (translation !== null)
		{
			for (const [key, value] of argsEntries)
				translation = translation.replaceAll(key, value)

			return translation
		}
		else if (argsEntries.length > 0)
		{
			const argsString = argsEntries.map(([key, value]) => `'${key}'='${value}'`).join(', ')
			return `${translationKey}[${argsString}]`
		}
		else
		{
			return translationKey
		}
	}
}

export default Translator
