import Config from './Config'
import DefaultState from './state/DefaultState'

const Services:
	{
		Config: any, // extends Config
		State: any, // extends AbstractState
	} =
	{
		Config: Config,
		State: DefaultState,
	}

export default Services
