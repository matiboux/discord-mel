import ISerialize from '../../../functions/ISerialize'
import IUnserialize from '../../../functions/IUnserialize'
import serialize from '../../../functions/serialize'

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

	public abstract unserialize(other: any): this
}

export default AbstractDBMapType
