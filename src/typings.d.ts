/* SystemJS module definition */
declare var module: NodeModule;
	interface NodeModule {
		id: string;
	}

declare var ga: Function;

/*declare module '*.json' {
	const value: any;
	export default value;
}*/

declare module '*.json' {
	export class JSON {
		[key: string]: any
	}
}

declare module 'diaspora';

interface JQuery{
	isOnScreen(): boolean;
}
