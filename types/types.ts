
export interface RequestHandler {
  (data: any, callback: any): void
}

/**
 * Generic map types
 * key: String, value: T
 */
export interface GenericStringMap<T> { 
  [key: string]: T; 
}
export interface GenericNumberMap<T> { 
  [key: number]: T; 
}

/**
 * key: String, value: Any
 */

export interface HandlerMap extends GenericStringMap<RequestHandler> {}

/**
 * key: String, value: Any
 */
export interface StringAnyMap extends GenericStringMap<any> {}
export interface NumberAnyMap extends GenericNumberMap<any> {}

export interface StringStringMap extends GenericStringMap<string> {}
export interface NumberStringMap extends GenericNumberMap<string> {}

export interface StringNumberMap extends GenericStringMap<number> {}
export interface NumberNumberMap extends GenericNumberMap<number> {}

export interface StringBooleanMap extends GenericStringMap<boolean> {}
export interface NumberBooleanMap extends GenericNumberMap<boolean> {}