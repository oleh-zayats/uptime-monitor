
export interface RequestHandler {
  (data: any, callback: any): void
}

/**
 * Generic map types
 */
export interface GenericStringMap<T> { 
  [key: string]: T; 
}
export interface GenericNumberMap<T> { 
  [key: number]: T; 
}

/**
 * key: String, value: RequestHandler
 */
export interface RequestHandlerMap extends GenericStringMap<RequestHandler> {
}

/**
 * key: String, value: Any OR
 * key: Number, value: Any
 */
export interface StringAnyMap extends GenericStringMap<any> {
}
export interface NumberAnyMap extends GenericNumberMap<any> {
}

/**
 * key: String, value: String OR
 * key: Number, value: String
 */
export interface StringStringMap extends GenericStringMap<string> {
}
export interface NumberStringMap extends GenericNumberMap<string> {
}

/**
 * key: String, value: Number OR
 * key: Number, value: Number
 */
export interface StringNumberMap extends GenericStringMap<number> {
}
export interface NumberNumberMap extends GenericNumberMap<number> {
}

/**
 * key: String, value: Boolean OR
 * key: Number, value: Boolean
 */
export interface StringBooleanMap extends GenericStringMap<boolean> {
}
export interface NumberBooleanMap extends GenericNumberMap<boolean> {
}