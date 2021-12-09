import DefaultConfig from './config/DefaultConfig'
import DefaultState from './state/DefaultState'

const Services:
	{
		Config: any, // extends DefaultConfig
		State: any, // extends AbstractState
	} =
	{
		Config: DefaultConfig,
		State: DefaultState,
	}

export default Services
