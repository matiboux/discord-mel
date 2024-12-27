import DefaultConfig from './config/DefaultConfig.js'
import DefaultState from './state/DefaultState.js'

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
