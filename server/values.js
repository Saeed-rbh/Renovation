import { isDeepStrictEqual } from 'node:util';

export function decode(value) {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) {
    const number = Number(value.integerValue);
    return Number.isSafeInteger(number) ? number : value.integerValue;
  }
  if ('doubleValue' in value) return value.doubleValue;
  if ('stringValue' in value) return value.stringValue;
  if ('timestampValue' in value) return { __timestamp: value.timestampValue, seconds: Math.floor(Date.parse(value.timestampValue) / 1000) };
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  if ('referenceValue' in value) return value.referenceValue;
  if ('bytesValue' in value) return { __bytes: value.bytesValue };
  if ('geoPointValue' in value) return { __geoPoint: value.geoPointValue };
  throw new Error('Unsupported stored value type');
}

export function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decode(value)]));
}

export function encode(value, previous) {
  if (previous && isDeepStrictEqual(value, decode(previous))) return previous;
  if (value === null) return { nullValue: null };
  if (value?.__op === 'serverTimestamp') return { timestampValue: new Date().toISOString() };
  if (value?.__op === 'increment') {
    const amount = value.amount;
    if (!Number.isSafeInteger(amount)) throw new Error('Invalid increment');
    if (previous?.integerValue !== undefined) return { integerValue: String(BigInt(previous.integerValue) + BigInt(amount)) };
    return encode((previous ? Number(decode(previous)) : 0) + amount);
  }
  if (value?.__timestamp) return { timestampValue: value.__timestamp };
  if (value?.__bytes) return { bytesValue: value.__bytes };
  if (value?.__geoPoint) return { geoPointValue: value.__geoPoint };
  if (Array.isArray(value)) return { arrayValue: { values: value.map((v, i) => encode(v, previous?.arrayValue?.values?.[i])) } };
  if (typeof value === 'object') return { mapValue: { fields: encodeFields(value, previous?.mapValue?.fields) } };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number' && Number.isFinite(value)) return Number.isSafeInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  throw new Error('Invalid document value');
}

export function encodeFields(data, previous = {}) {
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Expected document object');
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encode(value, previous[key])]));
}
