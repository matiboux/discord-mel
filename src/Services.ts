import Config from './Config'
import DefaultState from './state/DefaultState'

const Services:
	{
		Config: typeof Config,
		State: any,
	} =
	{
		Config: Config,
		State: DefaultState,
	}

export default Services;
