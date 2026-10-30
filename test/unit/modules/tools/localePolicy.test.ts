import { beforeAll, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)

let isSchoolIntranetHost: (host: string) => boolean
let pickBrowserLocale: (header: string | undefined) => string

beforeAll(async () => {
  ({ isSchoolIntranetHost, pickBrowserLocale } = await import('../../../../modules/tools/server/middleware/locale-policy'))
})

describe('tools locale host policy', () => {
  it('defaults school intranet hosts to English', () => {
    expect(isSchoolIntranetHost('10.28.1.157:81')).toBe(true)
    expect(isSchoolIntranetHost('192.168.1.20')).toBe(true)
    expect(isSchoolIntranetHost('172.16.0.8')).toBe(true)
    expect(isSchoolIntranetHost('localhost:3000')).toBe(true)
  })

  it('lets the public tools domain follow the browser language', () => {
    expect(isSchoolIntranetHost('tools.yunshuling.com')).toBe(false)
    expect(isSchoolIntranetHost('example.com')).toBe(false)
  })

  it('maps browser language headers to supported locales', () => {
    expect(pickBrowserLocale('zh-CN,zh;q=0.9')).toBe('zh-CN')
    expect(pickBrowserLocale('zh-TW,zh;q=0.9')).toBe('zh-TW')
    expect(pickBrowserLocale('ja-JP,ja;q=0.9')).toBe('ja')
    expect(pickBrowserLocale('fr-CA,fr;q=0.9')).toBe('fr')
    expect(pickBrowserLocale('en-US,en;q=0.9')).toBe('en')
    expect(pickBrowserLocale(undefined)).toBe('en')
  })
})
