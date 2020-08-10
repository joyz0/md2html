import createValidator, { Validator } from '../createValidator'
import pattern from '../regex'

describe('测试createValidator', () => {
  let validator: Validator
  let errors: string[]
  beforeAll(() => {
    validator = createValidator()
  })
  afterEach(() => {
    errors = []
    validator.clean()
  })

  it('默认支持required', () => {
    const spyWarn = jest.spyOn(console, 'warn')
    validator.addField('name', 'zzz', [
      { ruleName: 'required', active: true, message: '请输入name' }
    ])
    errors = validator.check()
    expect(spyWarn).not.toHaveBeenCalled()
    expect(errors.length).toBe(0)

    validator.clean()

    validator.addField('name', '', [
      { ruleName: 'required', active: true, message: '请输入name' }
    ])
    errors = validator.check()
    expect(errors.length).toBe(1)
    expect(errors[0]).toBe('请输入name')
    spyWarn.mockRestore()
  })

  it('其他规则需要先注册', () => {
    validator.addField('age', 'zzz', [
      { ruleName: 'number', active: true, message: '请输入数字' }
    ])
    expect(() => (errors = validator.check())).toLowPriorityWarnDev(
      '请先注册number规则',
      {
        withoutStack: true
      }
    )
    expect(errors.length).toBe(0)

    validator.addStrategy('number', (value) => {
      return pattern.number.test(value)
    })
    errors = validator.check()
    expect(errors.length).toBe(1)
    expect(errors[0]).toBe('请输入数字')
  })

  it('每次check()都会清空内部缓存errors', () => {
    validator.addField('name', '', [
      { ruleName: 'required', active: true, message: '请输入name' }
    ])
    expect(errors.length).toBe(0)
    errors = validator.check()
    expect(errors.length).toBe(1)
    errors = validator.check()
    expect(errors.length).toBe(1)
  })

  it('clean()会把注册的strategy还原和fields清空', () => {
    validator.addStrategy('phone', (value) => {
      return pattern.phone.test(value)
    })
    validator.addField('phone', 'zzz', [
      { ruleName: 'phone', active: true, message: '请输入手机' }
    ])

    errors = validator.check()
    expect(errors.length).toBe(1)

    validator.clean()

    validator.addField('phone', 'zzz', [
      { ruleName: 'phone', active: true, message: '请输入手机' }
    ])
    expect(() => (errors = validator.check())).toLowPriorityWarnDev(
      '请先注册phone规则',
      {
        withoutStack: true
      }
    )
    expect(errors.length).toBe(0)
  })

  it('可以覆盖已存在的strategy', () => {
    validator.addStrategy('required', (value) => {
      return !value
    })
    validator.addField('name', 'zzz', [
      { ruleName: 'required', active: true, message: '请输入name' }
    ])
    errors = validator.check()
    expect(errors.length).toBe(1)
  })
})
