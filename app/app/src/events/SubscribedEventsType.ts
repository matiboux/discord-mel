type SubscribedEventsType =
	{
		// [eventName: string]:
		// 	string |
		// 	{ [methodName: string]: number }
		[eventName: string]:
			string[] |
			{
				methodName: string,
				priority: number,
			}[]
	}

export default SubscribedEventsType
