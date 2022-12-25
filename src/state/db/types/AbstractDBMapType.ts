import ISerialize from '../../../functions/ISerialize.js'
import IUnserialize from '../../../functions/IUnserialize.js'
import serialize from '../../../functions/serialize.js'

abstract class AbstractDBMapType<K, V> extends Map<K, V> implements ISerialize, IUnserialize
{
	public serialize(): any
	{
		const entries: any = {}
		for (const [key, value] of this.entries())
		{
			entries[key] = serialize(value)
		}

		return entries
	}

	public abstract unserialize(object: any): this
}

export default AbstractDBMapType
