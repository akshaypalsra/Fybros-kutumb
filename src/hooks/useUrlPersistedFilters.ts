import { useCallback, useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "react-router-dom"

interface FieldConfig<V> {
  param: string
  defaultValue: V
  parse: (raw: string) => V
  serialize: (value: V) => string | null | undefined
}

type FieldsConfig = Record<string, FieldConfig<any>>

type ValuesOf<C extends FieldsConfig> = {
  [K in keyof C]: C[K] extends FieldConfig<infer V> ? V : never
}

export function useUrlPersistedFilters<C extends FieldsConfig>(
  storageKey: string,
  fields: C
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const fieldsRef = useRef(fields)
  fieldsRef.current = fields
  useEffect(() => {
    if (searchParams.toString()) return
    let stored: Record<string, string> = {}
    try {
      const raw = window.localStorage.getItem(storageKey)
      stored = raw ? JSON.parse(raw) : {}
    } catch {
      return
    }
    if (Object.keys(stored).length === 0) return

    const next = new URLSearchParams()
    for (const key of Object.keys(fieldsRef.current)) {
      const config = fieldsRef.current[key]
      const rawValue = stored[config.param]
      if (rawValue) next.set(config.param, rawValue)
    }
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const values = useMemo(() => {
    const result = {} as ValuesOf<C>
    for (const key of Object.keys(fields) as (keyof C)[]) {
      const config = fields[key as string]
      const raw = searchParams.get(config.param)
      result[key] = raw !== null ? config.parse(raw) : config.defaultValue
    }
    return result
  }, [searchParams, fields])

  const setField = useCallback(
    <K extends keyof C>(key: K, value: ValuesOf<C>[K]) => {
      const config = fieldsRef.current[key as string]
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const serialized = config.serialize(value)
        if (serialized) next.set(config.param, serialized)
        else next.delete(config.param)
        return next
      })
    },
    [setSearchParams]
  )

  const setters = useMemo(() => {
    const result = {} as { [K in keyof C]: (value: ValuesOf<C>[K]) => void }
    for (const key of Object.keys(fields) as (keyof C)[]) {
      result[key] = (value: ValuesOf<C>[typeof key]) => setField(key, value)
    }
    return result
  }, [fields, setField])

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  useEffect(() => {
    const toStore: Record<string, string> = {}
    for (const key of Object.keys(fields)) {
      const config = fields[key]
      const serialized = config.serialize(values[key])
      if (serialized) toStore[config.param] = serialized
    }
    try {
      if (Object.keys(toStore).length > 0) {
        window.localStorage.setItem(storageKey, JSON.stringify(toStore))
      } else {
        window.localStorage.removeItem(storageKey)
      }
    } catch { }
  }, [JSON.stringify(values)])

  return { values, setters, clearAll }
}