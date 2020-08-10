interface Rule {
  ruleName: string
  active: boolean
  message: string
}
interface StrategyFn {
  (value: string): boolean
}
interface Strategy {
  [prop: string]: (value: string) => boolean
}
interface Field {
  key: string
  value: any
  rules: Rule[]
}
export interface Validator {
  check(): string[]
  addField(key: string, value: any, rules: Rule[]): void
  addStrategy(name: string, fn: StrategyFn): this
  clean(): void
}
function createValidator(): Validator {
  const defaultStrategies: Strategy = {
    required(value) {
      return !!value
    }
  }
  let strategies: Strategy = { ...defaultStrategies }
  let fields: Field[] = []
  let errors: string[] = []
  function checkValue(value: any, ruleArr: Rule[]) {
    ruleArr = ruleArr.filter((rule) => rule.active)
    ruleArr.forEach((rule) => {
      const checkFn = strategies[rule.ruleName]
      if (checkFn) {
        const result = checkFn(value)
        if (!result) {
          errors.push(rule.message)
        }
      } else {
        console.warn(`请先注册${rule.ruleName}规则`)
      }
    })
  }
  return {
    check() {
      errors = []
      if (fields.length === 0) {
        return []
      }
      fields.forEach((field) => {
        checkValue(field.value, field.rules)
      })
      return errors
    },
    addField(key, value, rules) {
      fields.push({ key, value, rules })
    },
    addStrategy(name, fn) {
      strategies[name] = fn
      return this
    },
    clean() {
      strategies = { ...defaultStrategies }
      fields = []
      errors = []
    }
  }
}

export default createValidator
